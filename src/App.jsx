import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // 1. Import Navigate
import Layout from './components/Layout';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Education from './pages/Education';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/admin" element={<Admin />} />
          <Route index element={<Home />} />
          <Route path="skills" element={<Skills />} />
          <Route path="education" element={<Education />} />
          
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />

          {/* 2. Catch all undefined routes and redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;