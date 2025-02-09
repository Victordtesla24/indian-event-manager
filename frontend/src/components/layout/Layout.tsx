import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Background from './Background';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Header />
      <main className="flex-1 mt-16">
        <AnimatePresence mode="wait">
          <PageTransition key={useLocation().pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
