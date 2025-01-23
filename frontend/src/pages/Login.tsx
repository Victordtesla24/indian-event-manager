import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // TODO: Implement actual login API call
      console.log('Login attempt with:', { email, password });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-off-white relative py-16">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-peacock-lime-light via-peacock-teal-light to-peacock-blue-light opacity-30" />
      <div className="absolute inset-0 bg-geometric-pattern opacity-40" />
      <div className="absolute inset-0 bg-peacock-feather bg-no-repeat bg-[length:800px_800px] bg-center opacity-20" />

      {/* Content */}
      <div className="relative max-w-md mx-auto px-4">
        <div className="card relative overflow-hidden bg-white/90 backdrop-blur-sm">
          {/* Card Background */}
          <div className="absolute inset-0 bg-geometric-pattern opacity-30" />
          <div className="absolute inset-0 bg-peacock-feather bg-no-repeat bg-[length:400px_400px] bg-center opacity-20" />
          
          {/* Card Content */}
          <div className="relative p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-peacock-indigo">Welcome Back</h1>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-peacock-blue mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-primary w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-peacock-blue mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="input-primary w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-peacock-blue focus:ring-peacock-blue border-peacock-blue/30 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button 
                    type="button"
                    className="text-peacock-blue hover:text-peacock-indigo transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <span>Google</span>
                </button>
                <button 
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>{' '}
              <Link 
                to="/register" 
                className="text-peacock-blue hover:text-peacock-indigo transition-colors font-medium"
              >
                Register now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
