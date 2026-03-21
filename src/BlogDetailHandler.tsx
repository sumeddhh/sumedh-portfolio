import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import DynamicBlogRenderer from './DynamicBlogRenderer';
import Preloader from './components/Preloader';

interface BlogDetailHandlerProps {
  slug: string;
}

export default function BlogDetailHandler({ slug }: BlogDetailHandlerProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (error || (!loading && !post)) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">404: Not Found</h1>
          <p className="text-white/60 mb-8">The blog entry you are looking for has been moved or does not exist.</p>
          <a href="/blog" className="px-8 py-3 rounded-full bg-[#B9FF2C] text-black font-bold">Back to Blog</a>
        </div>
      </div>
    );
  }

  if (loading || !animationComplete) {
    return (
      <Preloader 
        line1="GETTING_BLOG_ENTRY..."
        line2={`FETCHING: ${slug}`}
        line3="SYNTHESIZING CONTENT..."
        bypassSessionStorage={true}
        onComplete={() => setAnimationComplete(true)}
      />
    );
  }

  return <DynamicBlogRenderer post={post} />;
}
