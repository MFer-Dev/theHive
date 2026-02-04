import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-facebook-gray flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-facebook-blue text-6xl font-bold mb-4">facebook</h1>
          <p className="text-2xl text-facebook-text">
            Connect with friends and the world around you on Facebook.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  className="border rounded-lg px-4 py-3 outline-none focus:border-facebook-blue"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="border rounded-lg px-4 py-3 outline-none focus:border-facebook-blue"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            )}
            
            <input
              type="email"
              placeholder="Email or phone number"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-facebook-blue"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-facebook-blue"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-facebook-blue text-white rounded-lg py-3 font-bold text-xl hover:bg-facebook-dark transition"
            >
              {isRegister ? 'Sign Up' : 'Log In'}
            </button>

            <div className="text-center">
              <a href="#" className="text-facebook-blue text-sm hover:underline">
                Forgot password?
              </a>
            </div>

            <div className="border-t pt-4">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="w-full bg-green-500 text-white rounded-lg py-3 font-bold text-lg hover:bg-green-600 transition"
              >
                {isRegister ? 'Already have an account?' : 'Create New Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};