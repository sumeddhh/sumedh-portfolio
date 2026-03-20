
export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
  excerpt?: string;
}

const STORAGE_KEY = 'sb_portfolio_dynamic_blogs';

export const getDynamicBlogs = (): BlogPost[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveDynamicBlog = (blog: BlogPost) => {
  const blogs = getDynamicBlogs();
  const updated = [blog, ...blogs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};
