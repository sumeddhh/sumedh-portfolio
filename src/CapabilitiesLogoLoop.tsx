import LogoLoop from './LogoLoop';
import {
  SiAmazonwebservices,
  SiDocker,
  SiFigma,
  SiGraphql,
  SiMongodb,
  SiNestjs,
  SiNodedotjs,
  SiNextdotjs,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiRedis,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';

export default function CapabilitiesLogoLoop() {
  return (
    <LogoLoop
      logos={[
        { node: <SiReact />, title: 'React' },
        { node: <SiNextdotjs />, title: 'Next.js' },
        { node: <SiTypescript />, title: 'TypeScript' },
        { node: <SiTailwindcss />, title: 'Tailwind CSS' },
        { node: <SiVuedotjs />, title: 'Vue.js' },
        { node: <SiRedux />, title: 'Redux' },
        { node: <SiNodedotjs />, title: 'Node.js' },
        { node: <SiNestjs />, title: 'Nest.js' },
        { node: <SiPostgresql />, title: 'PostgreSQL' },
        { node: <SiMongodb />, title: 'MongoDB' },
        { node: <SiRedis />, title: 'Redis' },
        { node: <SiGraphql />, title: 'GraphQL' },
        { node: <SiDocker />, title: 'Docker' },
        { node: <SiAmazonwebservices />, title: 'AWS' },
        { node: <SiFigma />, title: 'Figma' },
        { node: <SiPostman />, title: 'Postman' },
      ]}
      speed={60}
      gap={80}
      logoHeight={42}
      direction="left"
      fadeOut
      fadeOutColor="#050505"
      className="text-white/20 hover:text-[#B9FF2C] transition-colors duration-500"
    />
  );
}
