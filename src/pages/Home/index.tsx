import React, { useState } from 'react';
import { Search, Calculator, Image as ImageIcon, Globe, GraduationCap, Github, ChevronDown, ChevronUp, Settings, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import TodoWidget from '@/components/home/TodoWidget';
import HitokotoWidget from '@/components/home/HitokotoWidget';
import LeftSidebar from '@/components/home/LeftSidebar';
import { useUIStore } from '@/store/uiStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BaseConverterWidget from '@/components/tools/BaseConverterWidget';
import ImageConverterWidget from '@/components/tools/ImageConverterWidget';

interface ToolConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType;
  color: string;
}

const HomePage = () => {
  const [activeEngine, setActiveEngine] = useState('Google');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const isScrolled = useUIStore((state) => state.isScrolled);
  
  // Tool Configuration & Order State
  const [toolOrder, setToolOrder] = useState<string[]>(['base', 'image']);

  const tools: Record<string, ToolConfig> = {
    base: {
      id: 'base',
      title: '进制转换器',
      description: '二进制 / 八进制 / 十进制 / 十六进制 快速互转',
      icon: Calculator,
      component: BaseConverterWidget,
      color: 'blue'
    },
    image: {
      id: 'image',
      title: '图片转换器',
      description: 'JPG / PNG / WEBP 格式互转与图片压缩工具',
      icon: ImageIcon,
      component: ImageConverterWidget,
      color: 'purple'
    }
  };

  const engines = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: <Globe className="h-4 w-4" /> },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: <Globe className="h-4 w-4" /> },
    { name: '知网', url: 'https://scholar.cnki.net/result?kw=', icon: <GraduationCap className="h-4 w-4" /> },
    { name: 'GitHub', url: 'https://github.com/search?q=', icon: <Github className="h-4 w-4" /> },
  ];

  const currentEngine = engines.find(e => e.name === activeEngine) || engines[0];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    window.open(currentEngine.url + encodeURIComponent(searchQuery), '_blank');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleTool = (toolId: string) => {
    setExpandedTool(expandedTool === toolId ? null : toolId);
  };

  const moveTool = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...toolOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setToolOrder(newOrder);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden -mt-16 mb-8">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url('/hero-bg.jpg')`,
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        >
          {/* Gradient Overlay for dark mode blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
        </div>
        
          {/* Central Avatar */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center pt-16">
            {!isScrolled && (
              <motion.div 
                layoutId="avatar-container"
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl bg-white flex-shrink-0"
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ borderRadius: '9999px', originX: 0.5, originY: 0.5 }}
              >
                <motion.img 
                  src="/avatar.png"
                  onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=Keroppi&background=8bc34a&color=fff"}
                  alt="User" 
                  className="w-full h-full object-cover block" 
                />
              </motion.div>
            )}

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-4xl font-bold text-white mt-6 shadow-sm"
           >
             Welcome to MySpace
           </motion.h1>

           {/* Scroll Down Indicator */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1, y: [0, 10, 0] }}
             transition={{ delay: 1, duration: 2, repeat: Infinity }}
             className="absolute bottom-10 text-white/80"
           >
             <ChevronDown className="h-8 w-8" />
           </motion.div>
        </div>
      </div>

      <div className="container pb-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 hidden lg:block">
          <LeftSidebar />
        </aside>

        {/* Main Content: Search & Tools */}
        <main className="lg:col-span-2 space-y-8">
          {/* Search Section */}
          <div className="flex flex-col items-center space-y-6 py-4">
            <h2 className="text-2xl font-bold text-primary/80">探索知识的海洋</h2>
            
            <div className="w-full max-w-xl space-y-4">
              {/* Search Input Group */}
              <div className="flex gap-2 relative w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  
                  {/* Engine Switcher Trigger */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" title={`当前引擎: ${activeEngine}`}>
                          {currentEngine.icon}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {engines.map((engine) => (
                          <DropdownMenuItem 
                            key={engine.name} 
                            onClick={() => setActiveEngine(engine.name)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            {engine.icon}
                            <span>{engine.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Input 
                    type="text" 
                    placeholder={`在 ${activeEngine} 中搜索...`}
                    className="pl-9 pr-12 h-12 text-lg shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button size="lg" className="h-12 px-6" onClick={handleSearch}>
                  搜索
                </Button>
              </div>
            </div>
          </div>

          {/* Tools Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">🛠️</span> 实用工具
              </h2>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>工具排序</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {toolOrder.map((toolId, index) => {
                     const tool = tools[toolId];
                     return (
                       <div key={toolId} className="flex items-center justify-between px-2 py-2 hover:bg-muted/50 rounded-sm">
                         <div className="flex items-center gap-2 text-sm">
                           <tool.icon className="h-4 w-4 text-muted-foreground" />
                           <span>{tool.title}</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-6 w-6" 
                             disabled={index === 0}
                             onClick={(e) => {
                               e.preventDefault();
                               moveTool(index, 'up');
                             }}
                           >
                             <ArrowUp className="h-3 w-3" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-6 w-6" 
                             disabled={index === toolOrder.length - 1}
                             onClick={(e) => {
                               e.preventDefault();
                               moveTool(index, 'down');
                             }}
                           >
                             <ArrowDown className="h-3 w-3" />
                           </Button>
                         </div>
                       </div>
                     );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence initial={false}>
                {toolOrder.map((toolId) => {
                  const tool = tools[toolId];
                  const Icon = tool.icon;
                  const Component = tool.component;
                  const isExpanded = expandedTool === toolId;
                  
                  return (
                    <motion.div
                       key={toolId}
                       layout
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className={`transition-all duration-300 border-l-4 ${isExpanded ? 'ring-2 ring-primary/20' : 'hover:shadow-md cursor-pointer flex flex-col justify-center min-h-[100px]'}`}
                        style={{ borderLeftColor: tool.color === 'blue' ? '#3b82f6' : '#a855f7' }}
                      >
                        <CardHeader 
                          className={cn(
                            "flex flex-row items-center justify-between space-y-0 cursor-pointer",
                            isExpanded ? "pb-2" : "py-6"
                          )}
                          onClick={() => toggleTool(toolId)}
                        >
                          <div className="space-y-1">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                              {tool.title}
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </CardTitle>
                            <CardDescription>
                              {tool.description}
                            </CardDescription>
                          </div>
                          <Icon className={cn("h-6 w-6 text-muted-foreground transition-transform duration-300", isExpanded && "scale-110 text-primary")} />
                        </CardHeader>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CardContent className="pt-4 border-t mt-2">
                                <Component />
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        </main>

        {/* Right Sidebar: Todo & Decoration */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Todo Widget */}
          <div className="h-[400px]">
             <TodoWidget />
          </div>

          {/* Daily Quote / Decoration */}
          <div className="h-auto">
             <HitokotoWidget />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
