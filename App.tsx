import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Database, Sigma, Trash2, Shield, LogOut, Lock, X } from 'lucide-react';
import { DataEntry } from './types';
import { StatCard } from './components/StatCard';
import { EntryForm } from './components/EntryForm';
import { HistoryList } from './components/HistoryList';
import { DataChart } from './components/DataChart';
import { SunflowerMeadow } from './components/SunflowerMeadow';

const STORAGE_KEY = 'accumulate_pro_data';

// ID Generator with fallback
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts or older browsers
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const App: React.FC = () => {
  // Initialize state from local storage or empty array
  // Sanitize data to ensure every entry has an ID and ID is a string
  const [entries, setEntries] = useState<DataEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            ...item,
            id: item.id ? String(item.id) : generateId() // Ensure ID is string and exists
          }));
        }
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
    return [];
  });

  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Admin Login Modal State
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (showAdminModal && passwordInputRef.current) {
      // Small timeout to ensure rendering on mobile
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    }
  }, [showAdminModal]);

  // Derived state: Total Sum
  const totalSum = entries.reduce((acc, curr) => acc + curr.value, 0);

  // Derived state: Sorted for display (newest first), limit to 50
  const displayEntries = [...entries]
    .sort((a, b) => b.timestamp - a.timestamp) // Descending
    .slice(0, 50);

  // Side Effect: Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Handler: Add Entry
  const handleAddEntry = useCallback((value: number) => {
    const newEntry: DataEntry = {
      id: generateId(),
      value,
      timestamp: Date.now(),
      cumulativeAtPoint: totalSum + value // Snapshot logic if needed later
    };
    setEntries(prev => [newEntry, ...prev]);
  }, [totalSum]);

  // Handler: Delete Entry
  const handleDeleteEntry = useCallback((id: string) => {
    // Removed window.confirm to prevent blocking issues and ensure action execution
    setEntries(prev => prev.filter(entry => String(entry.id) !== String(id)));
  }, []);

  // Handler: Clear All
  const handleClearAll = useCallback(() => {
    if (window.confirm('全てのデータを削除します。この操作は取り消せません。よろしいですか？')) {
      setEntries([]);
    }
  }, []);

  // Handler: Open Admin Modal
  const handleAdminLoginClick = useCallback(() => {
    setShowAdminModal(true);
    setAdminPassword('');
  }, []);

  // Handler: Submit Password
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "0987") {
      setIsAdmin(true);
      setShowAdminModal(false);
    } else {
      alert("パスワードが間違っています");
      setAdminPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              ひまわりB題目ガーデン
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <button 
                    onClick={handleClearAll}
                    className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50 mr-2"
                    disabled={entries.length === 0}
                    title="全てのデータを削除"
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">全削除</span>
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2 px-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  管理者終了
                </button>
              </>
            ) : (
              <button
                onClick={handleAdminLoginClick}
                className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-3 rounded-lg transition-colors flex items-center gap-2 border border-indigo-100"
              >
                <Shield className="w-4 h-4" />
                管理者になる
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Row */}
        <div className="w-full">
          <StatCard 
            title="現在の累計値" 
            value={`${totalSum.toLocaleString()} 編`}
            icon={Sigma} 
            colorClass="bg-indigo-600"
            trend={entries.length > 0 ? "リアルタイム更新中" : "データ待ち"}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Form & Chart */}
          <div className="lg:col-span-1 space-y-8">
            <EntryForm onAdd={handleAddEntry} />
            <div className="hidden lg:block">
               <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-700 rounded-full opacity-50 blur-xl"></div>
                  <div className="relative z-10">
                    <h4 className="text-indigo-200 text-sm font-medium mb-1">ヒント</h4>
                    <p className="text-sm leading-relaxed opacity-90 mb-2">
                        負の数値を入力することで、累計値から減算を行うことができます。
                    </p>
                    {isAdmin && (
                        <p className="text-xs text-amber-300 mt-2 border-t border-indigo-700 pt-2">
                            現在管理者モードです。履歴データの削除が可能です。
                        </p>
                    )}
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Chart (Main) & List */}
          <div className="lg:col-span-2 space-y-6">
            <DataChart data={entries} />
            <HistoryList 
                entries={displayEntries} 
                onDelete={handleDeleteEntry} 
                isAdmin={isAdmin} 
            />
          </div>

        </div>

        {/* Sunflower Meadow Visualization */}
        <SunflowerMeadow totalValue={totalSum} />
      </main>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs overflow-hidden">
            <div className="p-4 bg-indigo-600 flex justify-between items-center text-white">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                管理者認証
              </h3>
              <button onClick={() => setShowAdminModal(false)} className="hover:bg-indigo-500 p-1 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdminLoginSubmit} className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                管理者パスワードを入力してください。<br/>
                <span className="text-xs text-slate-400">(Hint: 0987)</span>
              </p>
              <div className="relative mb-6">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  ref={passwordInputRef}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Password"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-md shadow-indigo-200 transition-colors"
                >
                  認証
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;