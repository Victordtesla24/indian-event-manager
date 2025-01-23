import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nav-menu relative">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-geometric-pattern opacity-20" />
      <div className="absolute inset-0 bg-peacock-feather bg-no-repeat bg-[length:200px_200px] bg-center opacity-10" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-white hover:text-peacock-lime-light transition-colors"
          >
            Indian Events
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-peacock-lime-light transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-white hover:text-peacock-lime-light transition-colors"
            >
              Events
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-white hover:text-peacock-lime-light transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-peacock-blue px-4 py-2 rounded-md hover:bg-peacock-lime-light hover:text-peacock-indigo transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-peacock-lime via-peacock-teal to-peacock-blue opacity-50" />
    </nav>
  );
};

export default Navbar;
