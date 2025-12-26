import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

interface DashboardData {
  charts: {
    activity: {
      title: string;
      data: Array<{ name: string; input: number; output: number }>;
    };
    skills: {
      title: string;
      data: Array<{ subject: string; A: number; fullMark: number }>;
    };
  };
  okrs: Array<{
    id: number;
    title: string;
    progress: number;
  }>;
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/dashboard.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">加载数据中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-8 text-center text-red-500">
        加载失败，请检查 public/dashboard.json 文件格式
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">成长追踪 (Dashboard)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Activity Line Chart */}
        <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-6 text-lg flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            {data.charts.activity.title}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.activity.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#888' }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#888' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#888', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="input" 
                  name="输入"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="output" 
                  name="输出"
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Radar Chart */}
        <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-6 text-lg flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            {data.charts.skills.title}
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.charts.skills.data}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="能力值"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* OKR Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🎯 本季 OKR
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.okrs.map((okr) => (
            <div key={okr.id} className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors">{okr.title}</h4>
                <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {okr.progress}%
                </span>
              </div>
              <div className="w-full bg-secondary/50 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                  style={{ width: `${okr.progress}%` }}
                >
                  <div className="absolute inset-0 bg-primary" />
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;