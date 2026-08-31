import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Trash2, Search, Plus, ChevronDown, ChevronRight, Eye } from 'lucide-react';
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
  const [semester, setSemester] = React.useState('7th');
  
  // Upload Form State
  const [link, setLink] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [uploadSubject, setUploadSubject] = React.useState('CV');
  const [uploadUnit, setUploadUnit] = React.useState('Unit 1');

  const [showUploadModal, setShowUploadModal] = React.useState(false);
  
  // Accordion State
  const [expandedSubjects, setExpandedSubjects] = React.useState(['CV', 'NLP', 'RM', 'PHC']);
  const [expandedUnits, setExpandedUnits] = React.useState({});

  const subjects5th = ['CN', 'FLAT', 'FML', 'PA'];
  const subjects6th = ['SE', 'FS-II', 'AML', 'AI', 'SD'];
  const subjects7th = ['CV', 'NLP', 'RM', 'PHC'];
  const subjects = semester === '7th' ? subjects7th : (semester === '6th' ? subjects6th : subjects5th);
  const units = ['Unit 1', 'Unit 2', 'Unit 3'];

  // Keep uploadSubject valid when semester changes
  React.useEffect(() => {
    if (!subjects.includes(uploadSubject)) {
      setUploadSubject(subjects[0]);
    }
  }, [semester, subjects, uploadSubject]);

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
      const localNotes = JSON.parse(localStorage.getItem('pt_notes') || '[]');
      if (localNotes.length > 0) setNotes(localNotes);
    } finally {
      setLoading(false);
    }
  }

  async function addNote() {
    if (!title.trim() || !link.trim()) return;
    setError('');
    setUploading(true);
    
    try {
        const newNote = {
            title: title.trim(),
            subject: uploadSubject,
            unit: uploadSubject === 'PHC' ? 'General' : uploadUnit,
            file_url: link.trim()
        };

        const { data, error: insertError } = await supabase
            .from('notes')
            .insert([newNote])
            .select();

        if (insertError) throw insertError;

        setNotes(prev => [data[0], ...prev]);
        
        setShowUploadModal(false);
        setTitle('');
        setLink('');
        setUploadSubject('CV');
        setUploadUnit('Unit 1');
    } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to add note.');
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
    if (subject === 'PHC') return notes.filter(n => n.subject === subject);
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
            <div className="flex items-center gap-4">
                <select value={semester} onChange={e => setSemester(e.target.value)} className="px-4 py-2 border border-neutral-800 bg-neutral-900 text-white rounded">
                    <option value="5th">5th Semester</option>
                    <option value="6th">6th Semester</option>
                    <option value="7th">7th Semester</option>
                </select>
            {profile?.role === 'admin' && (
              <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-sm hover:bg-neutral-200 transition-all shadow-sm">
                  <Plus size={16} />
                  Upload Note
              </button>
            )}
            </div>
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
                                {subject === 'PHC' ? (() => {
                                    const phcNotes = getNotesFor(subject);
                                    return (
                                        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950/30 p-3">
                                            {phcNotes.length === 0 ? (
                                                <p className="text-sm text-neutral-400 italic pl-3 md:pl-6">No notes uploaded.</p>
                                            ) : (
                                                <div className="grid gap-3 pl-2 md:pl-6">
                                                    {phcNotes.map(note => (
                                                        <div key={note.id} className="flex items-center justify-between bg-neutral-900 p-2 rounded border border-neutral-800 hover:shadow-sm transition-all">
                                                            <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden mr-2">
                                                                <div className="w-7 h-7 bg-red-900/20 text-red-400 rounded flex items-center justify-center flex-shrink-0">
                                                                    <FileText size={14} />
                                                                </div>
                                                                <div className="truncate">
                                                                    <h4 className="font-medium text-xs md:text-sm truncate" title={note.title}>{note.title}</h4>
                                                                    <p className="text-[10px] text-neutral-400">{new Date(note.created_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                <button 
                                                                    onClick={() => window.open(note.file_url || note.fileUrl, '_blank')} 
                                                                    className="text-xs font-medium px-2 py-1.5 md:px-3 md:py-1.5 border border-neutral-700 rounded hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                                                                    title="View Note"
                                                                >
                                                                    <span className="md:hidden"><Eye size={14} /></span>
                                                                    <span className="hidden md:inline">View</span>
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
                                    );
                                })() : units.map(unit => {
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
                                                                <div key={note.id} className="flex items-center justify-between bg-neutral-900 p-2 rounded border border-neutral-800 hover:shadow-sm transition-all">
                                                                    <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden mr-2">
                                                                        <div className="w-7 h-7 bg-red-900/20 text-red-400 rounded flex items-center justify-center flex-shrink-0">
                                                                            <FileText size={14} />
                                                                        </div>
                                                                        <div className="truncate">
                                                                            <h4 className="font-medium text-xs md:text-sm truncate" title={note.title}>{note.title}</h4>
                                                                            <p className="text-[10px] text-neutral-400">{new Date(note.created_at).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                        <button 
                                                                            onClick={() => window.open(note.file_url || note.fileUrl, '_blank')} 
                                                                            className="text-xs font-medium px-2 py-1.5 md:px-3 md:py-1.5 border border-neutral-700 rounded hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                                                                            title="View Note"
                                                                        >
                                                                            <span className="md:hidden"><Eye size={14} /></span>
                                                                            <span className="hidden md:inline">View</span>
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
                    {uploadSubject !== 'PHC' && (
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
                    )}
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
                        <label className="block text-sm font-medium mb-1 text-neutral-300">Drive Link (URL)</label>
                        <input 
                            type="url" 
                            value={link} 
                            onChange={e => setLink(e.target.value)} 
                            placeholder="https://drive.google.com/..." 
                            className="w-full px-3 py-2 border border-neutral-700 rounded focus:outline-none focus:border-white transition-colors bg-neutral-800 text-white placeholder:text-neutral-600"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex justify-end gap-3">
                    <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white">Cancel</button>
                    <button 
                        onClick={addNote} 
                        disabled={uploading || !title || !link}
                        className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {uploading ? 'Adding...' : 'Add Note'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
