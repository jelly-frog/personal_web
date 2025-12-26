import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Quick Access */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            常用功能
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary">
            <span className="text-2xl">📝</span>
            <span className="text-xs">写笔记</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary">
            <span className="text-2xl">📊</span>
            <span className="text-xs">看报表</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recently Visited */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            最近访问
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Link to="/notes" className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
              📘 继电保护原理 - 第五章
              <span className="block text-xs text-muted-foreground mt-0.5">20分钟前</span>
            </Link>
            <Link to="/mutter" className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
              💬 关于 React Hooks 的思考
              <span className="block text-xs text-muted-foreground mt-0.5">1小时前</span>
            </Link>
            <Link to="/" className="block p-2 text-sm hover:bg-accent rounded-md transition-colors">
              🔧 图片压缩工具
              <span className="block text-xs text-muted-foreground mt-0.5">昨天</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-500" />
            内容更新
          </CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-3">
            <div className="flex gap-2 items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">新增笔记：卡尔曼滤波详解</p>
                <p className="text-xs text-muted-foreground">控制理论 · 3小时前</p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">工具更新：进制转换支持浮点数</p>
                <p className="text-xs text-muted-foreground">系统日志 · 1天前</p>
              </div>
            </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeftSidebar;
