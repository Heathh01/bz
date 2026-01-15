import React, { useState } from 'react';
import { PersonaType, PersonaData } from './types';
import { generatePersonaProfile } from './services/geminiService';
import { Button } from './components/Button';
import { ProfileHeader } from './components/ProfileHeader';
import { PostCard } from './components/PostCard';
import { Sparkles, Gem, Building2, Smartphone, Check } from 'lucide-react';

// Placeholder component for the empty state
const PhonePlaceholder: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4 p-8 opacity-50">
    <div className="w-20 h-20 rounded-full border-2 border-gray-800 flex items-center justify-center">
      <Smartphone className="w-8 h-8" />
    </div>
    <div className="text-center space-y-2">
      <p className="font-serif text-lg">人设预览</p>
      <p className="text-xs max-w-[200px] mx-auto">
        在左侧配置参数，点击生成，即可在此处查看你的“顶级人设”。
      </p>
    </div>
    {/* Skeleton lines */}
    <div className="w-full max-w-[200px] space-y-2 mt-8">
      <div className="h-2 bg-gray-800 rounded w-full"></div>
      <div className="h-2 bg-gray-800 rounded w-3/4 mx-auto"></div>
      <div className="h-2 bg-gray-800 rounded w-1/2 mx-auto"></div>
    </div>
  </div>
);

// Checkbox Component
const CheckboxOption: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
      checked 
        ? 'bg-gold-600/10 border-gold-600 shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
        : 'bg-luxury-900/50 border-white/10 hover:border-white/30'
    }`}
  >
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
      checked ? 'bg-gold-600 border-gold-600' : 'border-gray-500 bg-transparent'
    }`}>
      {checked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
    </div>
    <span className={`text-xs ${checked ? 'text-gold-500 font-medium' : 'text-gray-400'}`}>{label}</span>
  </div>
);

