const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`
      relative 
      backdrop-blur-xl 
      bg-glass-gradient 
      border border-white/10 
      shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
      rounded-3xl 
      p-8 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;