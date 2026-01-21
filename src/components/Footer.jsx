import React, { useState, useEffect } from 'react';
import { API_URL } from '../config'; // Import API_URL

const Footer = () => {
  const [profile, setProfile] = useState(null);

  // Fetch Social Links from Database
  useEffect(() => {
    // UPDATED: Used API_URL
    fetch(`${API_URL}/api/profile`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Failed to load footer links", err));
  }, []);

  // Helper for Social Icons
  const SocialIcon = ({ link, icon, hoverColor }) => {
    if (!link) return null;
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noreferrer" 
        className={`
          w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg text-text-muted 
          transition-all duration-300 border border-white/5
          hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
          ${hoverColor}
        `}
      >
        <i className={icon}></i>
      </a>
    );
  };

  return (
    <footer className="w-full bg-black/20 backdrop-blur-xl border-t border-white/10 py-12 mt-20 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-[90%] mx-auto flex flex-col items-center gap-8 text-center relative z-10">
        
        {/* Logo/Name */}
        <h2 className="text-3xl font-heading font-bold text-white tracking-tight">
          Sakil <span className="text-primary">Ahmed</span>
        </h2>

        {/* Dynamic Social Icons */}
        <div className="flex flex-wrap justify-center gap-4">
          {profile ? (
            <>
              <SocialIcon link={profile.github} icon="ri-github-fill" hoverColor="hover:text-white" />
              <SocialIcon link={profile.linkedin} icon="ri-linkedin-fill" hoverColor="hover:text-blue-400" />
              <SocialIcon link={profile.twitter} icon="ri-twitter-x-line" hoverColor="hover:text-white" />
              <SocialIcon link={profile.facebook} icon="ri-facebook-circle-fill" hoverColor="hover:text-blue-600" />
              <SocialIcon link={profile.instagram} icon="ri-instagram-line" hoverColor="hover:text-pink-500" />
              <SocialIcon link={profile.whatsapp} icon="ri-whatsapp-line" hoverColor="hover:text-green-500" />
              <SocialIcon link={profile.telegram} icon="ri-telegram-fill" hoverColor="hover:text-blue-400" />
            </>
          ) : (
            // Skeleton / Loading state
            <div className="flex gap-2 opacity-50">
               <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
               <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
               <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="space-y-1">
            <p className="text-text-muted text-sm font-body">
            © {new Date().getFullYear()} Sakil Ahmed. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;