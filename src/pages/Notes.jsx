import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Trash2, Search, Plus, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import PdfViewer from '../components/PdfViewer.jsx';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
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
  const [uploadType, setUploadType] = React.useState('file');
  const [file, setFile] = React.useState(null);
  const [link, setLink] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [uploadSubject, setUploadSubject] = React.useState('CV');
  const [uploadUnit, setUploadUnit] = React.useState('Unit 1');

  const [selectedNote, setSelectedNote] = React.useState(null);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  
  // Accordion State
  const [expandedSubjects, setExpandedSubjects] = React.useState(['CV', 'NLP', 'RM', 'PHC']);
  const [expandedUnits, setExpandedUnits] = React.useState({});

  const fileInputRef = React.useRef(null);

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
      const q = query(collection(db, 'notes'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(data);
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
    if (!title.trim()) return;
    if (uploadType === 'file' && !file) return;
    if (uploadType === 'link' && !link.trim()) return;

    setError('');
    setUploading(true);
    
    try {
        let publicUrl = '';
        let filePath = null;

        if (uploadType === 'file') {
            // 1. Upload file to Cloudinary
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            
            if (!cloudName || !uploadPreset) {
                throw new Error("Cloudinary keys missing in .env");
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', `notes/${uploadSubject}/${uploadUnit}`);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Upload failed');

            publicUrl = data.secure_url;
            filePath = data.public_id;
        } else {
            publicUrl = link.trim();
        }

        // 3. Insert Metadata into Firestore
        const newNote = {
            title: title.trim(),
            subject: uploadSubject,
            unit: uploadSubject === 'PHC' ? 'General' : uploadUnit,
            file_url: publicUrl,
            file_path: filePath,
            created_at: Date.now()
        };

        const docRef = await addDoc(collection(db, 'notes'), newNote);

        // Update UI
        setNotes(prev => [{ id: docRef.id, ...newNote }, ...prev]);
        
        setShowUploadModal(false);
        setTitle('');
        setFile(null);
        setLink('');
        setUploadSubject('CV');
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
        // Note: Cloudinary unsigned API does not support deletion.
        // The file stays in Cloudinary, but the Firestore record is removed.
        
        // 2. Delete from Firestore
        await deleteDoc(doc(db, 'notes', note.id));

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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <HubNavbar />

      <main className="pt-32 pb-12 px-4 md:px-12 max-w-[1400px] mx-auto">
        <div className="mb-16 border-b border-neutral-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <div className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-4 font-mono">
                    Athena / Notes
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white uppercase max-w-xl leading-[1.1]">
                    Academic <span className="font-serif italic font-normal text-neutral-300 normal-case">Archive</span>
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <select 
                    value={semester} 
                    onChange={e => setSemester(e.target.value)} 
                    className="bg-black border border-neutral-800 text-[10px] font-mono tracking-widest uppercase text-white px-4 py-2 hover:border-neutral-600 transition-colors cursor-pointer outline-none"
                >
                    <option value="5th">SEMESTER 05</option>
                    <option value="6th">SEMESTER 06</option>
                    <option value="7th">SEMESTER 07</option>
                </select>
                {profile?.role === 'admin' && (
                  <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-4 py-2 border border-white bg-white text-black text-[10px] font-mono tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors">
                      <Plus size={14} />
                      Upload
                  </button>
                )}
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-[10px] font-mono tracking-widest uppercase text-neutral-500">Retrieving archive data...</div>
        ) : (
            <div className="flex flex-col border-t border-neutral-900">
                {subjects.map(subject => (
                    <div key={subject} className="border-b border-neutral-900 group">
                        <button 
                            onClick={() => toggleSubject(subject)}
                            className="w-full flex items-center justify-between py-6 md:py-8 px-4 -mx-4 hover:bg-neutral-900/30 transition-colors text-left"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-3xl font-bold tracking-tight text-white">{subject}</span>
                                <span className="text-sm font-medium text-neutral-500">Archive</span>
                            </div>
                            <div className="text-neutral-600 group-hover:text-white transition-colors">
                                {expandedSubjects.includes(subject) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                        </button>
                        
                        {expandedSubjects.includes(subject) && (
                            <div className="pb-8 pt-4 px-4 md:px-12 bg-black">
                                {subject === 'PHC' ? (() => {
                                    const phcNotes = getNotesFor(subject);
                                    return (
                                        <div className="p-4 bg-black">
                                            {phcNotes.length === 0 ? (
                                                <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">No records found.</p>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {phcNotes.map(note => (
                                                        <div key={note.id} className="flex items-center justify-between p-4 border-b border-neutral-900 last:border-0 hover:bg-neutral-900/50 transition-colors group/note">
                                                            <div className="flex-1 min-w-0 flex items-center gap-4 overflow-hidden mr-4">
                                                                <div className="w-8 h-8 border border-neutral-800 bg-black text-neutral-400 flex items-center justify-center flex-shrink-0 group-hover/note:border-white group-hover/note:text-white transition-colors">
                                                                    <FileText size={14} />
                                                                </div>
                                                                <div className="truncate">
                                                                    <h4 className="font-medium text-sm text-neutral-200 truncate mb-1" title={note.title}>{note.title}</h4>
                                                                    <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">{new Date(note.created_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                                <button 
                                                                    onClick={() => setSelectedNote(note)} 
                                                                    className="text-[10px] font-mono tracking-widest uppercase font-bold px-4 py-2 border border-neutral-800 hover:border-white hover:bg-white hover:text-black transition-colors"
                                                                >
                                                                    <span className="hidden md:inline">View</span>
                                                                    <span className="md:hidden"><Eye size={14} /></span>
                                                                </button>
                                                                {profile?.role === 'admin' && (
                                                                  <button onClick={() => remove(note)} className="text-neutral-500 hover:text-red-500 p-2 border border-transparent hover:border-red-900/50 transition-colors">
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
                                        <div key={unit} className="border-b border-neutral-900 last:border-0">
                                            <button 
                                                onClick={() => toggleUnit(subject, unit)}
                                                className="w-full flex items-center justify-between py-4 hover:pl-2 transition-all text-left group/unit"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-neutral-600 group-hover/unit:text-white transition-colors">
                                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                    </div>
                                                    <span className="text-sm font-medium text-neutral-300">{unit}</span>
                                                </div>
                                                <div className="text-[10px] font-mono text-neutral-600">
                                                    {unitNotes.length.toString().padStart(2, '0')}
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="p-6 bg-neutral-950 border-t border-neutral-900">
                                                    {unitNotes.length === 0 ? (
                                                        <p className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">No records found.</p>
                                                    ) : (
                                                        <div className="flex flex-col gap-2">
                                                            {unitNotes.map(note => (
                                                                <div key={note.id} className="flex items-center justify-between p-4 border border-neutral-900 bg-black hover:border-neutral-700 transition-colors group/note">
                                                                    <div className="flex-1 min-w-0 flex items-center gap-4 overflow-hidden mr-4">
                                                                        <div className="w-8 h-8 border border-neutral-800 bg-black text-neutral-400 flex items-center justify-center flex-shrink-0 group-hover/note:border-white group-hover/note:text-white transition-colors">
                                                                            <FileText size={14} />
                                                                        </div>
                                                                        <div className="truncate">
                                                                            <h4 className="font-medium text-sm text-neutral-200 truncate mb-1" title={note.title}>{note.title}</h4>
                                                                            <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">{new Date(note.created_at).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                                        <button 
                                                                            onClick={() => setSelectedNote(note)} 
                                                                            className="text-[10px] font-mono tracking-widest uppercase font-bold px-4 py-2 border border-neutral-800 hover:border-white hover:bg-white hover:text-black transition-colors"
                                                                        >
                                                                            <span className="hidden md:inline">View</span>
                                                                            <span className="md:hidden"><Eye size={14} /></span>
                                                                        </button>
                                                                        {profile?.role === 'admin' && (
                                                                          <button onClick={() => remove(note)} className="text-neutral-500 hover:text-red-500 p-2 border border-transparent hover:border-red-900/50 transition-colors">
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
                    
                    <div className="flex border-b border-neutral-800 mb-4">
                        <button 
                            className={`flex-1 py-2 text-sm font-medium ${uploadType === 'file' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                            onClick={() => setUploadType('file')}
                        >
                            Upload File
                        </button>
                        <button 
                            className={`flex-1 py-2 text-sm font-medium ${uploadType === 'link' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                            onClick={() => setUploadType('link')}
                        >
                            External Link
                        </button>
                    </div>

                    {uploadType === 'file' ? (
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
                    ) : (
                        <div>
                            <label className="block text-sm font-medium mb-1 text-neutral-300">Drive Link (URL)</label>
                            <input 
                                type="url" 
                                value={link} 
                                onChange={e => setLink(e.target.value)} 
                                placeholder="https://drive.google.com/..." 
                                className="w-full px-3 py-2 border border-neutral-700 rounded focus:outline-none focus:border-white transition-colors bg-neutral-800 text-white placeholder:text-neutral-600"
                            />
                            <p className="text-xs text-neutral-500 mt-1">Recommended for older semesters to save space.</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex justify-end gap-3">
                    <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white">Cancel</button>
                    <button 
                        onClick={addNote} 
                        disabled={uploading || !title || (uploadType === 'file' && !file) || (uploadType === 'link' && !link)}
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
