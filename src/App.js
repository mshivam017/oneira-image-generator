import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight,
  X, 
  Download, 
  Maximize2,
  Plus
} from 'lucide-react';

// --- Configuration ---
const apiKey = import.meta.env.GEMINI_API_KEY || ""; 

// --- Constants ---
const STYLES = [
  { id: 'realistic', label: 'Realistic' },
  { id: 'anime', label: 'Anime' },
  { id: 'digital', label: 'Digital' },
  { id: '3d', label: '3D' },
  { id: 'painting', label: 'Painting' },
];

const RATIOS = [
  { id: 'square', label: '1:1', w: 1024, h: 1024 },
  { id: 'portrait', label: '3:4', w: 1024, h: 1536 },
  { id: 'landscape', label: '4:3', w: 1536, h: 1024 },
];

const INITIAL_IMAGES = [
  { id: 1, url: 'https://picsum.photos/seed/min1/1024/1024', prompt: 'A solitary chair in an empty room, dramatic lighting', style: 'Realistic' },
];

const SAMPLE_PROMPTS = [
  "A single white flower in a glass vase, studio lighting",
  "Foggy mountain landscape at dawn, minimalist composition",
  "Abstract geometric architecture, concrete and glass",
  "Portrait of a woman with freckles, soft natural light, black and white",
  "A calm ocean horizon, pastel colors, oil painting style"
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedRatio, setSelectedRatio] = useState(RATIOS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [activeImage, setActiveImage] = useState(null);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInspireMe = () => {
    const newPrompt = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(newPrompt);
  };

  const generateImageAPI = async (promptText) => {
    const fullPrompt = `${promptText}, ${selectedStyle.label} style, high quality, minimalist`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: fullPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: selectedRatio.id === 'square' ? '1:1' : selectedRatio.id === 'portrait' ? '3:4' : '4:3'
          }
        }),
      }
    );
    if (!response.ok) throw new Error('API Error');
    const result = await response.json();
    if (result.predictions?.[0]?.bytesBase64Encoded) {
      return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    }
    throw new Error('No data');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    setActiveImage(null); 

    try {
      let url;
      try {
        url = await generateImageAPI(prompt);
      } catch (err) {
        console.warn('API unavailable, using mock');
        await new Promise(r => setTimeout(r, 2000));
        const seed = Math.floor(Math.random() * 100000);
        url = `https://picsum.photos/seed/${seed}/${selectedRatio.w}/${selectedRatio.h}`;
      }

      const newImg = {
        id: Date.now(),
        url,
        prompt,
        style: selectedStyle.label
      };

      setImages(prev => [newImg, ...prev]);
      setActiveImage(newImg);
    } catch (e) {
      setError('Error generating image.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            className="text-xl font-bold tracking-tighter hover:opacity-50 transition-opacity"
            onClick={() => setActiveImage(null)}
          >
            Oneira.
          </button>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm font-medium hover:underline decoration-1 underline-offset-4"
          >
            {showHistory ? 'Close' : 'Gallery'}
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="pt-24 pb-12 px-6 max-w-screen-md mx-auto relative min-h-[80vh] flex flex-col justify-center">
        
        {/* History Overlay - Slide Down */}
        <div className={`
          fixed inset-x-0 top-16 bg-white border-b border-neutral-100 z-40 overflow-hidden transition-all duration-500 ease-in-out
          ${showHistory ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map(img => (
              <button 
                key={img.id}
                onClick={() => { setActiveImage(img); setShowHistory(false); window.scrollTo(0,0); }}
                className="aspect-square bg-neutral-50 grayscale hover:grayscale-0 transition-all duration-500"
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* --- Editor View --- */}
        <div className={`transition-all duration-700 ${activeImage || isGenerating ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
              Create something <span className="font-serif italic">new.</span>
            </h1>

            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="w-full min-h-[160px] bg-transparent border border-neutral-200 p-5 text-2xl md:text-3xl font-light focus:outline-none focus:border-black rounded-none resize-none placeholder:text-neutral-300 transition-colors"
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <button 
                onClick={handleInspireMe}
                className="absolute bottom-3 right-3 text-xs font-medium text-neutral-400 hover:text-black transition-colors flex items-center gap-1"
              >
                <Sparkles size={12} />
                Inspire
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-6 pt-2">
              
              <div className="space-y-2">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Style</span>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`
                        px-4 py-2 text-sm border rounded-full transition-all duration-300
                        ${selectedStyle.id === style.id 
                          ? 'border-black bg-black text-white' 
                          : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'}
                      `}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Ratio</span>
                <div className="flex gap-2">
                  {RATIOS.map(ratio => (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio)}
                      className={`
                        w-10 h-10 flex items-center justify-center border rounded-full text-xs transition-all duration-300
                        ${selectedRatio.id === ratio.id 
                          ? 'border-black bg-black text-white' 
                          : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'}
                      `}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="group flex items-center gap-4 text-xl font-light hover:opacity-50 transition-opacity disabled:opacity-20"
              >
                Generate Image
                <span className="p-3 bg-black text-white rounded-full group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={20} />
                </span>
              </button>
            </div>
            
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </div>
        </div>

        {/* --- Result View --- */}
        {(activeImage || isGenerating) && (
          <div className="animate-in fade-in duration-700 w-full max-w-screen-lg mx-auto">
            
            <div className="relative w-full bg-neutral-50 min-h-[50vh] flex items-center justify-center mb-6">
               {/* Close Button */}
               {!isGenerating && (
                <button 
                  onClick={() => setActiveImage(null)}
                  className="absolute top-0 right-0 p-6 z-20 hover:rotate-90 transition-transform duration-300"
                >
                  <X size={24} />
                </button>
              )}

              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto"/>
                  <p className="text-sm font-medium tracking-widest uppercase">Processing</p>
                </div>
              ) : (
                <img 
                  src={activeImage.url} 
                  alt={activeImage.prompt} 
                  className="w-full h-auto object-contain max-h-[85vh] shadow-2xl"
                />
              )}
            </div>

            {!isGenerating && activeImage && (
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-t border-neutral-100 pt-6">
                <div className="max-w-lg">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1 block">Prompt</span>
                  <p className="text-2xl font-serif leading-relaxed text-neutral-900">
                    "{activeImage.prompt}"
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <button className="p-3 border border-neutral-200 rounded-full hover:bg-black hover:border-black hover:text-white transition-all">
                    <Download size={20} />
                  </button>
                  <button className="p-3 border border-neutral-200 rounded-full hover:bg-black hover:border-black hover:text-white transition-all">
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImage(null)}
                    className="ml-4 flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                  >
                    <Plus size={16} /> New
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}