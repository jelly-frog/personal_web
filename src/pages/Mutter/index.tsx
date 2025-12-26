import React from 'react';

const MutterPage = () => {
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">碎碎念</h1>
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-card shadow-sm">
          <p className="mb-2">Hello World! 这是第一条碎碎念。</p>
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>2025-12-26</span>
            <span>0 评论</span>
          </div>
        </div>
        <div className="p-4 border rounded-lg bg-card shadow-sm">
          <p className="mb-2">正在搭建这个个人网站，感觉 React + Tailwind 真的很棒！</p>
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>2025-12-26</span>
            <span>0 评论</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutterPage;