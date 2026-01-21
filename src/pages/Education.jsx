import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { API_URL } from '../config'; // Imported API_URL

const Education = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED: Used API_URL
    fetch(`${API_URL}/api/education`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEducationList(data);
        } else {
          setEducationList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load education", err);
        setLoading(false);
      });
  }, []);

  // Helper to format dates (e.g., "Jan 2020")
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-10">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-white">
          My <span className="text-primary">Journey</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto font-body">
          Academic background, certifications, and professional qualifications.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative border-l-2 border-white/10 ml-4 md:ml-10 space-y-12">
        
        {loading ? (
           <div className="pl-8 text-text-muted">Loading history...</div>
        ) : (
          educationList.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-bg border-2 border-primary shadow-[0_0_10px_rgba(0,224,167,0.5)]"></div>

              {/* Content Card */}
              <GlassCard className="p-8 border-white/5 hover:border-primary/20 transition-all group">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <h3 className="text-2xl font-bold text-white font-heading group-hover:text-primary transition-colors">
                    {item.institution}
                  </h3>
                  
                  <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit">
                    {formatDate(item.startDate)} — {formatDate(item.endDate)}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-text mb-3">
                  {item.degree}
                </h4>

                <p className="text-text-muted leading-relaxed">
                  {item.description}
                </p>

              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Education;