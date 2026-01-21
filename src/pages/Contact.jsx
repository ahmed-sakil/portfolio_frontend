import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { API_URL } from '../config';

const Contact = () => {
  // === 1. FETCH PROFILE DATA ===
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // UPDATED: Used API_URL
    fetch(`${API_URL}/api/profile`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Error fetching profile:", err));
  }, []);

  // === OPTIONS DATA ===
  const inquiryOptions = [
    { id: 'freelance', label: 'Freelance Project', icon: 'ri-briefcase-4-line', type: 'business' },
    { id: 'fulltime', label: 'Full-Time Position', icon: 'ri-rocket-line', type: 'business' },
    { id: 'consultation', label: 'Consultation', icon: 'ri-lightbulb-line', type: 'business' },
    { id: 'collab', label: 'Collaboration', icon: 'ri-shake-hands-line', type: 'general' },
    { id: 'speaking', label: 'Speaking/Workshop', icon: 'ri-mic-line', type: 'general' },
    { id: 'other', label: 'Other Inquiry', icon: 'ri-chat-3-line', type: 'general' },
  ];

  const budgetOptions = ["Less than $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000+", "To be discussed"];
  const timelineOptions = ["ASAP (< 2 weeks)", "1 - 3 Months", "3 - 6 Months", "6+ Months", "Flexible"];

  // === FORM STATE ===
  const [selectedType, setSelectedType] = useState(inquiryOptions[0]); 
  const [formData, setFormData] = useState({ name: '', email: '', company: '', budget: '', timeline: '', content: '' });
  const [status, setStatus] = useState('idle');

  // === HANDLERS ===
  const handleTypeSelect = (option) => {
    setSelectedType(option);
    if (option.type === 'general') setFormData(prev => ({ ...prev, budget: '', timeline: '' }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const payload = { ...formData, inquiryType: selectedType.label };

    try {
      // UPDATED: Used API_URL
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', budget: '', timeline: '', content: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Connection Error:", error);
      setStatus('error');
    }
  };

  // === HELPER COMPONENTS ===
  const InputGroup = ({ label, name, type = "text", placeholder, icon }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-text-muted/80 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-lg">
          <i className={icon}></i>
        </div>
        <input required type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-body placeholder:text-white/20" />
      </div>
    </div>
  );

  const SelectGroup = ({ label, name, options, icon }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-text-muted/80 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-lg z-10"><i className={icon}></i></div>
        <select name={name} value={formData[name]} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-10 text-white focus:border-primary focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
          <option value="" className="bg-gray-900 text-text-muted">Select an option...</option>
          {options.map(opt => <option key={opt} value={opt} className="bg-gray-900 text-white">{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"><i className="ri-arrow-down-s-line"></i></div>
      </div>
    </div>
  );

  // === SOCIAL LINK COMPONENT ===
  const SocialItem = ({ icon, label, link, actionLabel, color = "text-white" }) => {
    if (!link) return null; 
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition group">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-black/20 ${color}`}>
                <i className={icon}></i>
            </div>
            <span className="text-sm font-bold text-text-muted group-hover:text-white transition">{label}</span>
        </div>
        <a href={link} target="_blank" rel="noreferrer" className="text-xs font-bold px-3 py-1.5 rounded-md border border-white/10 text-primary hover:bg-primary hover:text-bg transition">
            {actionLabel}
        </a>
      </div>
    );
  };

  return (
    <div className="max-w-[95%] md:max-w-7xl mx-auto pb-20 pt-10">
      
      {/* HEADER */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-white">
          Let's <span className="text-primary">Collaborate</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto font-body">
          Select a topic below and let's start a conversation.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8 md:gap-12 items-start">
        
        {/* === LEFT COLUMN: INFO === */}
        <div className="space-y-6 flex flex-col h-full">
          
          {/* 1. STATUS CARD (RESTORED) */}
          <GlassCard className="p-8 bg-white/5 border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <i className="ri-time-line text-8xl text-primary"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-6 font-heading">Status</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                  <i className="ri-flashlight-fill"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold">Response Time</h4>
                  <p className="text-text-muted text-sm">Within 24-48 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-xl">
                  <i className="ri-checkbox-circle-fill"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold">Availability</h4>
                  <p className="text-text-muted text-sm">Currently available</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 2. DYNAMIC SOCIALS */}
          <GlassCard className="p-6 bg-white/5 border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
                <i className="ri-links-line text-primary"></i> Connect with me
            </h3>
            
            <div className="space-y-3">
                {profile ? (
                    <>
                        <SocialItem icon="ri-mail-star-line" label="Professional Mail" link={`mailto:${profile.professionalEmail}`} actionLabel="Mail" color="text-orange-400" />
                        <SocialItem icon="ri-graduation-cap-line" label="Student Mail" link={`mailto:${profile.studentEmail}`} actionLabel="Mail" color="text-yellow-400" />
                        <SocialItem icon="ri-phone-line" label="Phone" link={`tel:${profile.contactNumber}`} actionLabel="Call" color="text-green-400" />
                        <SocialItem icon="ri-whatsapp-line" label="WhatsApp" link={profile.whatsapp} actionLabel="Chat" color="text-green-500" />
                        <SocialItem icon="ri-telegram-fill" label="Telegram" link={profile.telegram} actionLabel="Msg" color="text-blue-400" />
                        
                        <div className="h-[1px] bg-white/10 my-4"></div>
                        
                        <SocialItem icon="ri-github-fill" label="GitHub" link={profile.github} actionLabel="View" />
                        <SocialItem icon="ri-linkedin-fill" label="LinkedIn" link={profile.linkedin} actionLabel="View" color="text-blue-500" />
                        <SocialItem icon="ri-twitter-x-line" label="Twitter / X" link={profile.twitter} actionLabel="View" />
                        <SocialItem icon="ri-facebook-circle-fill" label="Facebook" link={profile.facebook} actionLabel="View" color="text-blue-600" />
                        <SocialItem icon="ri-instagram-line" label="Instagram" link={profile.instagram} actionLabel="View" color="text-pink-500" />
                    </>
                ) : (
                    <div className="text-text-muted text-center py-4 text-sm animate-pulse">Loading contact info...</div>
                )}
            </div>
          </GlassCard>

          {/* 3. SERVICES LIST */}
          <GlassCard className="p-8 bg-white/5 border-white/10 flex-grow">
            <h3 className="text-xl font-bold text-white mb-6 font-heading">Services</h3>
            <ul className="space-y-3">
              {["Fullstack Development", "API Design & Integration", "Database Architecture", "WordPress & WooCommerce", "Technical Consulting"].map((service, i) => (
                <li key={i} className="flex items-center gap-3 text-text-muted hover:text-white transition">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {service}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* === RIGHT COLUMN: FORM === */}
        <GlassCard className="p-6 md:p-10 bg-white/5 border-white/10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-white uppercase tracking-wider font-heading">What brings you here? <span className="text-primary">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {inquiryOptions.map((option) => (
                  <button key={option.id} type="button" onClick={() => handleTypeSelect(option)} className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 h-32 ${selectedType?.id === option.id ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,224,167,0.2)]' : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/20'}`}>
                    <i className={`${option.icon} text-3xl ${selectedType?.id === option.id ? 'text-primary' : 'text-text-muted'}`}></i>
                    <span className={`text-sm font-bold leading-tight ${selectedType?.id === option.id ? 'text-white' : 'text-text-muted'}`}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode='wait'>
              {selectedType && (
                <motion.div key={selectedType.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="w-full h-[1px] bg-white/10 my-6"></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="Full Name" name="name" placeholder="John Doe" icon="ri-user-smile-line" />
                    <InputGroup label="Email Address" name="email" type="email" placeholder="john@company.com" icon="ri-mail-line" />
                    <div className="md:col-span-2"><InputGroup label="Company / Organization" name="company" placeholder="Ex. Google, Startup Inc." icon="ri-building-line" /></div>
                  </div>
                  {selectedType.type === 'business' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
                      <SelectGroup label="Budget Range" name="budget" options={budgetOptions} icon="ri-money-dollar-circle-line" />
                      <SelectGroup label="Timeline" name="timeline" options={timelineOptions} icon="ri-calendar-event-line" />
                    </motion.div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted/80 uppercase tracking-wider ml-1">Your Message</label>
                    <div className="relative group">
                        <textarea required name="content" rows="5" value={formData.content} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-white/20" placeholder={selectedType.type === 'business' ? "Tell me about the project goals, tech stack, and what you need help with..." : "How can I help you today?"}></textarea>
                    </div>
                  </div>
                  <button type="submit" disabled={status === 'sending'} className={`w-full py-4 rounded-xl font-bold font-heading text-lg transition flex items-center justify-center gap-2 ${status === 'sending' ? 'bg-white/10 text-text-muted cursor-wait' : 'bg-primary text-bg hover:bg-white hover:shadow-[0_0_20px_rgba(0,224,167,0.4)]'}`}>
                     {status === 'sending' ? <>Sending...</> : <>Send Message <i className="ri-send-plane-fill"></i></>}
                  </button>
                  {status === 'success' && <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-xl text-center font-bold animate-pulse"><i className="ri-checkbox-circle-line mr-2"></i> Message sent successfully!</div>}
                  {status === 'error' && <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-bold"><i className="ri-error-warning-line mr-2"></i> Failed to send. Is the backend running?</div>}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default Contact;