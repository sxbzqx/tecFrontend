export interface Post {
  id: number;
  name: string;
  title: string;
  content: string;
  createdAt: string;
  categoryId: number; 
  category?: {          
    id: number;
    name: string;
    color: string;
  };
}