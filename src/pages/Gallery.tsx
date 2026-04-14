import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon, Maximize2, X, Scissors, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GALLERY_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1000", title: "Sharp Skin Fade", category: "Fades" },
  { id: 2, url: "https://images.unsplash.com/photo-1593702295094-aec3e597e991?auto=format&fit=crop&q=80&w=1000", title: "Classic Pompadour", category: "Classic" },
  { id: 3, url: "https://images.unsplash.com/photo-1621605815841-aa88c82b022c?auto=format&fit=crop&q=80&w=1000", title: "Beard Sculpting", category: "Beard" },
  { id: 4, url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000", title: "Textured Crop", category: "Modern" },
  { id: 5, url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=1000", title: "Buzz Cut", category: "Minimal" },
  { id: 6, url: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&q=80&w=1000", title: "The Fortune Special", category: "Signature" },
  { id: 7, url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=1000", title: "Taper Fade", category: "Fades" },
  { id: 8, url: "https://images.unsplash.com/photo-1592647425447-1825643f48d0?auto=format&fit=crop&q=80&w=1000", title: "Modern Quiff", category: "Modern" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(GALLERY_IMAGES.map(img => img.category))];
  const filteredImages = filter === "All" ? GALLERY_IMAGES : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 mb-6"
          >
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Style Showcase</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-gradient">THE LOOKBOOK.</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            Browse through our portfolio of masterfully crafted hairstyles and grooming transformations.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              className={`rounded-2xl px-8 py-6 font-bold transition-all duration-500 ${
                filter === cat ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'glass border-white/10 text-gray-400'
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">{img.category}</div>
                    <div className="text-xl font-bold text-white">{img.title}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-5xl w-full aspect-[4/5] md:aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                      {selectedImage.category}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">{selectedImage.title}</h2>
                  </div>
                  <a href="https://wa.me/254112478220" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 rounded-3xl text-xl font-bold shadow-2xl shadow-blue-600/40">
                      GET THIS LOOK
                    </Button>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Callout */}
        <section className="mt-40 py-24 glass rounded-[4rem] border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 px-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">WANT TO SEE IT ON YOU?</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 font-medium">
              Use our AI Style Prediction tool to visualize any of these looks on your own face before you visit.
            </p>
            <Link to="/ai-preview">
              <Button className="bg-white text-black hover:bg-gray-200 px-12 py-8 rounded-3xl text-2xl font-black shadow-2xl transition-all duration-500 hover:scale-105">
                TRY AI PREVIEW
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
