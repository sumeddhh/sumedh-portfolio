import { useEffect, useState, useRef, type CSSProperties } from 'react';
import { CalendarDays, Clock3, ArrowRight, Plus, Terminal, X, Lock, Trash2, Edit3, Search } from 'lucide-react';
import { BLOG_POSTS, type BlogPost as BlogPostStatic } from './lib/blog-data';
import { supabase } from './lib/supabase';
import { slugify, type BlogPost } from './lib/blog-utils';
import Preloader from './components/Preloader';

const pickDefaultBlogImage = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const imageNumber = (Math.abs(hash) % 8) + 1;
  return `/blog_img_${imageNumber}.png`;
};

export default function BlogListPage() {
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mobile Dev Mode Trigger String
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMobileDevTrigger = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      setDevMode(d => !d);
      setClickCount(0);
    }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
  };

  // Blog Form State
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [allPosts, setAllPosts] = useState<(BlogPostStatic | BlogPost)[]>([]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setAllPosts([...data.map(p => ({ ...p, isDynamic: true })), ...BLOG_POSTS]);
    } else {
      setAllPosts(BLOG_POSTS);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.title = 'Blog | Sumedh Bajracharya | Engineering & AI Insights';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Synthesized thoughts on software engineering, AI guardrails, and product architecture by Sumedh Bajracharya.");
    }
    window.scrollTo(0, 0);
    const fetchTimer = window.setTimeout(() => {
      void fetchPosts();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'd') {
        setDevMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(fetchTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const expected = `${mm}${dd}_blog`;

    if (password === expected) {
      setIsAuthenticated(true);
      setShowAuth(false);
      setShowCompose(true);
      setError('');
    } else {
      setError('Invalid developer key');
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const blogData: Omit<BlogPost, 'id'> = {
      title,
      slug: slugify(title),
      content,
      category,
      date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
      read_time: `${Math.ceil(content.split(' ').length / 200)} Min Read`,
    };

    if (!editingPostId) {
      blogData.image = pickDefaultBlogImage(blogData.slug);
    }

    let result;
    if (editingPostId) {
      result = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', editingPostId)
        .select();
    } else {
      result = await supabase
        .from('blogs')
        .insert([blogData])
        .select();
    }

    if (!result.error && result.data && result.data.length > 0) {
      fetchPosts();
      setShowCompose(false);
      resetForm();
    } else {
      console.error('Supabase Error:', result.error);
      alert('Failed to save: ' + (result.error?.message || 'Update didn\'t apply. Check if the ID exists.'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (!error) {
      setAllPosts(prev => prev.filter(p => !('id' in p) || p.id !== id));
    } else {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPostId(post.id!);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setShowCompose(true);
  };

  const resetForm = () => {
    setEditingPostId(null);
    setTitle('');
    setContent('');
    setCategory('Engineering');
  };

  const categories = ['All', ...Array.from(new Set(allPosts.map(p => p.category)))];
  
  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ('content' in post && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading || !animationComplete) {
    return (
      <Preloader 
        line1="LINKING_TO_DATABASE..."
        line2="FETCHING_GRID_RESOURCES"
        line3="PARSING_ARTICLE_METADATA"
        bypassSessionStorage={true}
        onComplete={() => setAnimationComplete(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-clip">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Dev Mode Button */}
      {devMode && (
        <button
          onClick={() => isAuthenticated ? setShowCompose(true) : setShowAuth(true)}
          className="fixed top-24 right-8 z-[2000] px-6 py-3 bg-[#B9FF2C] text-black font-bold rounded-full flex items-center gap-2 shadow-lg shadow-[#B9FF2C]/20 hover:scale-105 transition-transform animate-in fade-in slide-in-from-right-4"
        >
          <Plus size={18} />
          {isAuthenticated ? 'New Blog' : 'Start Session'}
        </button>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-[#B9FF2C]">
                <Lock size={20} />
                <h2 className="font-display text-xl font-bold">Developer Access</h2>
              </div>
              <button onClick={() => setShowAuth(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Access Key</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="MMDD_blog"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B9FF2C]/50 transition-colors"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
              <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors mt-2">
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Compose/Edit Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-[#B9FF2C]">
                <Terminal size={20} />
                <h2 className="font-display text-2xl font-bold text-white">{editingPostId ? 'Edit Post' : 'Compound New Post'}</h2>
              </div>
              <button onClick={() => { setShowCompose(false); resetForm(); }} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="UI in Nepal"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B9FF2C]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-[14px] text-white focus:outline-none focus:border-[#B9FF2C]/50 appearance-none cursor-pointer"
                  >
                    <option value="Engineering" className="bg-[#111]">Engineering</option>
                    <option value="Editorial Insight" className="bg-[#111]">Editorial Insight</option>
                    <option value="AI & Security" className="bg-[#111]">AI & Security</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Markdown Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Hello World..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B9FF2C]/50 h-[300px] font-mono text-sm leading-relaxed"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#B9FF2C] text-black font-bold py-4 rounded-lg hover:scale-[1.01] transition-transform">
                {editingPostId ? 'Save Changes' : 'Publish Blog Post'}
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-20">
            <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tight mb-8">
              Letters on <span onClick={handleMobileDevTrigger} className="text-[#B9FF2C] cursor-pointer selection:bg-transparent uppercase">Code</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              Synthesized thoughts on software engineering, product architecture, and the intersection of human and machine intelligence.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#B9FF2C] transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search articles, topics, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#B9FF2C]/50 transition-all placeholder:text-white/20"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                    selectedCategory === cat 
                      ? 'bg-[#B9FF2C] text-black border-[#B9FF2C] shadow-[0_0_15px_rgba(178,247,34,0.3)]' 
                      : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 relative pb-20">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div
                  key={post.slug}
                  className="sticky md:static px-4 md:px-0 md:pt-0 h-full"
                  style={{
                    top: `calc(100px + ${index * 40}px)`,
                    zIndex: index + 10,
                  }}
                >
                  <div
                    className="blog-stack-wrapper h-full"
                    style={{ '--card-scale': 0.9 + (index * 0.02) } as CSSProperties & Record<'--card-scale', number>}
                  >
                    <BlogCard
                      post={post}
                      isAuthenticated={isAuthenticated}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-12 py-20 text-center">
                <Terminal size={48} className="mx-auto text-white/10 mb-6" />
                <p className="font-mono text-white/40 uppercase tracking-[0.2em]">No matching entries found in the local grid.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-6 text-[#B9FF2C] font-mono text-xs uppercase tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            © Sumedh Bajracharya — {new Date().getFullYear()}
          </p>
          <div className="flex gap-8">
            <a href="https://np.linkedin.com/in/sumedh-bajracharya" target="_blank" className="font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-[#B9FF2C]">LinkedIn</a>
            <a href="mailto:sumedhbajracharya07@gmail.com" className="font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-[#B9FF2C]">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BlogCard({
  post,
  isAuthenticated,
  onDelete,
  onEdit
}: {
  post: BlogPostStatic | BlogPost;
  isAuthenticated: boolean;
  onDelete: (id: number) => void;
  onEdit: (post: BlogPost) => void;
}) {
  const isDynamic = 'id' in post;

  return (
    <div className="group relative block rounded-[32px] overflow-hidden bg-[#111] border border-white/10 transition-all duration-500 hover:border-[#B9FF2C]/30 h-full">
      {/* Dev Actions Overlay */}
      {isAuthenticated && isDynamic && (
        <div className="absolute top-6 right-6 z-[50] flex gap-2">
          <button
            onClick={() => onEdit(post as BlogPost)}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-[#B9FF2C] hover:border-[#B9FF2C]/40 transition-all shadow-lg"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete((post as BlogPost).id!)}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-400/40 transition-all shadow-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <a href={`/blog/${post.slug}`} className="flex flex-col h-full min-h-[480px]">
        <div className="aspect-[16/9] overflow-hidden relative bg-[#1a1a1a] flex-shrink-0">
          {'image' in post && post.image ? (
            <img
              src={post.image as string}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover img-mono group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#B9FF2C]/20 via-black to-black flex items-center justify-center p-12">
              <Terminal size={48} className="text-[#B9FF2C]/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

          <div className="absolute top-6 left-6 z-10">
            <span className="px-3 py-1.5 rounded-full border border-[#B9FF2C]/30 bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#B9FF2C] uppercase tracking-widest">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 font-mono text-[9px] uppercase tracking-widest text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={10} />
              {post.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={10} />
              {post.read_time}
            </span>
          </div>

          <h3 className="font-display text-lg md:text-xl font-bold mb-3 group-hover:text-[#B9FF2C] transition-colors leading-tight line-clamp-2">
            {post.title}
          </h3>

          <p className="text-white/60 text-xs line-clamp-3 mb-6 leading-relaxed">
            {'excerpt' in post && post.excerpt ? post.excerpt : ('content' in post ? post.content.replace(/[#*`]/g, '').slice(0, 120) + '...' : '')}
          </p>

          <div className="mt-auto flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white font-semibold group-hover:gap-4 transition-all duration-300">
            Read Post <ArrowRight size={14} className="text-[#B9FF2C]" />
          </div>
        </div>
      </a>

      {/* Decorative focus border on hover */}
      <div className={`absolute inset-0 border-2 border-[#B9FF2C]/0 group-hover:border-[#B9FF2C]/20 rounded-[32px] pointer-events-none transition-all duration-500`} />
    </div>
  );
}
