import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { API_URL } from '../config'; // Imported API_URL

// === CIRCULAR PROGRESS COMPONENT ===
const CircleProgress = ({ percentage, color, size = 120, strokeWidth = 6, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* SVG Ring */}
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Percentage Badge */}
      <div 
        className="absolute -bottom-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg z-20 border border-white/10"
        style={{ backgroundColor: color, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {percentage}%
      </div>

      {/* Inner Content (Image) */}
      <div className="relative z-10 w-1/2 h-1/2 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// === MAIN SKILLS COMPONENT ===
const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define the fixed order for categories
  const categoryOrder = [
    "Programming Language",
    "Markup/Styling",
    "Database",
    "Library/Framework",
    "Technology",
    "Platform",
    "Tool",
    "Other"
  ];

  useEffect(() => {
    // UPDATED: Used API_URL
    fetch(`${API_URL}/api/skills`)
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to load skills", err));
  }, []);

  // Group skills by type
  const groupedSkills = skills.reduce((acc, skill) => {
    (acc[skill.type] = acc[skill.type] || []).push(skill);
    return acc;
  }, {});

  const getProgressColor = (percent) => {
    if (percent >= 90) return '#00E0A7'; 
    if (percent >= 70) return '#3B82F6'; 
    if (percent >= 50) return '#A855F7'; 
    return '#6B7280'; 
  };

  const getExpertiseStyle = (percent) => {
    if (percent >= 90) return 'border-primary shadow-[0_0_20px_rgba(0,224,167,0.15)] hover:shadow-[0_0_30px_rgba(0,224,167,0.3)]'; 
    if (percent >= 70) return 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'; 
    if (percent >= 50) return 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]'; 
    return 'border-gray-500 shadow-none'; 
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-10 px-4">
      
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-white">
          My <span className="text-primary">Skills</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto font-body">
          A visual breakdown of my technological expertise.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-text-muted animate-pulse">Loading skills...</div>
      ) : (
        <div className="space-y-20">
          {/* Map through the FIXED category order */}
          {categoryOrder.map((type) => {
            const typeSkills = groupedSkills[type];
            
            // Only render this category if it exists and has skills
            if (!typeSkills || typeSkills.length === 0) return null;

            return (
              <div key={type} className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                
                {/* Category Title */}
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-4xl font-bold text-white font-heading">{type}s</h2>
                  <div className="h-[8px] bg-white/10 flex-grow"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {typeSkills.map((skill) => (
                    <GlassCard 
                      key={skill.id} 
                      className={`
                        relative flex flex-col items-center justify-center py-8 px-6 gap-6 group overflow-hidden bg-white/5 transition-all duration-300
                        border-b-4 ${getExpertiseStyle(skill.percentage)} hover:-translate-y-2
                      `}
                    >
                      
                      {/* 1. Skill Name */}
                      <h3 className="font-bold text-white font-heading text-2xl tracking-wide text-center z-10">
                          {skill.name}
                      </h3>

                      {/* 2. Circular Progress (Image always colored now) */}
                      <div className="relative group-hover:scale-105 transition-transform duration-500">
                        <CircleProgress 
                          percentage={skill.percentage} 
                          color={getProgressColor(skill.percentage)}
                          size={110} 
                        >
                          <img 
                            src={skill.image} 
                            alt={skill.name} 
                            // Removed 'grayscale' and 'group-hover:grayscale-0'
                            className="w-14 h-14 object-contain drop-shadow-md transition-all duration-500" 
                          />
                        </CircleProgress>
                      </div>

                      {/* 3. Description Overlay */}
                      {skill.description && (
                          <div className="absolute inset-0 bg-black/95 flex items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20">
                              <div>
                                  <h4 className="text-primary font-bold mb-2 text-sm uppercase tracking-wider">{skill.name}</h4>
                                  <p className="text-sm text-white/80 font-body leading-relaxed">{skill.description}</p>
                              </div>
                          </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Skills;