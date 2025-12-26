import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ChevronRight, Calendar, Tag, FileText, Star, BookOpen, List, AlignLeft, LayoutGrid, Zap, Code, Database, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  filename: string;
  summary: string;
  starred?: boolean;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Map categories to icons
const getCategoryIcon = (category: string) => {
  if (!category) return LayoutGrid;
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes('web')) return Code;
  if (lowerCat.includes('power') || lowerCat.includes('电力')) return Zap;
  if (lowerCat.includes('data') || lowerCat.includes('数据库')) return Database;
  if (lowerCat.includes('control') || lowerCat.includes('控制')) return Cpu;
  return LayoutGrid;
};

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const NotesPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [content, setContent] = useState<string>('');
  const [introContent, setIntroContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('Web 开发'); 
  const [toc, setToc] = useState<TOCItem[]>([]);
  
  // Refs for GSAP
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useGSAP(() => {
    if (!contentRef.current) return;

    // 1. Progress Bar Animation
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: contentRef.current,
          scroller: contentRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        }
      });
    }

    // 2. Badge Rotation & Parallax
    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: contentRef.current,
          scroller: contentRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });
    }

    // 3. Title Parallax
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: 100,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: contentRef.current,
          scroller: contentRef.current,
          start: 'top top',
          end: '500px top',
          scrub: true,
        }
      });
    }

  }, { scope: containerRef, dependencies: [selectedPost, content] });

  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for Sticky Header styling
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setIsScrolled(contentRef.current.scrollTop > 20);
      }
    };
    
    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Fetch posts index on mount
  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
        if (data.length > 0) {
          const firstCategory = data[0].category;
          setFilterCategory(firstCategory);
        }
      })
      .catch(err => {
        console.error('Failed to load posts index:', err);
        setLoading(false);
      });
  }, []);

  // Fetch Category Intro when category changes and no post selected
  useEffect(() => {
    if (!selectedPost) {
      setLoading(true);
      // Ensure we have a valid filterCategory before processing
      if (!filterCategory) {
          setIntroContent('');
          setLoading(false);
          return;
      }
      
      // Convert category to slug:
      // 1. Lowercase
      // 2. Replace spaces with hyphens
      // 3. Remove special chars except hyphens
      // 4. Encode URI component to handle non-ASCII chars safely
      const slug = filterCategory === 'All' 
        ? 'all' 
        : filterCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-\u4e00-\u9fa5]/g, '');
        
      const introFile = `/posts/intro-${slug}.md`;
      
      fetch(introFile)
        .then(res => {
          if (res.ok) {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
              throw new Error('Intro file not found (served html)');
            }
            return res.text();
          }
          throw new Error('No intro file');
        })
        .then(text => {
          setIntroContent(text);
          setLoading(false);
        })
        .catch(() => {
          setIntroContent(`# ${filterCategory}\n\n该分类下暂无简介文档。\n\n请在左侧选择一篇笔记开始阅读。`);
          setLoading(false);
        });
    }
  }, [filterCategory, selectedPost]);

  // Fetch post content when selected
  useEffect(() => {
    if (selectedPost) {
      setLoading(true);
      fetch(`/posts/${selectedPost.filename}`)
        .then(res => res.text())
        .then(text => {
          setContent(text);
          setLoading(false);
          const headers = text.match(/^#\s+(.+)$/gm);
          if (headers) {
             const items = headers.map(h => ({
               text: h.replace(/^#\s+/, ''),
               id: h.replace(/^#\s+/, '').toLowerCase().replace(/\s+/g, '-'),
               level: 1
             }));
             setToc(items);
          } else {
            setToc([]);
          }
        })
        .catch(err => console.error('Failed to load post content:', err));
    } else {
      setToc([]);
    }
  }, [selectedPost]);

  const categories = useMemo(() => {
    // Ensure we only deal with valid category strings
    const validPosts = posts.filter(p => p && p.category);
    const cats = Array.from(new Set(validPosts.map(p => p.category)));
    return ['All', ...cats];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let currentPosts = filterCategory === 'All' 
      ? posts 
      : posts.filter(p => p.category === filterCategory);
    
    return currentPosts.sort((a, b) => {
      if (a.starred === b.starred) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.starred ? -1 : 1;
    });
  }, [posts, filterCategory]);

  const scrollToSection = (text: string) => {
     const elements = document.querySelectorAll('h1, h2, h3');
     for (let i = 0; i < elements.length; i++) {
       if (elements[i].textContent?.includes(text)) {
         elements[i].scrollIntoView({ behavior: 'smooth' });
         break;
       }
     }
  };

  return (
    <div ref={containerRef} className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background relative">
      {/* 
        Sticky Top Navigation Bar 
        - Reference Style: Neo-brutalist / Pop Art
        - Solid borders, bold typography, high contrast
      */}
      <div 
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-background border-y-2 border-foreground transition-all duration-300 relative"
      >
        {/* Progress Bar */}
        <div ref={progressBarRef} className="absolute bottom-0 left-0 h-1 bg-[#FFD54F] z-10 w-0" />

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center h-16 px-6 min-w-max">
            {/* Brand Badge mimicking the reference style */}
            <div 
              ref={badgeRef}
              className="mr-8 px-4 py-1.5 bg-[#FFD54F] border-2 border-foreground rounded-full font-black text-foreground shadow-[2px_2px_0px_0px_currentColor] select-none"
            >
              NOTES
            </div>

            {/* Vertical Separator */}
            <div className="h-8 w-[2px] bg-foreground mr-8 rotate-12 hidden sm:block" />

            {categories.map((cat, index) => {
              const isActive = filterCategory === cat;
              return (
                <React.Fragment key={cat}>
                  <button
                    onClick={() => {
                      setFilterCategory(cat);
                      setSelectedPost(null);
                    }}
                    className={cn(
                      "relative px-4 py-1.5 text-sm font-black uppercase transition-all border-2",
                      isActive
                        ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_currentColor] -translate-y-1"
                        : "bg-transparent border-transparent text-foreground hover:underline decoration-2 underline-offset-4"
                    )}
                  >
                    {cat === 'All' ? 'ALL' : cat}
                  </button>
                  
                  {index < categories.length - 1 && (
                     <div className="mx-4 text-foreground font-black select-none text-xl">*</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Post List */}
        <aside className="w-80 border-r bg-card/30 flex flex-col shrink-0 transition-all duration-300">
          <div className="p-4 border-b flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <List className="h-4 w-4" />
              目录
            </h2>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {filteredPosts.length}
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {filteredPosts.map(post => (
                <div key={post.id} className="space-y-1">
                  <div 
                    onClick={() => setSelectedPost(post)}
                    className={cn(
                      "group flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                      selectedPost?.id === post.id 
                        ? "bg-primary/5 border-primary/20 shadow-sm translate-x-1" 
                        : "bg-transparent border-transparent hover:bg-muted/50 hover:border-border hover:translate-x-1"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={cn(
                        "font-medium text-sm leading-tight line-clamp-2 transition-colors",
                        selectedPost?.id === post.id ? "text-primary" : "text-foreground group-hover:text-primary"
                      )}>
                        {post.title}
                      </h3>
                      {post.starred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0 mt-0.5 animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                    </div>
                  </div>
                  
                  {/* TOC Expansion in Sidebar */}
                  <AnimatePresence>
                    {selectedPost?.id === post.id && toc.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 pr-2 border-l-2 border-primary/10 ml-2 space-y-1 overflow-hidden"
                      >
                         {toc.map((item, idx) => (
                           <button
                             key={idx}
                             onClick={(e) => {
                               e.stopPropagation();
                               scrollToSection(item.text);
                             }}
                             className="text-xs text-muted-foreground hover:text-primary text-left w-full py-1.5 truncate block pl-2 transition-colors hover:bg-muted/30 rounded-r"
                           >
                             {item.text}
                           </button>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-y-auto bg-background relative scroll-smooth" 
          ref={contentRef}
        >
          <div className="max-w-4xl mx-auto p-8 min-h-full">
            {selectedPost ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={selectedPost.id}
              >
                <div className="mb-8 pb-6 border-b">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium flex items-center gap-1">
                      {/* Safe call to get icon */}
                      {(() => {
                        const Icon = getCategoryIcon(selectedPost.category);
                        return <Icon className="h-3 w-3" />;
                      })()}
                      {selectedPost.category}
                    </span>
                    {selectedPost.starred && (
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 text-xs rounded-md font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-600" /> 精选
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">{selectedPost.title}</h1>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {selectedPost.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> {content.length} 字
                    </span>
                  </div>
                </div>

                <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:underline">
                   {loading ? (
                     <div className="space-y-6">
                       <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                       <div className="h-4 bg-muted rounded w-full animate-pulse" />
                       <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                       <div className="h-64 bg-muted rounded w-full animate-pulse mt-8" />
                     </div>
                   ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                   )}
                </article>
              </motion.div>
            ) : (
              // Category Intro / Empty State
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-20"
              >
                <div className="bg-primary/5 p-6 rounded-full animate-bounce-slow">
                  <BookOpen className="h-16 w-16 text-primary/40" />
                </div>
                {loading ? (
                   <div className="space-y-2 w-full max-w-md">
                     <div className="h-4 bg-muted rounded w-full animate-pulse" />
                     <div className="h-4 bg-muted rounded w-2/3 animate-pulse mx-auto" />
                   </div>
                ) : (
                  <article className="prose prose-slate dark:prose-invert max-w-lg text-left bg-card p-8 rounded-xl border shadow-sm">
                    <ReactMarkdown>{introContent}</ReactMarkdown>
                  </article>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotesPage;
