
export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  content: string;
  date: string;
  category: string;
  read_time: string;
  image?: string;
  excerpt?: string;
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};
