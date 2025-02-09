
import BlogCard from "@/components/BlogCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
  category?: string;
}

const Index = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blogs:', error);
          toast({
            title: "Error",
            description: "Failed to load blogs. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        setBlogs(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load blogs. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-blog-title mb-12 text-center sm:text-left">Latest Posts</h1>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs posted yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id.toString()}
              title={blog.title}
              description={blog.content}
              date={blog.date}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
