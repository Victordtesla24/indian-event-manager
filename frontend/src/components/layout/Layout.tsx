import { ReactNode } from 'react';
import Background from './Background';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      {children}
    </div>
  );
};

export default Layout;