const App: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [personaType, setPersonaType] = useState<PersonaType>(PersonaType.CEO);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Options State
  const [includeMCN, setIncludeMCN] = useState(false);
  const [includeShareholders, setIncludeShareholders] = useState(false);
  const [includeStats, setIncludeStats] = useState(false);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generatePersonaProfile(keyword, personaType, {
        includeMCN,
        includeShareholders,
        includeStats
      });
      setResult(data);
    } catch (err) {
      setError("生成失败，请重试。（请检查API Key是否正确）");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-900 text-gray-200 font-sans selection:bg-gold-600 selection:text-black flex flex-col">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col">
        
        {/* Header Section */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-600/10 border border-gold-600/30 text-gold-500 text-xs tracking-[0.2em] uppercase font-bold animate-pulse">
            <Sparkles className="w-3 h-3" />
            Elite Persona Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
            <span className="gold-text">你的互联网顶层人设</span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base font-light">
             互联网侦探出品，顶级多模态AI模型驱动，一键化身“霸总”或“名媛”，制霸抖音小红书。（广告合作小红书：netzhentan)
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Controls (Span 5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 z-10">
            <div className="bg-luxury-800/80 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl">
              <div className="flex flex-col gap-8">
                
                {/* Type Selection */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 block">1. 选择人设类型</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPersonaType(PersonaType.CEO)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-300 gap-2 group ${
                        personaType === PersonaType.CEO
                          ? 'border-gold-600 bg-gold-600/10 text-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 hover:border-white/30 text-gray-500 hover:text-gray-300 bg-black/20'
                      }`}
                    >
                      <Building2 className={`w-6 h-6 ${personaType === PersonaType.CEO ? 'text-gold-500' : 'text-gray-600 group-hover:text-gray-400'}`} />
                      <div className="text-center">
                        <span className="block font-serif font-bold">顶级霸总</span>
                        <span className="text-[10px] opacity-70">孤独 / 资本 / 格局</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPersonaType(PersonaType.SOCIALITE)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-300 gap-2 group ${
                        personaType === PersonaType.SOCIALITE
                          ? 'border-gold-600 bg-gold-600/10 text-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 hover:border-white/30 text-gray-500 hover:text-gray-300 bg-black/20'
                      }`}
                    >
                      <Gem className={`w-6 h-6 ${personaType === PersonaType.SOCIALITE ? 'text-gold-500' : 'text-gray-600 group-hover:text-gray-400'}`} />
                      <div className="text-center">
                        <span className="block font-serif font-bold">清醒名媛</span>
                        <span className="text-[10px] opacity-70">搞钱 / 独立 / 所谓</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Keyword Input */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">2. 核心关键词</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder={personaType === PersonaType.CEO ? "例如：并购、迪拜、凌晨三点、高尔夫" : "例如：下午茶、普拉提、爱马仕、独立女性"}
                      className="w-full bg-luxury-900/80 border border-white/20 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600 transition-all placeholder:text-gray-600"
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <div className="absolute inset-0 border border-white/0 rounded-lg pointer-events-none group-hover:border-white/10 transition-colors"></div>
                  </div>
                </div>

                {/* Extra Options */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">3. 简介增强（可选）</label>
                    <div className="flex flex-col gap-2">
                        <CheckboxOption 
                            label="添加 '新晋卓越MCN总裁' 头衔" 
                            checked={includeMCN} 
                            onChange={setIncludeMCN} 
                        />
                        <CheckboxOption 
                            label="添加 '前XX万粉成为我的精神股东'" 
                            checked={includeShareholders} 
                            onChange={setIncludeShareholders} 
                        />
                        <CheckboxOption 
                            label="展示身高、体重数据" 
                            checked={includeStats} 
                            onChange={setIncludeStats} 
                        />
                    </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  isLoading={loading}
                  disabled={!keyword.trim()}
                  className="w-full rounded-lg shadow-lg hover:shadow-gold-600/20"
                >
                  一键生成人设
                </Button>
                
                {error && (
                   <div className="text-red-400 text-xs text-center font-mono border border-red-900/50 bg-red-900/10 p-3 rounded">
                     {error}
                   </div>
                )}
              </div>
            </div>

            {/* Guide/Instructions */}
            <div className="hidden lg:block p-6 border border-white/5 rounded-xl bg-white/5 text-gray-500 text-sm leading-relaxed">
              <h3 className="text-gold-600 font-serif mb-2 font-bold">视觉风格指南</h3>
              <ul className="space-y-2 list-disc list-inside text-xs">
                <li><strong className="text-gray-400">霸总：</strong> 深色调、模糊CBD夜景、豪车内饰、名表。</li>
                <li><strong className="text-gray-400">名媛：</strong> 高亮滤镜、普拉提房、精致下午茶、现金。</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Phone Preview (Span 7) */}
          <div className="lg:col-span-7 flex justify-center items-start min-h-[600px]">
            <div className="relative w-full max-w-[400px] aspect-[9/19] bg-black border-4 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden ring-4 ring-black ring-opacity-50">
              
              {/* Phone Notch/Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-luxury-800 z-50 flex justify-between items-start px-8 pt-4 text-[10px] text-white font-medium">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl"></div>
                <span>12:42</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-4 h-3 bg-white/20 rounded-sm flex flex-col justify-between p-[1px]">
                     <div className="h-full bg-white w-[80%]"></div>
                  </div>
                </div>
              </div>
              
              {/* Phone Content Scrollable Area */}
              <div className="absolute inset-0 pt-10 pb-2 bg-luxury-900 overflow-y-auto scrollbar-hide">
                {result ? (
                  <div className="animate-fade-in pb-10">
                    <ProfileHeader data={result} />
                    
                    <div className="p-1">
                      <div className="flex border-b border-white/10 mb-4 sticky top-0 bg-luxury-900/95 backdrop-blur z-20">
                        <div className="flex-1 text-center py-3 text-gold-500 border-b-2 border-gold-500 text-sm font-bold uppercase tracking-wide cursor-pointer hover:bg-white/5 transition-colors">
                          作品
                        </div>
                        <div className="flex-1 text-center py-3 text-gray-600 text-sm font-bold uppercase tracking-wide cursor-pointer hover:bg-white/5 transition-colors">
                          喜欢
                        </div>
                      </div>

                      {result.posts.map((post, index) => (
                        <PostCard key={index} post={post} authorName={result.idName} index={index} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <PhonePlaceholder />
                )}
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-500 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
