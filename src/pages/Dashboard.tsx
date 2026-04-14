import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  Tag, 
  Image as ImageIcon, 
  Users, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db, auth } from '@/src/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'sonner';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Data states
  const [offers, setOffers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [aiRequests, setAiRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any>({
    headline: 'THE FUTURE OF GROOMING.',
    slogan: 'Fortune Barber Shop blends master craftsmanship with AI-powered style prediction to redefine your look.',
    aboutText: 'Fortune Barber Shop is more than just a place for a haircut. It\'s where tradition meets technology in the heart of Kakamega.'
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123fortune') {
      setIsAuthenticated(true);
      toast.success('Welcome, Admin!');
      fetchData();
    } else {
      toast.error('Invalid password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const offersSnap = await getDocs(collection(db, 'offers'));
      const gallerySnap = await getDocs(collection(db, 'gallery'));
      const aiSnap = await getDocs(query(collection(db, 'ai_requests'), orderBy('createdAt', 'desc'), limit(10)));
      const usersSnap = await getDocs(collection(db, 'users'));
      const contentSnap = await getDocs(collection(db, 'site_content'));
      
      if (!contentSnap.empty) {
        const content = contentSnap.docs[0].data();
        setSiteContent({
          headline: content.headline || siteContent.headline,
          slogan: content.slogan || siteContent.slogan,
          aboutText: content.aboutText || siteContent.aboutText
        });
      }

      setOffers(offersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setGallery(gallerySnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setAiRequests(aiSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use a fixed ID 'homepage' for site content
      const contentRef = doc(db, 'site_content', 'homepage');
      await updateDoc(contentRef, siteContent).catch(async (err) => {
        // If document doesn't exist, create it
        if (err.code === 'not-found') {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(contentRef, {
            ...siteContent,
            updatedAt: serverTimestamp()
          });
        } else {
          throw err;
        }
      });
      toast.success('Site content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-gray-500 text-sm">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 py-6 rounded-xl"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 py-6 rounded-xl font-bold">
              Access Dashboard
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <LayoutDashboard className="text-blue-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm">Manage your barber shop content and community.</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="border-white/10 rounded-xl">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-full md:w-auto overflow-x-auto flex justify-start">
          <TabsTrigger value="overview" className="rounded-xl px-6 data-[state=active]:bg-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="content" className="rounded-xl px-6 data-[state=active]:bg-blue-600">Content</TabsTrigger>
          <TabsTrigger value="offers" className="rounded-xl px-6 data-[state=active]:bg-blue-600">Offers</TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-xl px-6 data-[state=active]:bg-blue-600">Gallery</TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl px-6 data-[state=active]:bg-blue-600">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400' },
              { label: 'AI Requests', value: aiRequests.length, icon: Sparkles, color: 'text-purple-400' },
              { label: 'Active Offers', value: offers.filter(o => o.active).length, icon: Tag, color: 'text-green-400' },
              { label: 'Gallery Images', value: gallery.length, icon: ImageIcon, color: 'text-orange-400' },
            ].map((stat, i) => (
              <Card key={i} className="p-6 bg-white/5 border-white/10 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <BarChart3 className="w-4 h-4 text-gray-700" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 bg-white/5 border-white/10 rounded-[2rem]">
              <h3 className="text-xl font-bold mb-6">Recent AI Activity</h3>
              <div className="space-y-4">
                {aiRequests.map((req) => (
                  <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                      <img src={req.resultImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">User: {req.userId.substring(0, 8)}...</div>
                      <div className="text-[10px] text-gray-500 uppercase">{req.hairstyleType} • {new Date(req.createdAt?.toDate()).toLocaleDateString()}</div>
                    </div>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-white/5 border-white/10 rounded-[2rem]">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-32 rounded-3xl border-white/10 flex flex-col gap-3 hover:bg-blue-600/10 hover:border-blue-500/50">
                  <Plus className="w-6 h-6 text-blue-400" />
                  <span>New Offer</span>
                </Button>
                <Button variant="outline" className="h-32 rounded-3xl border-white/10 flex flex-col gap-3 hover:bg-blue-600/10 hover:border-blue-500/50">
                  <ImageIcon className="w-6 h-6 text-orange-400" />
                  <span>Add Gallery</span>
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-8 bg-white/5 border-white/10 rounded-[2rem] max-w-3xl">
            <h3 className="text-xl font-bold mb-6">Manage Site Content</h3>
            <form onSubmit={updateContent} className="space-y-6">
              <div className="space-y-2">
                <Label>Homepage Headline</Label>
                <Input 
                  value={siteContent.headline}
                  onChange={(e) => setSiteContent({ ...siteContent, headline: e.target.value })}
                  className="bg-white/5 border-white/10 py-6 rounded-xl"
                  placeholder="e.g. THE FUTURE OF GROOMING."
                />
              </div>
              <div className="space-y-2">
                <Label>Homepage Slogan</Label>
                <textarea 
                  value={siteContent.slogan}
                  onChange={(e) => setSiteContent({ ...siteContent, slogan: e.target.value })}
                  className="w-full min-h-[100px] bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. Fortune Barber Shop blends master craftsmanship..."
                />
              </div>
              <div className="space-y-2">
                <Label>About Us Page Text</Label>
                <textarea 
                  value={siteContent.aboutText}
                  onChange={(e) => setSiteContent({ ...siteContent, aboutText: e.target.value })}
                  className="w-full min-h-[200px] bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Describe your shop's story and mission..."
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-blue-600 px-8 py-6 rounded-xl font-bold w-full md:w-auto">
                {loading ? 'Saving...' : 'Save All Changes'}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="p-6 bg-white/5 border-white/10 rounded-3xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{offer.title}</h4>
                  <p className="text-sm text-gray-500">{offer.discount} Off</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button variant="outline" className="h-full min-h-[100px] border-dashed border-white/10 rounded-3xl flex flex-col gap-2 hover:bg-white/5">
              <Plus className="w-6 h-6" />
              <span>Add New Offer</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {gallery.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="ghost" className="text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {!img.validated && (
                    <Button size="icon" variant="ghost" className="text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" className="aspect-square rounded-2xl border-dashed border-white/10 flex flex-col gap-2 hover:bg-white/5">
              <Plus className="w-6 h-6" />
              <span className="text-xs">Upload</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">AI Usage</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium">{u.displayName || 'Anonymous'}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{u.aiUsageCount || 0}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {u.createdAt ? new Date(u.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
