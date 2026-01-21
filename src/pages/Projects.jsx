import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { API_URL } from '../config';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED: Used API_URL
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            // Sort by Priority (Highest first), but no visual indicator shown
            const sortedData = data.sort((a, b) => (b.priority || 0) - (a.priority || 0));
            setProjects(sortedData);
        } else {
            console.error("API did not return an array:", data);
            setProjects([]);
        }
        setLoading(false);
      })
      .catch((err) => {
          console.error("Failed to load projects", err);
          setLoading(false);
      });
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-[90%] md:max-w-6xl mx-auto pb-20 pt-10">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-white">
          All <span className="text-primary">Projects</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto font-body">
          A collection of my work, ranging from full-stack applications to experimental UI designs.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center text-text-muted animate-pulse">Loading projects...</div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <GlassCard className="h-full flex flex-col overflow-hidden border-white/5 hover:border-primary/30 transition-colors group p-0">
                
                {/* Image Section */}
                <div className="h-48 overflow-hidden relative bg-black/20">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  
                  {project.imageUrl ? (
                    <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <i className="ri-image-line text-4xl"></i>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-20">
                     {/* Category Badge Only */}
                     <span className="bg-bg/80 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20 shadow-lg">
                        {project.category || 'Project'}
                     </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white font-heading mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-text-muted text-sm mb-6 flex-grow leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack ? (
                        project.techStack.split(',').map((tech, i) => (
                        <span key={i} className="text-xs text-text-muted/80 px-2 py-1 rounded bg-white/5 border border-white/5 font-mono">
                            {tech.trim()} 
                        </span>
                        ))
                    ) : (
                        <span className="text-xs text-text-muted">No tech stack listed</span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-auto">
                    {project.repoLink && (
                        <a href={project.repoLink} target="_blank" rel="noreferrer" 
                           className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition font-medium text-sm">
                            <i className="ri-github-fill text-lg"></i> Code
                        </a>
                    )}
                    {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noreferrer"
                           className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition font-medium text-sm">
                            <i className="ri-external-link-line text-lg"></i> Live Demo
                        </a>
                    )}
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Projects;