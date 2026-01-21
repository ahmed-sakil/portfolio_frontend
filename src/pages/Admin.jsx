import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import { API_URL } from '../config';

// =========================================
// HELPER COMPONENTS
// =========================================
const inputClass = "w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-body mb-5";
const labelClass = "block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1";

// Input for Editing
const Field = ({ label, name, type = "text", placeholder = "", value, onChange }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {type === 'textarea' ? (
      <textarea name={name} value={value || ''} onChange={onChange} className={inputClass} rows="5" placeholder={placeholder} />
    ) : (
      <input type={type} name={name} value={value || ''} onChange={onChange} className={inputClass} placeholder={placeholder} />
    )}
  </div>
);

// Checkbox for Boolean Values (New)
const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="flex items-center gap-3 mb-5 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer" onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}>
    <div className={`w-6 h-6 rounded border flex items-center justify-center transition ${checked ? 'bg-primary border-primary' : 'border-white/30'}`}>
        {checked && <i className="ri-check-line text-bg font-bold"></i>}
    </div>
    <label className="text-sm font-bold text-white uppercase tracking-wider cursor-pointer select-none">{label}</label>
    {/* Hidden input to handle standard events if needed */}
    <input type="checkbox" name={name} checked={checked || false} onChange={onChange} className="hidden" />
  </div>
);

// Read-Only Field (For Messages)
const ReadField = ({ label, value }) => (
  <div className="mb-5">
    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white">
      {value || <span className="text-white/30 italic">Not provided</span>}
    </div>
  </div>
);

// Dropdowns
const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <select name={name} value={value || ''} onChange={onChange} className={inputClass}>
      <option value="" disabled>Select Type</option>
      {options.map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
    </select>
  </div>
);

