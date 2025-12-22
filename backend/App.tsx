
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar 
          onMenuClick={toggleSidebar} 
          onThemeToggle={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-light dark:bg-background-dark">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default App;
