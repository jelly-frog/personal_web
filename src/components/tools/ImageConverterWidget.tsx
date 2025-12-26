import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, RefreshCw } from 'lucide-react';

const ImageConverterWidget = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('png');
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConvert = () => {
    if (!selectedFile) return;
    setIsConverting(true);
    // Simulate conversion
    setTimeout(() => {
      setIsConverting(false);
      alert(`已将 ${selectedFile.name} 转换为 ${targetFormat} 格式 (模拟)`);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="image-upload" className="cursor-pointer block">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-20 mx-auto object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <span className="text-xs">点击上传图片</span>
                </div>
              )}
            </div>
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </Label>
        </div>
        
        <div className="flex flex-col gap-2 w-32">
          <Label>目标格式</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WEBP</option>
          </select>
          <Button onClick={handleConvert} disabled={!selectedFile || isConverting} size="sm">
            {isConverting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {isConverting ? '转换中' : '转换'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageConverterWidget;