// =========================================
// MAIN ADMIN COMPONENT
// =========================================
const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); 
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [formData, setFormData] = useState({}); 

  const tabs = [
    { id: 'profile', label: 'Profile / Settings', icon: 'ri-user-settings-line' },
    { id: 'projects', label: 'Projects', icon: 'ri-macbook-line' },
    { id: 'blogs', label: 'Blogs', icon: 'ri-article-line' },
    { id: 'experience', label: 'Experience', icon: 'ri-briefcase-line' },
    { id: 'education', label: 'Education', icon: 'ri-graduation-cap-line' },
    { id: 'skills', label: 'Skills', icon: 'ri-code-s-slash-line' },
    { id: 'messages', label: 'Messages', icon: 'ri-mail-line' },
  ];

  const skillTypes = ["Programming Language", "Markup/Styling Language", "Database", "Libraries/Framework", "Technologies", "Platforms", "Tools", "Others"];

  // === FETCH DATA ===
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // UPDATED: Used API_URL
      const response = await fetch(`${API_URL}/api/${activeTab}`);
      const result = await response.json();
      
      if (activeTab === 'profile') {
        setData([result]); 
      } else {
        setData(Array.isArray(result) ? result : []);
      }

    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { if (isAuthenticated) fetchData(); }, [activeTab, isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === import.meta.env.VITE_ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert("Wrong passcode");
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ isFeatured: false, priority: 0 }); // Default values
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    const formattedItem = { ...item };
    if (formattedItem.startDate) formattedItem.startDate = formattedItem.startDate.split('T')[0];
    if (formattedItem.endDate) formattedItem.endDate = formattedItem.endDate.split('T')[0];
    setFormData(formattedItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      // UPDATED: Used API_URL
      await fetch(`${API_URL}/api/${activeTab}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) { console.error("Delete failed", error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'messages') return; 

    let url, method;
    if (activeTab === 'profile') {
        // UPDATED: Used API_URL
        url = `${API_URL}/api/profile`;
        method = 'PUT'; 
    } else {
        // UPDATED: Used API_URL
        url = editingItem 
        ? `${API_URL}/api/${activeTab}/${editingItem.id}`
        : `${API_URL}/api/${activeTab}`;
        method = editingItem ? 'PUT' : 'POST';
    }

    // Prepare payload (Ensure priority is an integer)
    const payload = { ...formData };
    if (payload.priority) payload.priority = parseInt(payload.priority);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Failed to save data. Check console.");
      }
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  // Updated to handle Checkboxes
  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // === DYNAMIC INPUTS ===
  const renderFormInputs = () => {
    switch (activeTab) {
      case 'profile':
        return (
            <>
                <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Contact Info</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Professional Email" name="professionalEmail" value={formData.professionalEmail} onChange={handleInputChange} />
                    <Field label="Student Email" name="studentEmail" value={formData.studentEmail} onChange={handleInputChange} />
                    <Field label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} />
                    <Field label="WhatsApp Link" name="whatsapp" placeholder="https://wa.me/..." value={formData.whatsapp} onChange={handleInputChange} />
                    <Field label="Telegram Link" name="telegram" placeholder="https://t.me/..." value={formData.telegram} onChange={handleInputChange} />
                </div>

                <h3 className="text-white font-bold mb-4 mt-6 border-b border-white/10 pb-2">Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="GitHub" name="github" value={formData.github} onChange={handleInputChange} />
                    <Field label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleInputChange} />
                    <Field label="Twitter / X" name="twitter" value={formData.twitter} onChange={handleInputChange} />
                    <Field label="Facebook" name="facebook" value={formData.facebook} onChange={handleInputChange} />
                    <Field label="Instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} />
                </div>
            </>
        );
      case 'messages':
        return (
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                    <ReadField label="Sender Name" value={formData.name} />
                    <ReadField label="Email Address" value={formData.email} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <ReadField label="Inquiry Type" value={formData.inquiryType} />
                    <ReadField label="Company" value={formData.company} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <ReadField label="Budget Range" value={formData.budget} />
                    <ReadField label="Timeline" value={formData.timeline} />
                </div>
                <ReadField label="Full Message" value={formData.content} />
            </div>
        );
      case 'skills':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
               <SelectField label="Skill Type" name="type" options={skillTypes} value={formData.type} onChange={handleInputChange} />
               <Field label="Proficiency (%)" name="percentage" type="number" placeholder="0-100" value={formData.percentage} onChange={handleInputChange} />
            </div>
            <CheckboxField label="Feature on Homepage?" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} />
            
            <Field label="Skill Name" name="name" placeholder="React.js" value={formData.name} onChange={handleInputChange} />
            <Field label="Icon/Image URL" name="image" placeholder="https://cdn.jsdelivr..." value={formData.image} onChange={handleInputChange} />
            <Field label="Description (Optional)" name="description" type="textarea" value={formData.description} onChange={handleInputChange} />
          </>
        );
      case 'projects':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
               {/* NEW FIELDS */}
               <Field label="Priority Order (Higher # = Top)" name="priority" type="number" value={formData.priority} onChange={handleInputChange} />
               <CheckboxField label="Feature on Homepage?" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} />
            </div>

            <Field label="Project Title" name="title" value={formData.title} onChange={handleInputChange} />
            <Field label="Category" name="category" placeholder="Full Stack, AI..." value={formData.category} onChange={handleInputChange} />
            <Field label="Tech Stack" name="techStack" placeholder="React, Prisma..." value={formData.techStack} onChange={handleInputChange} />
            <Field label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Live Link" name="liveLink" value={formData.liveLink} onChange={handleInputChange} />
              <Field label="Repo Link" name="repoLink" value={formData.repoLink} onChange={handleInputChange} />
            </div>
            <Field label="Description" name="description" type="textarea" value={formData.description} onChange={handleInputChange} />
          </>
        );
      case 'blogs':
        return (
          <>
            <Field label="Blog Title" name="title" value={formData.title} onChange={handleInputChange} />
            <Field label="Summary (Short)" name="summary" value={formData.summary} onChange={handleInputChange} />
            <Field label="Cover Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
            <Field label="Content (HTML/Markdown)" name="content" type="textarea" value={formData.content} onChange={handleInputChange} />
          </>
        );
      case 'experience':
        return (
          <>
            <Field label="Company" name="company" value={formData.company} onChange={handleInputChange} />
            <Field label="Role" name="role" value={formData.role} onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
              <Field label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
            </div>
            <Field label="Description" name="description" type="textarea" value={formData.description} onChange={handleInputChange} />
          </>
        );
      case 'education':
        return (
          <>
            <Field label="Institution" name="institution" value={formData.institution} onChange={handleInputChange} />
            <Field label="Degree" name="degree" value={formData.degree} onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
              <Field label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
            </div>
            <Field label="Description" name="description" type="textarea" value={formData.description} onChange={handleInputChange} />
          </>
        );
      default: return null;
    }
  };

  const getColumns = () => {
    switch (activeTab) {
      case 'profile': return [{ header: 'Professional Email', key: 'professionalEmail' }, { header: 'Phone', key: 'contactNumber' }];
      case 'skills': return [{ header: 'Name', key: 'name' }, { header: 'Type', key: 'type' }, { header: '%', key: 'percentage' }, { header: 'Home?', key: 'isFeatured' }];
      case 'projects': return [{ header: 'Title', key: 'title' }, { header: 'Priority', key: 'priority' }, { header: 'Home?', key: 'isFeatured' }];
      case 'blogs': return [{ header: 'Title', key: 'title' }, { header: 'Summary', key: 'summary' }];
      case 'experience': return [{ header: 'Company', key: 'company' }, { header: 'Role', key: 'role' }];
      case 'education': return [{ header: 'Institution', key: 'institution' }, { header: 'Degree', key: 'degree' }];
      case 'messages': return [{ header: 'From', key: 'name' }, { header: 'Email', key: 'email' }, { header: 'Type', key: 'inquiryType' }, { header: 'Date', key: 'createdAt' }];
      default: return [];
    }
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full p-8 border-white/10 bg-black/40">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Admin Access</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-center" placeholder="Passcode" />
                <button className="w-full bg-primary text-bg font-bold py-4 rounded-xl">Unlock</button>
            </form>
        </GlassCard>
    </div>
  );

  return (
    <div className="max-w-[95%] mx-auto py-10 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white font-heading">Admin <span className="text-primary">Dashboard</span></h1>
        <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem('adminAuth'); }} className="text-red-400 font-bold">Logout</button>
      </div>
      <div className="grid lg:grid-cols-[250px_1fr] gap-8 flex-grow">
        <div className="space-y-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left p-4 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-primary text-bg' : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'}`}>
              <i className={`${tab.icon} text-xl`}></i> {tab.label}
            </button>
          ))}
        </div>
        <GlassCard className="p-6 border-white/10 bg-black/20 min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
            {/* HIDE Add New button for Profile and Messages */}
            {activeTab !== 'messages' && activeTab !== 'profile' && (
                <button onClick={handleAddNew} className="bg-primary/20 text-primary border border-primary/50 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><i className="ri-add-line"></i> Add New</button>
            )}
          </div>
          {isLoading ? <div className="text-center py-20 text-text-muted">Loading...</div> : <AdminTable data={data} columns={getColumns()} onEdit={handleEdit} onDelete={handleDelete} type={activeTab} />}
        </GlassCard>
      </div>
      
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={activeTab === 'messages' ? 'Message Details' : (activeTab === 'profile' ? 'Edit Profile' : (editingItem ? `Edit` : `Add`))}>
        <form onSubmit={handleSubmit}>
          {renderFormInputs()}
          <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-text-muted hover:text-white font-bold">{activeTab === 'messages' ? 'Close' : 'Cancel'}</button>
             {activeTab !== 'messages' && (
                <button type="submit" className="px-8 py-3 bg-primary text-bg font-bold rounded-xl hover:bg-white transition">{editingItem ? 'Update' : 'Save'}</button>
             )}
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default Admin;