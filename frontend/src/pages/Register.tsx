import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // TODO: Implement actual registration API call
      console.log('Registration attempt with:', formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
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
            <h1 className="text-3xl font-bold text-center mb-8 text-peacock-indigo">Create Account</h1>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-peacock-blue mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="input-primary w-full"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-peacock-blue mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-primary w-full"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-peacock-blue mb-1">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  className="input-primary w-full"
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value="">Select a city</option>
                  <option value="melbourne">Melbourne</option>
                  <option value="sydney">Sydney</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-peacock-blue mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-primary w-full"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-peacock-blue mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-primary w-full"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Create Account
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
              <span className="text-gray-600">Already have an account?</span>{' '}
              <Link 
                to="/login" 
                className="text-peacock-blue hover:text-peacock-indigo transition-colors font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
