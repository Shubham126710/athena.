import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Calculator, History, RotateCcw } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function SGPACalculator({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' or 'history'
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', credit: '', grade: '' },
    { id: 2, name: '', credit: '', grade: '' },
    { id: 3, name: '', credit: '', grade: '' },
  ]);
  const [result, setResult] = useState(null);
  const [semesterName, setSemesterName] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  // Grade Options
  const GRADES = [
    { label: 'A+ (10)', value: 'A+' },
    { label: 'A (9)', value: 'A' },
    { label: 'B+ (8)', value: 'B+' },
    { label: 'B (7)', value: 'B' },
    { label: 'C+ (6)', value: 'C+' },
    { label: 'C (5)', value: 'C' },
    { label: 'D (4)', value: 'D' },
    { label: 'F (0)', value: 'F' },
  ];

  // Grade Points Mapping
  const getGradePoint = (grade) => {
    const g = grade.toUpperCase();
    switch (g) {
      case 'A+': return 10;
      case 'A': return 9;
      case 'B+': return 8;
      case 'B': return 7;
      case 'C+': return 6;
      case 'C': return 5;
      case 'D': return 4;
      case 'F': return 0;
      default: return null;
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', credit: '', grade: '' }]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    let valid = true;

    subjects.forEach(sub => {
      if (!sub.credit || !sub.grade) return;
      const credit = parseFloat(sub.credit);
      const point = getGradePoint(sub.grade);
      
      if (isNaN(credit) || point === null) {
        valid = false;
        return;
      }

      totalCredits += credit;
      totalPoints += (credit * point);
    });

    if (valid && totalCredits > 0) {
      const sgpa = (totalPoints / totalCredits).toFixed(2);
      setResult({ sgpa, totalCredits, totalPoints });
    } else {
      alert("Please enter valid credits and grades");
    }
  };

  const resetCalculator = () => {
    setSubjects([
      { id: 1, name: '', credit: '', grade: '' },
      { id: 2, name: '', credit: '', grade: '' },
      { id: 3, name: '', credit: '', grade: '' },
    ]);
    setResult(null);
    setSemesterName('');
  };

  const saveToHistory = async () => {
    if (!user || !result) return;
    setSaving(true);

    try {
        await addDoc(collection(db, 'sgpa_history'), {
            user_id: user.uid || user.id,
            semester_name: semesterName || `Semester ${history.length + 1}`,
            sgpa: result.sgpa,
            total_credits: result.totalCredits,
            grade_points: result.totalPoints,
            created_at: Date.now()
        });
        fetchHistory();
        setActiveTab('history');
        resetCalculator();
    } catch (error) {
        console.error('Error saving SGPA:', error);
        alert('Failed to save history.');
    }
    setSaving(false);
  };

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
        const q = query(
            collection(db, 'sgpa_history'), 
            where('user_id', '==', user.uid || user.id),
            orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(data);
    } catch (error) {
        console.error('Error fetching history:', error);
    }
    setLoadingHistory(false);
  };

  const deleteHistoryItem = async (id) => {
    try {
        await deleteDoc(doc(db, 'sgpa_history', id));
        setHistory(history.filter(h => h.id !== id));
    } catch (e) { 
        console.error(e); 
    }
  };

  const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    
    try {
        const batch = writeBatch(db);
        history.forEach(item => {
            batch.delete(doc(db, 'sgpa_history', item.id));
        });
        await batch.commit();
        setHistory([]);
    } catch (e) {
        console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchHistory();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-black border border-neutral-800 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/5" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-900 flex items-center justify-between bg-black">
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase border border-neutral-800 px-2 py-1">
              Compute Matrix
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">SGPA Calculator</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-600 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-900 bg-neutral-950">
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-3 text-[10px] font-mono tracking-widest uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === 'calculator' ? 'bg-black text-white border-b border-white' : 'text-neutral-600 hover:text-neutral-300'}`}
          >
            <Calculator size={14} /> Calculate
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-[10px] font-mono tracking-widest uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-black text-white border-b border-white' : 'text-neutral-600 hover:text-neutral-300'}`}
          >
            <History size={14} /> Log
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-black">
          {activeTab === 'calculator' ? (
            <div className="space-y-8">
              {/* Result Card */}
              {result && (
                <div className="border border-neutral-800 p-8 text-center animate-in fade-in duration-300 relative overflow-hidden bg-neutral-950">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-4">Final Computed Result</div>
                  <div className="text-7xl font-serif italic text-white mb-6 tracking-tighter">{result.sgpa}</div>
                  <div className="flex justify-center gap-8 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    <span>Credits_ {result.totalCredits}</span>
                    <span>Points_ {result.totalPoints}</span>
                  </div>
                  
                  <div className="mt-8 flex gap-3 justify-center items-center">
                    <input 
                      type="text" 
                      placeholder="Identifier (e.g. Sem 7)" 
                      className="bg-black border border-neutral-800 px-4 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-white w-48 uppercase placeholder:text-neutral-700"
                      value={semesterName}
                      onChange={(e) => setSemesterName(e.target.value)}
                    />
                    <button 
                      onClick={saveToHistory}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-white text-black text-[10px] font-mono tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                      <Save size={14} /> {saving ? 'Writing...' : 'Log'}
                    </button>
                  </div>
                </div>
              )}

              {/* Inputs */}
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest pb-2 border-b border-neutral-900">
                  <div className="col-span-6 pl-2">Parameter</div>
                  <div className="col-span-3">Credits</div>
                  <div className="col-span-2">Grade</div>
                  <div className="col-span-1"></div>
                </div>
                
                {subjects.map((sub, idx) => (
                  <div key={sub.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-neutral-900 last:border-0 group">
                    <div className="col-span-6">
                      <input 
                        type="text" 
                        placeholder={`Subject ${(idx + 1).toString().padStart(2, '0')}`}
                        className="w-full bg-transparent px-2 py-1.5 text-sm text-white font-medium focus:outline-none placeholder:text-neutral-700 uppercase"
                        value={sub.name}
                        onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        placeholder="0.0"
                        className="w-full bg-transparent px-2 py-1.5 text-sm font-mono text-neutral-300 focus:outline-none placeholder:text-neutral-700"
                        value={sub.credit}
                        onChange={(e) => updateSubject(sub.id, 'credit', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        className="w-full bg-transparent px-2 py-1.5 text-sm font-mono text-neutral-300 focus:outline-none appearance-none cursor-pointer"
                        value={sub.grade}
                        onChange={(e) => updateSubject(sub.id, 'grade', e.target.value)}
                      >
                        <option value="" disabled className="bg-neutral-900 text-neutral-500">Gr</option>
                        {GRADES.map(g => (
                          <option key={g.value} value={g.value} className="bg-neutral-900 text-white">{g.value}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => removeSubject(sub.id)}
                        className="text-neutral-800 hover:text-red-500 transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={addSubject}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-widest uppercase border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                >
                  <Plus size={14} /> Add Line
                </button>
                <div className="flex-1"></div>
                <button 
                  onClick={resetCalculator}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-widest uppercase text-neutral-600 hover:text-white transition-colors"
                >
                  <RotateCcw size={14} /> Reset
                </button>
                <button 
                  onClick={calculateSGPA}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-neutral-200 text-[10px] font-mono font-bold tracking-widest uppercase transition-colors"
                >
                  Compute
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {loadingHistory ? (
                <div className="text-center py-12 text-[10px] font-mono tracking-widest uppercase text-neutral-500">Retrieving logs...</div>
              ) : history.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Computation Log</span>
                    <button onClick={clearAllHistory} className="text-[10px] font-mono uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors">
                      <Trash2 size={12} /> Purge
                    </button>
                  </div>
                  <div className="space-y-1 border-t border-neutral-900 pt-4">
                    {history.map((item) => (
                      <div key={item.id} className="group flex items-center justify-between py-4 border-b border-neutral-900 hover:bg-neutral-950 px-2 -mx-2 transition-colors">
                        <div>
                          <div className="font-bold text-white text-sm uppercase tracking-wide mb-1">{item.semester_name || 'Untitled_'}</div>
                          <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                            {new Date(item.created_at).toLocaleDateString()} • {item.total_credits} CR
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest mb-0.5">Result</div>
                            <div className="text-lg font-serif italic text-white">{item.sgpa}</div>
                          </div>
                          <button 
                            onClick={() => deleteHistoryItem(item.id)}
                            className="text-neutral-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-neutral-600">
                  <div className="w-12 h-12 border border-neutral-800 mx-auto mb-4 flex items-center justify-center bg-neutral-950">
                    <History size={20} className="opacity-50" />
                  </div>
                  <p className="text-[10px] font-mono tracking-widest uppercase">Log empty.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
