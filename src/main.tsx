import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SoftwareDevelopmentNepalPage from './SoftwareDevelopmentNepalPage.tsx'
import BlogListPage from './BlogListPage.tsx'
import AiGuardrailsFrontend from './blogs/AiGuardrailsFrontend.tsx'
import { NavigationShell } from './components/Navigation.tsx'
import BlogDetailHandler from './BlogDetailHandler.tsx'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'

let page;
let isBlog = false;

if (normalizedPath === '/blog') {
  page = <BlogListPage />;
  isBlog = true;
} else if (normalizedPath === '/blog/software-development-nepal') {
  page = <SoftwareDevelopmentNepalPage />;
  isBlog = true;
} else if (normalizedPath === '/blog/ai-guardrails-on-frontend') {
  page = <AiGuardrailsFrontend />;
  isBlog = true;
} else if (normalizedPath.startsWith('/blog/')) {
  const slug = normalizedPath.replace('/blog/', '');
  page = <BlogDetailHandler slug={slug} />;
  isBlog = true;
} else if (normalizedPath === '/software-development-nepal') {
  // Graceful redirect
  window.history.replaceState(null, '', '/blog/software-development-nepal');
  page = <SoftwareDevelopmentNepalPage />;
  isBlog = true;
} else {
  page = <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavigationShell isBlogPage={isBlog}>
      {page}
    </NavigationShell>
  </StrictMode>,
)
