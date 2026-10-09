import { safeGetStorage, safeSetStorage, safeRemoveStorage } from '../utils/storage.js';
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Upload, FileText, X, Trash2, Plus, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import PdfViewer from '../components/PdfViewer.jsx';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import HubNavbar from '../components/HubNavbar.jsx';
import { useAuth } from '../context/AuthContext';
import ConstellationBackground from '../components/ConstellationBackground.jsx';

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

  const location = useLocation();
  const tourAutoOpened = React.useRef(false);
  React.useEffect(() => {
    if (location.search.includes('tour=true') && notes.length > 0 && !selectedNote && !tourAutoOpened.current) {
        tourAutoOpened.current = true;
        setTimeout(() => {
            setSelectedNote(notes[0]);
        }, 1500);
    }
  }, [location.search, notes, selectedNote]);

  
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
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(n => n.type !== 'analytics_counter');
      setNotes(data);
    } catch (e) {
      console.error('Error loading notes:', e);
      // Fallback to local storage if Supabase fails (optional, but good for transition)
      const localNotes = JSON.parse(safeGetStorage('pt_notes') || '[]');
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
    let filtered = [];
    if (subject === 'PHC') {
        filtered = notes.filter(n => n.subject === subject);
    } else {
        filtered = notes.filter(n => n.subject === subject && n.unit === unit);
    }
    return filtered.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));
  }

  const [announcement, setAnnouncement] = React.useState(null);

  React.useEffect(() => {
    const cvNotesNotif = {
      id: 'cv-notes-correction',
      title: 'Correction: CV Unit 1 & 2 Notes 📝',
      message: 'By mistake, the Unit 1 notes for Computer Vision included some notes from Unit 2. Please don\'t be confused if you see common pages across both PDFs. I apologize for the inconvenience!',
      type: 'alert'
    };
    const dismissedAnnouncements = JSON.parse(safeGetStorage('dismissed_announcements') || '[]');
    if (!dismissedAnnouncements.includes(cvNotesNotif.id)) {
      setAnnouncement(cvNotesNotif);
    }
  }, []);

  const handleDismissAnnouncement = () => {
    if (announcement) {
      const dismissedAnnouncements = JSON.parse(safeGetStorage('dismissed_announcements') || '[]');
      dismissedAnnouncements.push(announcement.id);
      safeSetStorage('dismissed_announcements', JSON.stringify(dismissedAnnouncements));
      setAnnouncement(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black relative">
      
      {/* Sleek Grid & Grain Background (Matches Landing Hero) */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '100px 100px',
        }}></div>
        <div className="absolute inset-0 opacity-[0.15]" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)'
        }}></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}></div>
      </div>

      <ConstellationBackground />
      {/* Header */}
      <HubNavbar />

      <main className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {announcement && (
          <div className="mb-8 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-5 rounded-2xl shadow-sm relative overflow-hidden flex items-start gap-5 animate-in fade-in slide-in-from-top-4">
            <div className="bg-neutral-900 border border-red-900/30 text-red-400 p-2.5 rounded-xl shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <div className="flex-1 pr-8 pt-1">
              <h3 className="font-bold text-base text-white mb-1.5 tracking-tight">{announcement.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl font-light">{announcement.message}</p>
            </div>
            <button 
              onClick={handleDismissAnnouncement}
              className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1] text-white mb-2">
                    My <span className="font-serif italic font-normal tracking-tight text-neutral-300">Notes.</span>
                </h1>
                <p className="text-neutral-400 font-light">Organize what you learn.</p>
            </div>
            <div className="flex items-center gap-4">
                <select value={semester} onChange={e => setSemester(e.target.value)} className="px-4 py-2 border border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-xl text-neutral-300 rounded-xl outline-none font-medium text-sm hover:border-neutral-700 transition-colors cursor-pointer appearance-none shadow-sm min-w-[150px]">
                    <option value="5th">5th Semester</option>
                    <option value="6th">6th Semester</option>
                    <option value="7th">7th Semester</option>
                </select>
            {profile?.role === 'admin' && (
              <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-sm">
                  <Plus size={16} />
                  Upload Note
              </button>
            )}
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-neutral-400">Loading notes...</div>
        ) : (
            <div className="space-y-5 notes-grid">
                {subjects.map(subject => (
                    <div key={subject} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-neutral-700">
                        <button 
                            onClick={() => toggleSubject(subject)}
                            className="w-full flex items-center justify-between p-6 hover:bg-neutral-900/50 transition-colors text-left"
                        >
                            <span className="font-bold text-2xl tracking-tight text-white">{subject}</span>
                            {expandedSubjects.includes(subject) ? <ChevronDown size={24} className="text-neutral-500" /> : <ChevronRight size={24} className="text-neutral-500" />}
                        </button>
                        
                        {expandedSubjects.includes(subject) && (
                            <div className="border-t border-neutral-800 bg-neutral-950/50">
                                {subject === 'PHC' ? (() => {
                                    const phcNotes = getNotesFor(subject);
                                    return (
                                        <div className="p-6">
                                            {phcNotes.length === 0 ? (
                                                <p className="text-sm text-neutral-500 italic pl-3">No notes uploaded.</p>
                                            ) : (
                                                <div className="grid gap-3">
                                                    {phcNotes.map(note => (
                                                        <div key={note.id} className="flex items-center justify-between bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all">
                                                            <div className="flex-1 min-w-0 flex items-center gap-4 overflow-hidden mr-2">
                                                                <div className="w-10 h-10 bg-black border border-neutral-800 text-neutral-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                                                    <FileText size={16} />
                                                                </div>
                                                                <div className="truncate">
                                                                    <h4 className="font-medium text-sm text-white truncate" title={note.title}>{note.title}</h4>
                                                                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{new Date(note.created_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <button 
                                                                    onClick={() => setSelectedNote(note)} 
                                                                    className="text-xs font-medium px-4 py-2 border border-neutral-700 rounded-lg hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                                                                    title="View Note"
                                                                >
                                                                    <span className="md:hidden"><Eye size={14} /></span>
                                                                    <span className="hidden md:inline">View</span>
                                                                </button>
                                                                {profile?.role === 'admin' && (
                                                                  <button onClick={() => remove(note)} className="text-neutral-500 hover:text-red-500 p-2 border border-transparent hover:border-red-900/50 hover:bg-red-900/20 rounded-lg transition-colors">
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
                                })() : units.map((unit, uIdx) => {
                                    const unitNotes = getNotesFor(subject, unit);
                                    const isExpanded = expandedUnits[`${subject}-${unit}`];
                                    
                                    return (
                                        <div key={unit} className="border-b border-neutral-800/50 last:border-0">
                                            <button 
                                                onClick={() => toggleUnit(subject, unit)}
                                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-900/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md text-neutral-400">UNIT {unit.split(' ')[1] || unit}</span>
                                                    <span className="font-medium text-neutral-300">{unitNotes.length} Note{unitNotes.length !== 1 && 's'}</span>
                                                </div>
                                                {isExpanded ? <ChevronDown size={16} className="text-neutral-500" /> : <ChevronRight size={16} className="text-neutral-500" />}
                                            </button>

                                            {isExpanded && (
                                                <div className="px-6 pb-6 pt-2">
                                                    {unitNotes.length === 0 ? (
                                                        <p className="text-sm text-neutral-500 italic pl-3">No notes uploaded.</p>
                                                    ) : (
                                                        <div className="grid gap-3">
                                                            {unitNotes.map(note => (
                                                                <div key={note.id} className="flex items-center justify-between bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all">
                                                                    <div className="flex-1 min-w-0 flex items-center gap-4 overflow-hidden mr-2">
                                                                        <div className="w-10 h-10 bg-black border border-neutral-800 text-neutral-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                                                            <FileText size={16} />
                                                                        </div>
                                                                        <div className="truncate">
                                                                            <h4 className="font-medium text-sm text-white truncate" title={note.title}>{note.title}</h4>
                                                                            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{new Date(note.created_at).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                                        <button 
                                                                            onClick={() => setSelectedNote(note)} 
                                                                            className="text-xs font-medium px-4 py-2 border border-neutral-700 rounded-lg hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                                                                            title="View Note"
                                                                        >
                                                                            <span className="md:hidden"><Eye size={14} /></span>
                                                                            <span className="hidden md:inline">View</span>
                                                                        </button>
                                                                        {profile?.role === 'admin' && (
                                                                          <button onClick={() => remove(note)} className="text-neutral-500 hover:text-red-500 p-2 border border-transparent hover:border-red-900/50 hover:bg-red-900/20 rounded-lg transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                    <h3 className="font-serif italic text-xl truncate text-white mr-4">{selectedNote.title}</h3>
                    <button onClick={() => setSelectedNote(null)} className="text-neutral-500 hover:text-white shrink-0 p-1.5 rounded-full hover:bg-neutral-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-black p-2 sm:p-4 flex justify-center">
                     <PdfViewer fileUrl={selectedNote.file_url || selectedNote.fileUrl} />
                </div>
            </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                    <h3 className="font-serif italic text-2xl text-white">Upload Note</h3>
                    <button onClick={() => setShowUploadModal(false)} className="text-neutral-500 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 text-neutral-500">Subject</label>
                        <select 
                            value={uploadSubject} 
                            onChange={e => setUploadSubject(e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition-colors bg-neutral-900/50 text-white appearance-none"
                        >
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {uploadSubject !== 'PHC' && (
                    <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 text-neutral-500">Unit</label>
                        <select 
                            value={uploadUnit} 
                            onChange={e => setUploadUnit(e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition-colors bg-neutral-900/50 text-white appearance-none"
                        >
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    )}
                    <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 text-neutral-500">Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. Chapter 1 Summary" 
                            className="w-full px-4 py-3 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition-colors bg-neutral-900/50 text-white placeholder:text-neutral-600"
                        />
                    </div>
                    
                    <div className="flex border-b border-neutral-800 mb-2">
                        <button 
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${uploadType === 'file' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                            onClick={() => setUploadType('file')}
                        >
                            Upload File
                        </button>
                        <button 
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${uploadType === 'link' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                            onClick={() => setUploadType('link')}
                        >
                            External Link
                        </button>
                    </div>

                    {uploadType === 'file' ? (
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 text-neutral-500">File (PDF)</label>
                            <div className="border border-dashed border-neutral-700 rounded-xl p-8 text-center hover:bg-neutral-900/50 hover:border-neutral-500 transition-all cursor-pointer relative group">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFile} 
                                    accept="application/pdf" 
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto text-neutral-500 mb-3 group-hover:text-white transition-colors" size={24} />
                                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                                    {fileInputRef.current?.files?.[0]?.name || "Click to browse or drag file"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 text-neutral-500">Drive Link (URL)</label>
                            <input 
                                type="url" 
                                value={link} 
                                onChange={e => setLink(e.target.value)} 
                                placeholder="https://drive.google.com/..." 
                                className="w-full px-4 py-3 border border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-600 transition-colors bg-neutral-900/50 text-white placeholder:text-neutral-600"
                            />
                            <p className="text-xs text-neutral-500 mt-2 font-light">Recommended for older semesters to save space.</p>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <div className="px-6 py-5 bg-neutral-950/50 border-t border-neutral-800 flex justify-end gap-3">
                    <button onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors">Cancel</button>
                    <button 
                        onClick={addNote} 
                        disabled={uploading || !title || (uploadType === 'file' && !file) || (uploadType === 'link' && !link)}
                        className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
