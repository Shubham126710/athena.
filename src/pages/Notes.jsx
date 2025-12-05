import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Trash2, Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import PdfViewer from '../components/PdfViewer.jsx';
import { supabase } from '../lib/supabaseClient';
import HubNavbar from '../components/HubNavbar.jsx';
import { useAuth } from '../context/AuthContext';

export default function NotesPage() {
  const nav = useNavigate();
  const { profile } = useAuth();
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  // Upload Form State
  const [file, setFile] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [uploadSubject, setUploadSubject] = React.useState('CN');
  const [uploadUnit, setUploadUnit] = React.useState('Unit 1');

  const [selectedNote, setSelectedNote] = React.useState(null);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  
  // Accordion State
  const [expandedSubjects, setExpandedSubjects] = React.useState(['CN', 'FLAT', 'FML', 'PA']);
  const [expandedUnits, setExpandedUnits] = React.useState({});

  const fileInputRef = React.useRef(null);

  const subjects = ['CN', 'FLAT', 'FML', 'PA'];
  const units = ['Unit 1', 'Unit 2', 'Unit 3'];

  // Fetch notes on mount
  React.useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setNotes(data || []);
    } catch (e) {
      console.error('Error loading notes:', e);
      // Fallback to local storage if Supabase fails (optional, but good for transition)
      const localNotes = JSON.parse(localStorage.getItem('pt_notes') || '[]');
      if (localNotes.length > 0) setNotes(localNotes);
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  }

  async function addNote() {
    if (!title.trim() || !file) return;
    setError('');
    setUploading(true);
    
    try {
        // 1. Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${uploadSubject}/${uploadUnit}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
            .from('notes')
            .upload(filePath, file);
            
        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('notes')
            .getPublicUrl(filePath);

        // 3. Insert Metadata into Table
        const newNote = {
            title: title.trim(),
            subject: uploadSubject,
            unit: uploadUnit,
            file_url: publicUrl,
            file_path: filePath
        };

        const { data, error: insertError } = await supabase
            .from('notes')
            .insert([newNote])
            .select();

        if (insertError) throw insertError;

        // Update UI
        setNotes(prev => [data[0], ...prev]);
        
        setShowUploadModal(false);
        setTitle('');
        setFile(null);
        setUploadSubject('CN');
        setUploadUnit('Unit 1');
        if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to upload note.');
    } finally {
        setUploading(false);
    }
  }

  async function remove(note) {
    if(!confirm('Are you sure you want to delete this note?')) return;
    try {
        // 1. Delete from Storage
        if (note.file_path) {
            const { error: storageError } = await supabase.storage
                .from('notes')
                .remove([note.file_path]);
            if (storageError) console.error('Storage delete error:', storageError);
        }

        // 2. Delete from Table
        const { error: tableError } = await supabase
            .from('notes')
            .delete()
            .eq('id', note.id);
            
        if (tableError) throw tableError;

        setNotes(prev => prev.filter(n => n.id !== note.id));
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to delete note.');
    }
  }

  function toggleSubject(subject) {
    setExpandedSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  }

  function toggleUnit(subject, unit) {
    const key = `${subject}-${unit}`;
    setExpandedUnits(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  function getNotesFor(subject, unit) {
    return notes.filter(n => n.subject === subject && n.unit === unit);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <HubNavbar />

      <main className="pt-32 pb-12 px-4 md:px-12 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Notes</h1>
                <p className="text-neutral-400">Manage and view your uploaded documents.</p>
            </div>
            {profile?.role === 'admin' && (
              <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-sm hover:bg-neutral-200 transition-all shadow-sm">
                  <Plus size={16} />
                  Upload Note
              </button>
            )}
        </div>

        {loading ? (
            <div className="text-center py-20 text-neutral-400">Loading notes...</div>
        ) : (
            <div className="space-y-4">
                {subjects.map(subject => (
                    <div key={subject} className="border border-neutral-800 rounded-xl bg-neutral-900 overflow-hidden">
                        <button 
                            onClick={() => toggleSubject(subject)}
                            className="w-full flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
                        >
                            <span className="font-bold text-lg">{subject}</span>
                            {expandedSubjects.includes(subject) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        
                        {expandedSubjects.includes(subject) && (
                            <div className="p-4 space-y-3">
                                {units.map(unit => {
                                    const unitNotes = getNotesFor(subject, unit);
                                    const isExpanded = expandedUnits[`${subject}-${unit}`];
                                    
                                    return (
                                        <div key={unit} className="border border-neutral-800 rounded-lg overflow-hidden">
                                            <button 
                                                onClick={() => toggleUnit(subject, unit)}
                                                className="w-full flex items-center justify-between p-3 bg-neutral-900 hover:bg-neutral-800 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isExpanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                                                    <span className="font-medium">{unit}</span>
                                                    <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">{unitNotes.length}</span>
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="p-3 bg-neutral-950/30 border-t border-neutral-800">
                                                    {unitNotes.length === 0 ? (
                                                        <p className="text-sm text-neutral-400 italic pl-3 md:pl-6">No notes uploaded.</p>
                                                    ) : (
                                                        <div className="grid gap-3 pl-2 md:pl-6">
                                                            {unitNotes.map(note => (
                                                                <div key={note.id} className="flex items-center justify-between bg-neutral-900 p-3 rounded border border-neutral-800 hover:shadow-sm transition-all">
                                                                    <div className="flex-1 min-w-0 flex items-center gap-3 overflow-hidden">
                                                                        <div className="w-8 h-8 bg-red-900/20 text-red-400 rounded flex items-center justify-center flex-shrink-0">
                                                                            <FileText size={16} />
                                                                        </div>
                                                                        <div className="truncate">
                                                                            <h4 className="font-medium text-sm truncate" title={note.title}>{note.title}</h4>
                                                                            <p className="text-xs text-neutral-400">{new Date(note.created_at).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                                        <button onClick={() => setSelectedNote(note)} className="text-xs font-medium px-3 py-1.5 border border-neutral-700 rounded hover:bg-white hover:text-black transition-colors">
                                                                            View
                                                                        </button>
                                                                        {profile?.role === 'admin' && (
                                                                          <button onClick={() => remove(note)} className="text-neutral-400 hover:text-red-600 p-1.5">
                                                                              <Trash2 size={14} />
                                                                          </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* PDF Viewer Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                    <h3 className="font-bold text-lg truncate text-white">{selectedNote.title}</h3>
                    <button onClick={() => setSelectedNote(null)} className="text-neutral-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-neutral-950 p-4 flex justify-center">
                     <PdfViewer fileUrl={selectedNote.file_url || selectedNote.fileUrl} />
                </div>
            </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Upload Note</h3>
                    <button onClick={() => setShowUploadModal(false)} className="text-neutral-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">Subject</label>
                        <select 
                            value={uploadSubject} 
                            onChange={e => setUploadSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-700 rounded focus:outline-none focus:border-white transition-colors bg-neutral-800 text-white"
                        >
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">Unit</label>
                        <select 
                            value={uploadUnit} 
                            onChange={e => setUploadUnit(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-700 rounded focus:outline-none focus:border-white transition-colors bg-neutral-800 text-white"
                        >
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. Chapter 1 Summary" 
                            className="w-full px-3 py-2 border border-neutral-700 rounded focus:outline-none focus:border-white transition-colors bg-neutral-800 text-white placeholder:text-neutral-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">File (PDF)</label>
                        <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center hover:bg-neutral-800 transition-colors cursor-pointer relative">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFile} 
                                accept="application/pdf" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="mx-auto text-neutral-400 mb-2" size={24} />
                            <p className="text-sm text-neutral-500">
                                {fileInputRef.current?.files?.[0]?.name || "Click to browse or drag file"}
                            </p>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex justify-end gap-3">
                    <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white">Cancel</button>
                    <button 
                        onClick={addNote} 
                        disabled={uploading || !title || !file}
                        className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {uploading ? 'Uploading...' : 'Upload Note'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
