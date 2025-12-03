import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataEntry } from '../types';

interface DataChartProps {
  data: DataEntry[];
}

export const DataChart: React.FC<DataChartProps> = ({ data }) => {
  // Prepare data for the chart: sort by time ascending
  const chartData = [...data]
    .sort((a, b) => a.timestamp - b.timestamp)
    .reduce((acc: any[], curr) => {
       const prevTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
       acc.push({
         name: new Date(curr.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         value: curr.value,
         total: prevTotal + curr.value,
         fullDate: new Date(curr.timestamp).toLocaleString()
       });
       return acc;
    }, []);

  // If no data, show placeholder
  if (chartData.length === 0) {
     return (
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
            <p className="text-slate-400 text-sm">データがありません。入力を開始してください。</p>
        </div>
     );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-slate-800 font-semibold mb-6 flex items-center justify-between">
        <span>累積推移</span>
        <span className="text-xs font-normal bg-slate-100 px-2 py-1 rounded text-slate-500">Auto-Update</span>
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="name" 
                tick={{fontSize: 10, fill: '#94a3b8'}} 
                axisLine={false}
                tickLine={false}
                minTickGap={30}
            />
            <YAxis 
                tick={{fontSize: 10, fill: '#94a3b8'}} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                itemStyle={{ color: '#6366f1', fontWeight: 600 }}
                formatter={(value: number) => [value.toLocaleString() + ' 編', "累積値"]}
                labelFormatter={(label, payload) => payload[0]?.payload.fullDate || label}
            />
            <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};