import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoWidget = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: '复习控制理论第三章', completed: false },
    { id: '2', text: '更新个人网站', completed: true },
    { id: '3', text: '阅读一篇 IEEE 论文', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length ? (completedCount / todos.length) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg">今日待办</CardTitle>
          <span className="text-sm text-muted-foreground">{completedCount} / {todos.length}</span>
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Todo List */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-3 group">
              <Checkbox 
                id={todo.id} 
                checked={todo.completed} 
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <label 
                htmlFor={todo.id} 
                className={cn(
                  "flex-1 text-sm cursor-pointer transition-all",
                  todo.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}
              >
                {todo.text}
              </label>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              暂无待办，享受生活吧！🎉
            </div>
          )}
        </div>

        {/* Add New */}
        <div className="flex gap-2 pt-2 mt-auto border-t">
          <Input 
            placeholder="添加新任务..." 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="h-9"
          />
          <Button size="sm" onClick={handleAdd} className="h-9 px-3">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoWidget;
