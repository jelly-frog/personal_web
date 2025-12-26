import React from 'react';

const DashboardPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">成长追踪 (Dashboard)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold mb-4">输入/输出曲线</h3>
          <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">
            折线图占位符
          </div>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold mb-4">专业能力雷达</h3>
          <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">
            雷达图占位符
          </div>
        </div>
      </div>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">本季 OKR</h2>
        <div className="p-4 border rounded-lg bg-card">
          <h4 className="font-medium">Q2: 通过注册电气工程师基础考试</h4>
          <div className="w-full bg-secondary h-2 mt-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[30%]"></div>
          </div>
          <p className="text-xs text-right mt-1 text-muted-foreground">30%</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;