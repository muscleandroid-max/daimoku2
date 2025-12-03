import React from 'react';
import { Trash2, History, TrendingUp, TrendingDown } from 'lucide-react';
import { DataEntry } from '../types';

interface HistoryListProps {
  entries: DataEntry[];
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export const HistoryList: React.FC<HistoryListProps> = ({ entries, onDelete, isAdmin }) => {
  if (entries.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center h-96">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <History className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-slate-800 font-medium mb-1">データがありません</h3>
        <p className="text-slate-500 text-sm">左側のフォームから数値を入力してください。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          入力履歴 <span className="text-xs font-normal text-slate-500">(最新50件)</span>
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
          {entries.length} 件
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">日時</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">入力値</th>
              {isAdmin && (
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-16">操作</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {entry.value > 0 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : entry.value < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : null}
                    <span className={`font-mono font-medium ${entry.value < 0 ? 'text-red-600' : 'text-slate-800'}`}>
                      {entry.value.toLocaleString()} <span className="text-xs text-slate-500 ml-0.5">編</span>
                    </span>
                  </div>
                </td>
                {isAdmin && (
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entry.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4 pointer-events-none" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};