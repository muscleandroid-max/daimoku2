import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

interface EntryFormProps {
  onAdd: (value: number) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = parseFloat(inputValue);

    if (isNaN(val)) {
      setError('有効な数値を入力してください');
      return;
    }

    // Validate 1000 unit step
    if (val % 1000 !== 0) {
      setError('数値は1000編単位で入力してください（例: 1000, 2000, -1000）');
      return;
    }

    onAdd(val);
    setInputValue('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-600" />
        新規データ登録
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="value-input" className="block text-sm font-medium text-slate-700 mb-1">
            数値 (編)
          </label>
          <div className="relative">
            <input
              id="value-input"
              type="number"
              step="1000"
              placeholder="1000"
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200'
              } focus:border-indigo-500 focus:ring-4 outline-none transition-all`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <div className="absolute right-3 top-3 text-slate-400 text-sm font-medium pointer-events-none">
              編
            </div>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
        >
          <PlusCircle className="w-4 h-4" />
          追加する
        </button>
        
        <p className="text-xs text-slate-400 text-center mt-4">
          入力は1000編単位で行ってください。<br/>入力された数値は即座に集計され、履歴に追加されます。
        </p>
      </form>
    </div>
  );
};