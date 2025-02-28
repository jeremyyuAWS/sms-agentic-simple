
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './contexts/app/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Index from './pages/Index';
import Contacts from './pages/Contacts';
import Templates from './pages/Templates';
import Campaigns from './pages/Campaigns';
import CampaignsEnhanced from './pages/CampaignsEnhanced';
import NotFound from './pages/NotFound';
import TemplateSelection from './pages/TemplateSelection';
import CampaignSetup from './pages/CampaignSetup';
import './App.css';

// Wrapper component that redirects based on workflow state
const WorkflowRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { workflow } = useApp();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we need to redirect based on workflow state
    if (workflow.active) {
      const currentPath = location.pathname;
      
      // Define the path for each workflow step
      const stepPaths = {
        'contacts': '/contacts',
        'template': '/templates/select',
        'campaign': '/campaigns/setup',
        'schedule': '/campaigns/schedule',
        'review': '/campaigns/review'
      };
      
      const targetPath = stepPaths[workflow.currentStep];
      
      // If we're not on the correct path for the current workflow step,
      // navigate there (but don't create a redirect loop)
      if (targetPath && currentPath !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, [workflow.currentStep, workflow.active, location.pathname]);
  
  return <>{children}</>;
};

function App() {
  const { sidebarOpen } = useApp();
  
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className={`flex-1 transition-all ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Header />
          <WorkflowRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/select" element={<TemplateSelection />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/enhanced" element={<CampaignsEnhanced />} />
              <Route path="/campaigns/setup" element={<CampaignSetup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WorkflowRouter>
        </div>
      </div>
    </Router>
  );
}

export default App;
