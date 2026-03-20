export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  category: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'software-development-nepal',
    title: 'Software Development in Nepal: Trends, Skills, and What Businesses Should Look For',
    excerpt: 'The evolving landscape of the technology ecosystem in Nepal, from low-complexity outsourcing to product-grade engineering excellence.',
    date: 'Feb 18, 2026',
    read_time: '12 Min Read',
    category: 'Editorial Insight',
    image: '/blog_nepal_dev.png'
  },
  {
    slug: 'ai-guardrails-on-frontend',
    title: 'AI Guardrails on Frontend: Securing the Client Layer',
    excerpt: 'How the frontend can sanitize inputs, manage LLM responses, and place critical guardrails on the application client layer for safer AI interactions.',
    date: 'March 21, 2026',
    read_time: '8 Min Read',
    category: 'AI & Security',
    image: '/blog_ai_guardrails.png'
  }
];
