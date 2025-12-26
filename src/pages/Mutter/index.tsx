import React, { useState, useEffect } from 'react';

interface Mutter {
  id: number;
  content: string;
  date: string;
  likes?: number;
}

const MutterPage = () => {
  const [mutters, setMutters] = useState<Mutter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/mutters.json')
      .then(res => res.json())
      .then(data => {
        // Sort by date desc (assuming ISO format or standard date string works, otherwise simple reverse)
        // Since JSON order is usually manual, we can just reverse to show newest first if user adds to bottom
        setMutters(data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load mutters:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-8 max-w-2xl mx-auto flex justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">碎碎念</h1>
      <div className="space-y-6">
        {mutters.map((item) => (
          <div key={item.id} className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <p className="mb-4 text-lg leading-relaxed whitespace-pre-wrap">{item.content}</p>
            <div className="text-xs text-muted-foreground flex justify-between items-center border-t pt-4">
              <span className="bg-secondary/50 px-2 py-1 rounded text-secondary-foreground">{item.date}</span>
              {item.likes !== undefined && (
                 <span className="flex items-center gap-1">
                   ❤️ {item.likes}
                 </span>
              )}
            </div>
          </div>
        ))}
        {mutters.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            暂时还没有碎碎念哦~
          </div>
        )}
      </div>
    </div>
  );
};

export default MutterPage;