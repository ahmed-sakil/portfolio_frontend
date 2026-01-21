import { createContext, useState, useEffect } from 'react';
import { API_URL } from '../config'; // Import the API_URL

// Create the box
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch everything in parallel using the dynamic API_URL
        const [projRes, eduRes, expRes] = await Promise.all([
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/education`),
          fetch(`${API_URL}/api/experience`)
        ]);

        const projectsData = await projRes.json();
        const educationData = await eduRes.json();
        const experienceData = await expRes.json();

        // Safety check: ensure arrays are returned, otherwise set empty arrays
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setEducation(Array.isArray(educationData) ? educationData : []);
        setExperience(Array.isArray(experienceData) ? experienceData : []);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching global data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty array = runs only once when website loads

  return (
    <DataContext.Provider value={{ projects, education, experience, loading }}>
      {children}
    </DataContext.Provider>
  );
};