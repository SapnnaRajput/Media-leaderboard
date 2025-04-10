import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    journalistInfo: {
      organization: '',
      experience: '',
      expertise: '',
      pressId: '',
      portfolio: '',
      country: '',
      state: '',
      contactNumber: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('journalist.')) {
      const journalistField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        journalistInfo: {
          ...prev.journalistInfo,
          [journalistField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'journalist') {
        signupData.journalistInfo = formData.journalistInfo;
      }

      const response = await axios.post('http://localhost:5000/api/auth/signup', signupData);

      if (response.data.status === 'success') {
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // If registration is successful, show success message
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">MediaLeader</Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please check your email and click the link to complete your registration.
            </p>
            <div className="text-sm text-gray-500">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">MediaLeader</Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
            <p className="text-blue-100 text-lg">Join our community today</p>
          </div>

          <div className="p-8 bg-white">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                    required
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                    required
                  >
                    <option value="user">User</option>
                    <option value="journalist">Journalist</option>
                  </select>
                </div>
              </div>

              {formData.role === 'journalist' && (
                <div className="space-y-6 mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Journalist Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        name="journalist.organization"
                        value={formData.journalistInfo.organization}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        placeholder="Your organization"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        name="journalist.experience"
                        value={formData.journalistInfo.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        placeholder="Years of experience"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Area of Expertise
                      </label>
                      <input
                        type="text"
                        name="journalist.expertise"
                        value={formData.journalistInfo.expertise}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        placeholder="Your expertise"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Press ID Number
                      </label>
                      <input
                        type="text"
                        name="journalist.pressId"
                        value={formData.journalistInfo.pressId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        placeholder="Your press ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="journalist.contactNumber"
                        value={formData.journalistInfo.contactNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        pattern="[\d\s\-+()]+"
                        title="Please enter a valid phone number. Only digits, spaces, dashes, plus sign, and parentheses are allowed."
                        placeholder="e.g., +91 1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="journalist.country"
                        value={formData.journalistInfo.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        placeholder="Your country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="journalist.state"
                        value={formData.journalistInfo.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        placeholder="Your state"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        name="journalist.portfolio"
                        value={formData.journalistInfo.portfolio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                        required
                        placeholder="https://your-portfolio.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;