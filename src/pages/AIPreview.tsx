import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Sparkles, Scissors, RefreshCw, Download, History, CheckCircle2, AlertCircle, ArrowLeft, Camera, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { auth, db, storage, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDocs, query, where, orderBy } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const HAIRSTYLES = [
  { id: 'fade', name: 'Skin Fade', icon: '✂️', desc: 'Sharp, modern, and clean.' },
  { id: 'buzz', name: 'Buzz Cut', icon: '🪒', desc: 'Minimalist and bold.' },
  { id: 'dreads', name: 'Dreadlocks', icon: '🧶', desc: 'Cultural and stylish.' },
  { id: 'taper', name: 'Taper Fade', icon: '📐', desc: 'Classic and versatile.' },
  { id: 'mohawk', name: 'Mohawk', icon: '🤘', desc: 'Edgy and expressive.' },
  { id: 'afro', name: 'Afro', icon: '☁️', desc: 'Natural and voluminous.' },
];

export default function AIPreview() {
  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) fetchHistory(u.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'ai_requests'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, etc.)');
        return;
      }
      // Limit size to 10MB for safety
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Please select an image under 10MB.');
        return;
      }
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep(2);
      toast.success('Photo uploaded! Now select a style.');
    }
  };

  const triggerUpload = () => {
    console.log('Triggering upload click');
    fileInputRef.current?.click();
  };

  const generateHairstyle = async () => {
    if (!image || !selectedStyle || !user) return;
    setLoading(true);
    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `ai_uploads/${user.uid}/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const originalUrl = await getDownloadURL(storageRef);

      // 2. Call AI
      console.log('Initializing Gemini AI...');
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('GEMINI_API_KEY is missing in process.env');
      }
      const ai = new GoogleGenAI({ apiKey: apiKey || "" });

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(image);
      });
      const base64Data = await base64Promise;
      console.log('Image base64 length:', base64Data.length);

      const prompt = `Act as a professional barber. I am providing a photo of a person. Please reimagine their hairstyle as a ${selectedStyle.name}. 
      Keep the face exactly the same, but change the hair to a high-quality, professional ${selectedStyle.name} that suits their face shape.
      Return only the reimagined image.`;
      console.log('Prompt:', prompt);

      console.log('Calling generateContent...');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: image.type } },
            { text: prompt }
          ]
        }
      });
      console.log('AI Response:', response);

      let generatedImageUrl = "";
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            console.log('Generated image found in response');
            break;
          }
        }
      }

      if (!generatedImageUrl) {
        console.error('No image part found in AI response parts:', response.candidates?.[0]?.content?.parts);
        throw new Error('No image was generated by the AI');
      }
      
      setResult(generatedImageUrl);
      setStep(4);

      // 3. Save to Firestore
      console.log('Saving to Firestore...');
      await addDoc(collection(db, 'ai_requests'), {
        userId: user.uid,
        inputImageUrl: originalUrl,
        resultImageUrl: generatedImageUrl,
        hairstyleType: selectedStyle.id,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'users', user.uid), {
        aiUsageCount: increment(1)
      });

      fetchHistory(user.uid);
      toast.success('Style generated successfully!');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'ai_requests');
      toast.error('Failed to generate style. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setImage(null);
    setPreviewUrl(null);
    setSelectedStyle(null);
    setResult(null);
  };

  if (!user) {
    return (
      <div className="pt-40 pb-24 px-6 text-center min-h-screen bg-black">
        <div className="max-w-md mx-auto glass p-12 rounded-[3rem]">
          <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Join the Club</h1>
          <p className="text-gray-400 mb-8">Please sign in to use our AI Hairstyle Preview technology.</p>
          <Link to="/login">
            <Button className="w-full bg-blue-600 py-6 rounded-2xl font-bold">Sign In Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-black relative">
      <div className="blue-glow top-0 left-1/4 w-[400px] h-[400px]" />
      <div className="blue-glow bottom-0 right-1/4 w-[400px] h-[400px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-gradient">AI PREVIEW.</h1>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-white/10'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Step {step} of 4</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(!showHistory)}
            className="glass border-white/10 rounded-2xl gap-2 h-14 px-6 font-bold"
          >
            <History className="w-5 h-5" />
            {showHistory ? 'Back to Tool' : 'My History'}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {history.map((item) => (
                <Card key={item.id} className="glass-card overflow-hidden border-white/10">
                  <div className="flex h-56 relative">
                    <img src={item.inputImageUrl} className="w-1/2 object-cover border-r border-white/10" alt="Original" />
                    <img src={item.resultImageUrl} className="w-1/2 object-cover" alt="Result" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-full shadow-xl">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold uppercase tracking-widest text-blue-400">{item.hairstyleType}</div>
                      <div className="text-[10px] text-gray-500 font-medium">{new Date(item.createdAt?.toDate()).toLocaleDateString()}</div>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-xl text-white/50 hover:text-white hover:bg-white/10">
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
              {history.length === 0 && (
                <div className="col-span-full py-32 text-center glass rounded-[3rem]">
                  <Sparkles className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                  <p className="text-gray-500 font-bold text-xl">No history yet. Let's create something!</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {step === 1 && (
                <div className="glass rounded-[4rem] p-12 md:p-24 text-center border-dashed border-white/20 hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-32 h-32 bg-blue-600/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                      <Camera className="text-blue-400 w-12 h-12" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Upload Your Portrait</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-12 text-lg font-medium">
                      For the most accurate style prediction, use a clear, front-facing photo with good lighting.
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                    <Button 
                      onClick={triggerUpload}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-8 rounded-3xl text-2xl font-black shadow-2xl shadow-blue-600/40 transition-all duration-500 hover:scale-105"
                    >
                      SELECT PHOTO
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {HAIRSTYLES.map((style) => (
                      <motion.button
                        key={style.id}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedStyle(style);
                          setStep(3);
                        }}
                        className={`glass-card p-8 text-left relative overflow-hidden group ${
                          selectedStyle?.id === style.id ? 'border-blue-500 bg-blue-500/10' : ''
                        }`}
                      >
                        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{style.icon}</div>
                        <h3 className="text-2xl font-bold mb-2">{style.name}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed font-medium">{style.desc}</p>
                        {selectedStyle?.id === style.id && (
                          <div className="absolute top-6 right-6 bg-blue-500 rounded-full p-1.5 shadow-lg">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500 hover:text-white font-bold text-lg">
                    <ArrowLeft className="w-5 h-5 mr-3" /> Back to Upload
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="glass rounded-[4rem] p-12 md:p-16 border-white/10">
                  <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2 aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-3xl">
                      <img src={previewUrl!} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                    <div className="flex-1 space-y-10">
                      <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-blue-400 font-black mb-4">Target Style</div>
                        <h3 className="text-5xl md:text-6xl font-black tracking-tighter">{selectedStyle?.name}</h3>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex items-start gap-6">
                        <div className="p-4 bg-blue-600/20 rounded-2xl">
                          <Sparkles className="text-blue-400 w-8 h-8" />
                        </div>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          Our Nanobanana AI engine will now analyze your facial structure and blend it with the {selectedStyle?.name} style.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={generateHairstyle} 
                          disabled={loading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-8 rounded-3xl text-2xl font-black shadow-2xl shadow-blue-600/40 transition-all duration-500 hover:scale-105"
                        >
                          {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : 'GENERATE LOOK'}
                        </Button>
                        <Button variant="outline" onClick={() => setStep(2)} className="glass border-white/10 rounded-3xl px-10 py-8 text-xl font-bold">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-12">
                  <div className="glass rounded-[4rem] p-12 md:p-24 border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                      <Scissors className="w-96 h-96 rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
                      <div className="w-full md:w-1/2 aspect-[3/4] rounded-[3rem] overflow-hidden shadow-5xl border border-white/30">
                        <img src={result!} className="w-full h-full object-cover" alt="AI Result" />
                      </div>
                      <div className="flex-1 space-y-10">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/20 text-green-400 text-sm font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-5 h-5" /> STYLE READY
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">YOUR NEW <br /><span className="text-blue-500">IDENTITY.</span></h2>
                        <p className="text-gray-400 text-xl font-medium leading-relaxed">
                          The {selectedStyle?.name} perfectly complements your features. Ready to make this transformation real?
                        </p>
                        <div className="flex flex-col gap-6">
                          <a href="https://wa.me/254112478220" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-10 rounded-3xl text-2xl font-black shadow-2xl shadow-blue-600/40 transition-all duration-500 hover:scale-105">
                              BOOK THIS STYLE
                            </Button>
                          </a>
                          <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="glass border-white/10 rounded-2xl h-16 text-lg font-bold hover:bg-white/10">
                              <Download className="w-5 h-5 mr-3" /> Save
                            </Button>
                            <Button variant="outline" onClick={reset} className="glass border-white/10 rounded-2xl h-16 text-lg font-bold hover:bg-white/10">
                              Try Another
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
