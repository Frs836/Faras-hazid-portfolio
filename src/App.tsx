import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { PrdSrsModal } from './components/modals/PrdSrsModal';
import { CvDownloadModal } from './components/modals/CvDownloadModal';

import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { ContactPage } from './components/pages/ContactPage';
import { SecretAdminGate } from './components/admin/SecretAdminGate';

const MainLayout: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'services':
        return <ServicesPage />;
      case 'contact':
        return <ContactPage />;
      case 'secret-admin':
        return <SecretAdminGate />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans relative overflow-x-clip">
      {/* Film grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* Background Ambient Vignettes */}
      <div className="fixed -top-32 -right-32 w-[34rem] h-[34rem] bg-accent2/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 -left-32 w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Toast Layer */}
      <ToastContainer />

      {/* PRD/SRS Documentation Modal */}
      <PrdSrsModal />

      {/* Dual CV Download & Preview Modal */}
      <CvDownloadModal />

      {/* Sticky Editorial Navbar */}
      <Navbar />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10">
        {renderPage()}
      </main>

      {/* Unified Clay Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
