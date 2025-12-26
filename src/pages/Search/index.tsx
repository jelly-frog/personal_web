import React from 'react';

const SearchPage = () => {
  return (
    <div className="container py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">聚合搜索</h1>
      <div className="w-full max-w-2xl">
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Google</button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">Bing</button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">知网</button>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="输入关键词..." 
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md">搜索</button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;