import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Calculator, History, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
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

    const { error } = await supabase
      .from('sgpa_history')
      .insert({
        user_id: user.id,
        semester_name: semesterName || `Semester ${history.length + 1}`,
        sgpa: result.sgpa,
        total_credits: result.totalCredits,
        grade_points: result.totalPoints
      });

    if (error) {
      console.error('Error saving SGPA:', error);
      alert('Failed to save history. Make sure the database table exists.');
    } else {
      fetchHistory();
      setActiveTab('history');
      resetCalculator();
    }
    setSaving(false);
  };

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('sgpa_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
    } else {
      setHistory(data || []);
    }
    setLoadingHistory(false);
  };

  const deleteHistoryItem = async (id) => {
    const { error } = await supabase
      .from('sgpa_history')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setHistory(history.filter(h => h.id !== id));
    }
  };

  const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    
    const { error } = await supabase
      .from('sgpa_history')
      .delete()
      .eq('user_id', user.id);

    if (!error) {
      setHistory([]);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchHistory();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-neutral-950 border border-neutral-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">SGPA Calculator</h3>
              <p className="text-neutral-500 text-xs font-medium">Calculate & Track your performance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800">
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'calculator' ? 'bg-neutral-900 text-white border-b-2 border-indigo-500' : 'text-neutral-500 hover:text-white hover:bg-neutral-900/50'}`}
          >
            <Calculator size={16} /> Calculator
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-neutral-900 text-white border-b-2 border-indigo-500' : 'text-neutral-500 hover:text-white hover:bg-neutral-900/50'}`}
          >
            <History size={16} /> History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'calculator' ? (
            <div className="space-y-6">
              {/* Result Card */}
              {result && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-center animate-in slide-in-from-top-2">
                  <div className="text-sm text-indigo-300 font-medium mb-1">Your SGPA</div>
                  <div className="text-5xl font-bold text-indigo-400 mb-2">{result.sgpa}</div>
                  <div className="text-xs text-indigo-300/70">
                    Total Credits: {result.totalCredits} • Grade Points: {result.totalPoints}
                  </div>
                  
                  <div className="mt-4 flex gap-2 justify-center">
                    <input 
                      type="text" 
                      placeholder="Semester Name (Optional)" 
                      className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 w-48"
                      value={semesterName}
                      onChange={(e) => setSemesterName(e.target.value)}
                    />
                    <button 
                      onClick={saveToHistory}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              {/* Inputs */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-neutral-500 uppercase tracking-wider px-2">
                  <div className="col-span-6">Subject (Optional)</div>
                  <div className="col-span-3">Credit</div>
                  <div className="col-span-2">Grade</div>
                  <div className="col-span-1"></div>
                </div>
                
                {subjects.map((sub, idx) => (
                  <div key={sub.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="col-span-6">
                      <input 
                        type="text" 
                        placeholder={`Subject ${idx + 1}`}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
                        value={sub.name}
                        onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        placeholder="Cr"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
                        value={sub.credit}
                        onChange={(e) => updateSubject(sub.id, 'credit', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors appearance-none cursor-pointer"
                        value={sub.grade}
                        onChange={(e) => updateSubject(sub.id, 'grade', e.target.value)}
                      >
                        <option value="" disabled>Gr</option>
                        {GRADES.map(g => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 text-center">
                      <button 
                        onClick={() => removeSubject(sub.id)}
                        className="text-neutral-600 hover:text-red-400 transition-colors p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={addSubject}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-sm font-medium transition-colors border border-neutral-800"
                >
                  <Plus size={16} /> Add Subject
                </button>
                <div className="flex-1"></div>
                <button 
                  onClick={resetCalculator}
                  className="flex items-center gap-2 px-4 py-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium"
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button 
                  onClick={calculateSGPA}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-neutral-200 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-white/10"
                >
                  Calculate
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {loadingHistory ? (
                <div className="text-center py-12 text-neutral-500">Loading history...</div>
              ) : history.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Saved Calculations</span>
                    <button onClick={clearAllHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <Trash2 size={12} /> Clear All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between group hover:border-neutral-700 transition-colors">
                        <div>
                          <div className="font-bold text-white text-lg">{item.semester_name || 'Untitled Semester'}</div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {new Date(item.created_at).toLocaleDateString()} • {item.total_credits} Credits
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-neutral-500 uppercase font-bold">SGPA</div>
                            <div className="text-2xl font-bold text-indigo-400">{item.sgpa}</div>
                          </div>
                          <button 
                            onClick={() => deleteHistoryItem(item.id)}
                            className="p-2 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-neutral-600">
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No history found.</p>
                  <p className="text-sm mt-2">Calculations you save will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
