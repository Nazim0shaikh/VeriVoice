'use client';

import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AlertOctagon, TrendingUp, BarChart3, Map, ShieldAlert } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export default function AnalyticsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
       const q = query(collection(db, 'COMPLAINTS'));
       const snap = await getDocs(q);
       setComplaints(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
       setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-4xl font-black uppercase tracking-tighter">Aggregating Data...</div>;

  // Analytics Engine Processors
  const categories = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const departments = complaints.reduce((acc, c) => {
    if (!acc[c.department]) acc[c.department] = { total: 0, resolved: 0, pending: 0 };
    acc[c.department].total += 1;
    if (c.status === 'resolved') acc[c.department].resolved += 1;
    else acc[c.department].pending += 1;
    return acc;
  }, {});

  const severityData = [0,0,0,0,0];
  complaints.forEach(c => severityData[c.severity - 1] += 1);

  // Swiss Theme Chart Colors
  const swissColors = ['#000000', '#FF3000', '#F2F2F2', '#333333', '#999999'];

  const categoryChartData = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: swissColors,
      borderWidth: 4,
      borderColor: '#FFFFFF'
    }]
  };

  const lineChartData = {
    labels: ['W1', 'W2', 'W3', 'W4'], // Mocked timeline for demo visualization
    datasets: [{
      label: 'Complaints Logged',
      data: [2, 5, 8, complaints.length],
      borderColor: '#000000',
      backgroundColor: '#000000',
      borderWidth: 4,
      pointBackgroundColor: '#FF3000',
      pointBorderColor: '#000000',
      pointBorderWidth: 2,
      pointRadius: 6,
      tension: 0, // Swiss design means straight lines, no curves
    }]
  };

  return (
    <div className="flex flex-col max-w-[1440px] mx-auto px-6 md:px-8 py-12 lg:py-24">
      <div className="mb-12 border-b-4 border-swiss-black pb-8">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
          Metrology.
        </h1>
        <p className="text-xl font-medium tracking-widest uppercase text-swiss-black/70">
          Departmental Analytics & Performance Scoring
        </p>
      </div>

      {/* Surge Detection Card */}
      <div className="border-4 border-red-600 bg-red-50 p-8 md:p-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden group">
         <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <AlertOctagon className="w-64 h-64 text-red-600" />
         </div>
         <div className="z-10">
            <div className="flex items-center gap-4 mb-4">
               <span className="bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-3 py-1 border-2 border-transparent">Surge Detected</span>
               <h2 className="text-3xl font-black uppercase tracking-tighter text-red-600">Local Outlier Event</h2>
            </div>
            <p className="font-bold text-xl md:text-2xl uppercase tracking-widest max-w-2xl border-l-4 border-red-600 pl-4">
               Sanitation volume in <span className="text-black bg-red-200 px-2">District 4</span> exceeds 3x normal capacity within 24 hours. Immediate mobilization suggested.
            </p>
         </div>
         <div className="z-10 mt-8 md:mt-0 flex gap-4">
            <div className="text-right">
               <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 block mb-2 opacity-50">Variance</span>
               <span className="text-4xl lg:text-6xl font-black tracking-tighter text-red-600">+312%</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-12">
         {/* Department Performance Table */}
         <div className="lg:col-span-8 border-4 border-swiss-black bg-swiss-white p-8 overflow-hidden h-fit">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-swiss-black pb-4 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-swiss-accent"/> Hierarchy
            </h3>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b-4 border-swiss-black text-xs font-bold uppercase tracking-widest text-swiss-black/50">
                        <th className="pb-4 border-r-2 border-swiss-black/10">Department</th>
                        <th className="pb-4 px-4 border-r-2 border-swiss-black/10">Resolution %</th>
                        <th className="pb-4 px-4 border-r-2 border-swiss-black/10 text-right">Pending</th>
                        <th className="pb-4 pl-4 text-right">Total Input</th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.entries(departments).map(([dept, stats]: any, i) => {
                        const rate = Math.round((stats.resolved / stats.total) * 100);
                        return (
                           <tr key={dept} className={`border-b-2 border-swiss-black/10 group hover:bg-swiss-accent/5 transition-colors ${i % 2 === 0 ? 'bg-swiss-muted/30' : ''}`}>
                              <td className="py-4 font-black uppercase tracking-tighter text-lg border-r-2 border-swiss-black/10"><span className="border-l-4 border-swiss-accent pl-2">{dept}</span></td>
                              <td className={`py-4 px-4 font-bold text-xl border-r-2 border-swiss-black/10 ${rate < 30 ? 'text-red-500' : 'text-green-600'}`}>
                                {rate}%
                              </td>
                              <td className="py-4 px-4 font-mono text-lg text-right border-r-2 border-swiss-black/10">{stats.pending}</td>
                              <td className="py-4 pl-4 font-black text-xl text-right">{stats.total}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Doughnut Category Breakdown */}
         <div className="col-span-1 border-4 border-swiss-black bg-swiss-muted swiss-grid-pattern p-8 lg:col-span-4 flex flex-col justify-between">
             <h3 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-2 border-swiss-black pb-2 flex items-center gap-3 bg-white px-2">
                Classification
             </h3>
             <div className="bg-swiss-white p-6 border-4 border-swiss-black aspect-square flex items-center justify-center">
                <Doughnut 
                  data={categoryChartData} 
                  options={{ 
                    cutout: '60%',
                    plugins: { legend: { display: false } }
                  }} 
                />
             </div>
             
             <div className="mt-8 grid grid-cols-2 gap-2 bg-swiss-white p-4 border-2 border-swiss-black">
                {Object.entries(categories).slice(0, 4).map(([cat, val], i) => (
                   <div key={cat} className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 truncate w-full">{cat}</span>
                      <span className="font-black text-lg break-all" style={{color: swissColors[i]}}>{val as number}</span>
                   </div>
                ))}
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="border-4 border-swiss-black bg-swiss-white p-8 h-[400px] flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-swiss-black pb-2">
               Temporal Activity
            </h3>
            <div className="flex-1 min-h-0 relative">
               <Line 
                 data={lineChartData} 
                 options={{ 
                   maintainAspectRatio: false, 
                   scales: { 
                     y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' }, border: { dash: [4, 4], width: 2, color: 'black' } },
                     x: { grid: { display: false }, border: { width: 2, color: 'black' } } 
                   } 
                 }} 
               />
            </div>
          </div>

          <div className="border-4 border-swiss-black bg-swiss-white p-8 h-[400px] flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-swiss-black pb-2">
               Severity Spread
            </h3>
            <div className="flex flex-col justify-end gap-2 h-full pb-8">
               {severityData.map((count, index) => (
                  <div key={index} className="flex items-center gap-4 w-full">
                     <span className="w-12 text-sm font-bold uppercase tracking-widest text-swiss-black/50">LVL {index + 1}</span>
                     <div className="flex-1 bg-swiss-muted h-8 border-r-2 border-swiss-black relative">
                        <div 
                          className="h-full absolute left-0 top-0 border-y-2 border-r-2 border-swiss-black transition-all duration-1000" 
                          style={{ 
                            width: `${complaints.length ? Math.max((count / complaints.length) * 100, 2) : 2}%`,
                            backgroundColor: index === 4 || index === 3 ? '#FF3000' : '#000000'
                          }}
                        ></div>
                     </div>
                     <span className="w-8 text-right font-black uppercase tracking-tighter">{count}</span>
                  </div>
               ))}
            </div>
            <p className="text-xs uppercase font-bold tracking-widest text-center text-swiss-black/40 mt-auto border-t-2 border-dashed border-swiss-black/10 pt-4">
              Distribution of cryptographic severity weights
            </p>
          </div>
      </div>
    </div>
  );
}
