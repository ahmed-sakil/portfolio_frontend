import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { API_URL } from '../config'; // Imported API_URL

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentData, setCommentData] = useState({ email: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Blog & Comments
  const fetchBlog = () => {
    // UPDATED: Used API_URL
    fetch(`${API_URL}/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => setBlog(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // Handle Comment Submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // UPDATED: Used API_URL
      const res = await fetch(`${API_URL}/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      if (res.ok) {
        setCommentData({ email: '', text: '' }); // Reset form
        fetchBlog(); // Refresh comments
      }
    } catch (error) {
      console.error("Comment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!blog) return <div className="text-white text-center pt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-10 px-4">
      {/* Back Button */}
      <Link to="/blogs" className="text-primary hover:underline mb-6 inline-block font-body">
        &larr; Back to Blogs
      </Link>

      {/* Main Content */}
      <GlassCard className="p-8 md:p-12 mb-12 bg-white/5">
        <img 
          src={blog.imageUrl || "https://via.placeholder.com/800x400"} 
          alt={blog.title} 
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-8 shadow-2xl"
        />
        <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6">{blog.title}</h1>
        <div className="text-text-muted text-sm mb-8 font-mono border-l-2 border-primary pl-4">
          Published on {new Date(blog.createdAt).toLocaleDateString()}
        </div>
        
        {/* Blog Body (Rendering HTML or Text) */}
        <div className="prose prose-invert max-w-none text-text-muted/90 font-body leading-relaxed whitespace-pre-line">
          {blog.content}
        </div>
      </GlassCard>

      {/* === COMMENTS SECTION === */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6 font-heading">
          Comments ({blog.comments?.length || 0})
        </h3>

        {/* Comment Form */}
        <GlassCard className="p-6 mb-10 bg-white/5 border-white/10">
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Your Email" 
              required
              className="p-3 rounded-lg bg-bg border border-white/10 text-white focus:border-primary focus:outline-none"
              value={commentData.email}
              onChange={(e) => setCommentData({...commentData, email: e.target.value})}
            />
            <textarea 
              placeholder="Leave a comment..." 
              required
              rows="3"
              className="p-3 rounded-lg bg-bg border border-white/10 text-white focus:border-primary focus:outline-none"
              value={commentData.text}
              onChange={(e) => setCommentData({...commentData, text: e.target.value})}
            ></textarea>
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-primary text-bg font-bold py-2 rounded-lg hover:bg-white transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </GlassCard>

        {/* Comment List */}
        <div className="space-y-4">
          {blog.comments && blog.comments.map(comment => (
            <div key={comment.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-primary font-bold text-sm">{comment.email}</span>
                <span className="text-xs text-text-muted">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-white/80 text-sm">{comment.text}</p>
            </div>
          ))}
          {(!blog.comments || blog.comments.length === 0) && (
            <p className="text-text-muted text-center italic">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;