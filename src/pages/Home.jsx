import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { API_URL } from '../config';

// === CIRCULAR PROGRESS COMPONENT ===
const CircleProgress = ({ percentage, color, size = 120, strokeWidth = 6, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth={strokeWidth} fill="transparent" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute -bottom-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg z-20 border border-white/10" style={{ backgroundColor: color, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {percentage}%
      </div>
      <div className="relative z-10 w-1/2 h-1/2 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [featuredSkills, setFeaturedSkills] = useState([]); 
  const [profile, setProfile] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, expRes, skillRes, profileRes] = await Promise.all([
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/experience`),
          fetch(`${API_URL}/api/skills`),
          fetch(`${API_URL}/api/profile`) 
        ]);
        
        const projData = await projRes.json();
        const expData = await expRes.json();
        const skillData = await skillRes.json();
        const profileData = await profileRes.json();

        setFeaturedProjects(projData.filter(item => item.isFeatured));
        setFeaturedSkills(skillData.filter(item => item.isFeatured));
        setExperience(expData);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const sectionGlassStyle = "bg-bg/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-12 shadow-xl";

  const HeroSocialIcon = ({ link, icon, color }) => {
    if (!link) return null;
    return (
      <a href={link} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-text-muted transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:scale-110 ${color}`}>
        <i className={icon}></i>
      </a>
    );
  };

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
    <div className="max-w-[90%] mx-auto flex flex-col gap-24 pb-20 font-body">
      
      {/* ================= HERO SECTION ================= */}
      <section id="home" className="min-h-[85vh] flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 pt-10">
        <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 items-center w-full">
          <div className="flex flex-row md:flex-col gap-6">
            {profile && (
              <>
                <HeroSocialIcon link={profile.github} icon="ri-github-fill" color="hover:text-white" />
                <HeroSocialIcon link={profile.linkedin} icon="ri-linkedin-fill" color="hover:text-blue-400" />
                <HeroSocialIcon link={profile.facebook} icon="ri-facebook-circle-fill" color="hover:text-blue-600" />
                <HeroSocialIcon link={profile.twitter} icon="ri-twitter-x-line" color="hover:text-white" />
              </>
            )}
          </div>
          <div className="w-full h-[1px] md:w-[1px] md:h-64 bg-white/10"></div>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-4xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-4">
              <span className="text-primary">Sakil Ahmed</span>
            </h1>
            <h3 className="font-heading text-lg md:text-2xl font-medium text-text-muted mt-4">
              Software Engineer & Web Developer
            </h3>
            <p className="text-text-muted text-base md:text-lg mt-6 max-w-2xl leading-relaxed font-body">
              A highly skilled developer converting ideas into efficient code. Expertise in JavaScript, Node.js, and Competitive Programming. Available 24/7 to bring your digital vision to life.
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center md:justify-start">
              <Link to="/contact" className="px-8 py-3 bg-primary text-bg font-bold font-heading rounded-xl hover:bg-white transition shadow-[0_0_20px_rgba(0,224,167,0.4)]">Say Hello!</Link>
              <a href="/resume.pdf" download className="px-8 py-3 border border-primary text-primary font-bold font-heading rounded-xl hover:bg-primary hover:text-bg transition flex items-center justify-center gap-2">See CV <i className="ri-download-line"></i></a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-8 md:gap-12 mt-12">
              <div><h3 className="text-2xl md:text-3xl font-bold font-heading text-white">1 Y.</h3><p className="text-text-muted text-xs md:text-sm uppercase tracking-wider font-body">Experience</p></div>
              <div className="w-[1px] h-10 bg-white/20"></div> 
              <div><h3 className="text-2xl md:text-3xl font-bold font-heading text-white">10+</h3><p className="text-text-muted text-xs md:text-sm uppercase tracking-wider font-body">Projects</p></div>
              <div className="w-[1px] h-10 bg-white/20"></div> 
              <div><h3 className="text-2xl md:text-3xl font-bold font-heading text-white">24/7</h3><p className="text-text-muted text-xs md:text-sm uppercase tracking-wider font-body">Support</p></div>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative w-full md:w-auto flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-primary blur-[100px] opacity-20 rounded-full"></div>
          <img src="/img/sakil.png" alt="Sakil" className="relative z-10 w-auto max-h-[300px] md:max-h-[500px] object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition duration-500" />
        </motion.div>
      </section>

      {/* ================= EXPERIENCE SECTION ================= */}
      <section id="experience" className={sectionGlassStyle}>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">Work Experience</h2>
        <span className="text-primary block mb-10 font-body">My professional journey</span>
        <div className="grid gap-6">
          {experience.length > 0 ? (
            experience.map((exp) => (
              <GlassCard key={exp.id} className="hover:-translate-y-1 transition duration-300 border-l-4 border-l-primary bg-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold font-heading text-white">{exp.role}</h3>
                  <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg font-mono">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                </div>
                <h4 className="text-lg text-text-muted mb-4 font-body">{exp.company}</h4>
                <p className="text-text-muted/80">{exp.description}</p>
              </GlassCard>
            ))
          ) : (<div className="text-text-muted italic">Loading experience...</div>)}
        </div>
      </section>

      {/* ================= SKILLS SECTION (FEATURED ONLY) ================= */}
      <section id="skills" className={sectionGlassStyle}>
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div><h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">Top Skills</h2><span className="text-primary font-body">Featured technologies</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSkills.map((skill) => (
            <GlassCard key={skill.id} className={`relative flex flex-col items-center justify-center py-8 px-6 gap-6 group overflow-hidden bg-white/5 transition-all duration-300 border-b-4 ${getExpertiseStyle(skill.percentage)} hover:-translate-y-2`}>
              <h3 className="font-bold text-white font-heading text-2xl tracking-wide text-center z-10">{skill.name}</h3>
              <div className="relative group-hover:scale-105 transition-transform duration-500">
                <CircleProgress percentage={skill.percentage} color={getProgressColor(skill.percentage)} size={110}>
                  <img src={skill.image} alt={skill.name} className="w-14 h-14 object-contain drop-shadow-md transition-all duration-500" />
                </CircleProgress>
              </div>
              {skill.description && (
                  <div className="absolute inset-0 bg-black/95 flex items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20">
                      <div><h4 className="text-primary font-bold mb-2 text-sm uppercase tracking-wider">{skill.name}</h4><p className="text-sm text-white/80 font-body leading-relaxed">{skill.description}</p></div>
                  </div>
              )}
            </GlassCard>
          ))}
          {featuredSkills.length === 0 && (
            <div className="col-span-full text-center text-text-muted py-10 border border-white/5 rounded-xl bg-white/5">
              <p>No featured skills selected yet.</p>
              <p className="text-sm mt-2 opacity-50">Go to Admin Dashboard to feature skills here.</p>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-12">
            <Link to="/skills" className="px-8 py-3 border border-primary text-primary rounded-full hover:bg-primary hover:text-bg transition font-bold font-heading flex items-center">View All Skills <i className="ri-arrow-right-line ml-2"></i></Link>
        </div>
      </section>

      {/* ================= PROJECTS SECTION (FEATURED ONLY) ================= */}
      <section id="projects" className={sectionGlassStyle}>
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">Featured Projects</h2>
        <span className="text-primary block mb-10 font-body">Selected highlights of my work</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {featuredProjects.map((project) => (
            <GlassCard key={project.id} className="p-0 overflow-hidden group border-white/5 hover:border-primary/50 transition duration-300 bg-white/5 flex flex-col h-full">
              <div className="w-full aspect-video overflow-hidden relative border-b border-white/5">
                <img src={project.imageUrl || "/img/project3.jpg"} alt={project.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition font-heading">{project.title}</h3>
                <p className="text-text-muted text-base mb-6 line-clamp-3 font-body flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.split(',').map((tag, i) => (
                    <span key={i} className="text-xs bg-white/5 text-text-muted px-3 py-1 rounded-full border border-white/5 font-mono">{tag.trim()}</span>
                  ))}
                </div>
                <div className="flex gap-4 mt-auto">
                    {project.repoLink && (<a href={project.repoLink} target="_blank" rel="noreferrer" className="flex-1 py-3 rounded-lg border border-white/10 flex items-center justify-center gap-2 hover:bg-white hover:text-bg transition font-bold text-sm"><i className="ri-github-fill text-lg"></i> Code</a>)}
                    {project.liveLink && (<a href={project.liveLink} target="_blank" rel="noreferrer" className="flex-1 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition font-bold text-sm"><i className="ri-eye-line text-lg"></i> Demo</a>)}
                </div>
              </div>
            </GlassCard>
          ))}
          {featuredProjects.length === 0 && (
             <div className="col-span-full text-center text-text-muted py-10 border border-white/5 rounded-xl bg-white/5">
                <p>No featured projects selected yet.</p>
                <p className="text-sm mt-2 opacity-50">Go to Admin Dashboard to feature projects here.</p>
             </div>
          )}
        </div>
        <div className="flex justify-center mt-12">
            <Link to="/projects" className="px-8 py-3 border border-primary text-primary rounded-full hover:bg-primary hover:text-bg transition font-bold font-heading flex items-center">View All Projects <i className="ri-arrow-right-line ml-2"></i></Link>
        </div>
      </section>

    </div>
  );
};

export default Home;