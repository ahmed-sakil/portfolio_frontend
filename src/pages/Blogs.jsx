import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { API_URL } from '../config'; // Imported API_URL

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED: Used API_URL
    fetch(`${API_URL}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-10 px-4 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-white">
          My <span className="text-primary">Thoughts</span>
        </h1>
        <p className="text-text-muted text-lg mt-4">Insights, tutorials, and updates.</p>
      </div>

      {loading ? (
        <div className="text-white text-center">Loading posts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <GlassCard key={blog.id} className="p-0 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col h-full bg-white/5 border-white/5">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={blog.imageUrl || "https://via.placeholder.com/400x200"} 
                  alt={blog.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-white mb-3 font-heading line-clamp-2">{blog.title}</h2>
                <p className="text-text-muted text-sm mb-4 line-clamp-3 flex-grow font-body">
                  {blog.summary || "No summary available."}
                </p>
                <Link 
                  to={`/blogs/${blog.id}`} 
                  className="mt-auto px-4 py-2 border border-primary text-primary text-center rounded-lg hover:bg-primary hover:text-bg transition font-bold"
                >
                  Read More
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;