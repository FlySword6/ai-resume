import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import FitAssessment from '@/components/FitAssessment';
import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useProfileContext } from '@/hooks/useProfileContext';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { profile, serviceStatus } = useProfileContext();

  const openChat = () => setIsChatOpen(true);

  // If config.sections is defined, only render those sections; otherwise render all
  const sections = profile?.config?.sections;
  const showSection = (name: string) => !sections || sections.includes(name);

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary sectionName="Header">
        <Header onOpenChat={openChat} />
      </ErrorBoundary>
      <main id="main-content">
        {serviceStatus === 'unavailable' && (
          <div className="mt-16 bg-destructive/10 border-b border-destructive/20 px-4 py-3 text-center text-sm text-destructive">
            本地 AI 后端尚未启动，当前只展示静态简历内容。
          </div>
        )}
        {serviceStatus === 'static' && (
          <div className="mt-16 bg-warning/10 border-b border-warning/20 px-4 py-3 text-center text-sm text-warning">
            当前为静态简历模式，页面已切换为朱健科资料；AI
            问答需启动本地后端后启用。
          </div>
        )}
        {serviceStatus === 'degraded' && (
          <div className="mt-16 bg-warning/10 border-b border-warning/20 px-4 py-3 text-center text-sm text-warning">
            部分服务处于降级状态，AI 功能可能受限。
          </div>
        )}
        {showSection('hero') && (
          <ErrorBoundary sectionName="Hero">
            <Hero onOpenChat={openChat} />
          </ErrorBoundary>
        )}
        {showSection('education') && (
          <ErrorBoundary sectionName="Education">
            <Education />
          </ErrorBoundary>
        )}
        {showSection('experience') && (
          <ErrorBoundary sectionName="Experience">
            <Experience />
          </ErrorBoundary>
        )}
        {showSection('projects') && (
          <ErrorBoundary sectionName="Projects">
            <Projects />
          </ErrorBoundary>
        )}
        {showSection('fit-assessment') && (
          <ErrorBoundary sectionName="Fit Assessment">
            <FitAssessment />
          </ErrorBoundary>
        )}
      </main>
      <ErrorBoundary sectionName="Footer">
        <Footer />
      </ErrorBoundary>
      <ErrorBoundary sectionName="AI Chat">
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
