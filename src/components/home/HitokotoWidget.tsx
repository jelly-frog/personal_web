import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Gift, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface HitokotoData {
  id: number;
  hitokoto: string;
  from: string;
  from_who: string | null;
  creator: string;
  created_at: string;
}

const HitokotoWidget = () => {
  const [data, setData] = useState<HitokotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // AI Interpretation States
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchHitokoto = async () => {
    setLoading(true);
    setError(false);
    setAiInterpretation(null); // Reset AI result on new quote
    try {
      const res = await fetch('https://v1.hitokoto.cn');
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch hitokoto:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAiInterpret = async () => {
    if (!data?.hitokoto) return;
    setIsAiLoading(true);
    
    // --- AI API INTEGRATION POINT ---
    // TODO: Replace the following mock logic with actual AI Model API call
    // Example:
    // const apiKey = process.env.REACT_APP_AI_API_KEY;
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    //   body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: `解读这句话: ${data.hitokoto}` }] })
    // });
    // const result = await response.json();
    // setAiInterpretation(result.choices[0].message.content);
    
    // Mock Delay & Response
    setTimeout(() => {
      const mockInterpretations = [
        "这句话巧妙地运用了隐喻，揭示了生活中的不确定性与希望并存的本质。",
        "作者通过简洁的语言，表达了对时光流逝的感叹以及对当下的珍惜。",
        "这是一种典型的理想主义视角，试图在平凡的日常中寻找超脱的意义。",
        "字里行间流露出一丝淡淡的忧伤，却又不失温暖的底色，引人深思。",
        "通过对自然景象的描绘，映射了人物内心的波澜，是情景交融的佳作。"
      ];
      const randomInt = mockInterpretations[Math.floor(Math.random() * mockInterpretations.length)];
      setAiInterpretation(`【AI 深度解读】：${randomInt} (此处为模拟 AI 输出，请接入真实 API)`);
      setIsAiLoading(false);
    }, 1500);
    // --------------------------------
  };

  useEffect(() => {
    fetchHitokoto();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-primary/20 h-full overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 shrink-0">
        <CardTitle className="text-lg text-primary flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-500" />
          开个盲盒
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-transform active:rotate-180"
          onClick={fetchHitokoto}
          disabled={loading}
          title="换一个"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between gap-4 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 py-4"
            >
              <div className="h-4 bg-primary/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-primary/10 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-primary/10 rounded w-2/3 animate-pulse" />
            </motion.div>
          ) : error ? (
            <motion.p 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-destructive py-4"
            >
              盲盒空空如也，请稍后重试...
            </motion.p>
          ) : (
            <motion.div
              key={data?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Quote Content */}
              <div>
                <blockquote className="italic text-muted-foreground text-lg font-serif leading-relaxed border-l-4 border-purple-300 pl-4 py-1">
                  "{data?.hitokoto}"
                </blockquote>
                <div className="text-right space-y-1 mt-2">
                  <p className="text-sm font-medium text-foreground">
                    —— {data?.from_who || data?.from}
                  </p>
                  {data?.from && data?.from !== data?.from_who && (
                    <p className="text-xs text-muted-foreground">
                      《{data.from}》
                    </p>
                  )}
                </div>
              </div>

              {/* AI Interaction Section */}
              <div className="pt-2 border-t border-border/50">
                {!aiInterpretation && !isAiLoading && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                    onClick={handleAiInterpret}
                  >
                    <Bot className="h-4 w-4" />
                    AI 解读一下
                  </Button>
                )}

                {isAiLoading && (
                   <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                     <Sparkles className="h-4 w-4 animate-pulse text-yellow-500" />
                     AI 正在思考中...
                   </div>
                )}

                {aiInterpretation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-purple-50/50 rounded-lg p-3 text-sm text-slate-700 leading-relaxed border border-purple-100"
                  >
                    <div className="flex items-center gap-2 mb-1 text-purple-700 font-medium">
                      <Bot className="h-3 w-3" />
                      AI 解读
                    </div>
                    {aiInterpretation}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default HitokotoWidget;
