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
      portfolio: ''
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">MediaLeader</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Illustration */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white">
              <div className="h-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                <p className="text-blue-100 mb-8">
                  Create your account to access exclusive content and features.
                </p>
                <div className="mt-auto">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-blue-600">
                      1
                    </div>
                    <span className="font-medium">Account Details</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600 mb-6">
                Fill in your details to get started
              </p>

              {error && (
                <div className={`mb-6 p-4 rounded-lg ${
                  error.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          formData.role === 'user'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <span className="block font-medium">User</span>
                        <span className="text-xs text-gray-500">Regular account</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'journalist' }))}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          formData.role === 'journalist'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <span className="block font-medium">Journalist</span>
                        <span className="text-xs text-gray-500">Media professional</span>
                      </button>
                    </div>
                  </div>
                </div>

                {formData.role === 'journalist' && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Journalist Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                        <input
                          type="text"
                          name="journalist.organization"
                          value={formData.journalistInfo.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                          required
                          placeholder="Media outlet"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                        <input
                          type="number"
                          name="journalist.experience"
                          value={formData.journalistInfo.experience}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                          required
                          min="0"
                          placeholder="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                        <input
                          type="text"
                          name="journalist.expertise"
                          value={formData.journalistInfo.expertise}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                          required
                          placeholder="Politics, Technology, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Press ID (optional)</label>
                        <input
                          type="text"
                          name="journalist.pressId"
                          value={formData.journalistInfo.pressId}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                          placeholder="ID number"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                        <input
                          type="url"
                          name="journalist.portfolio"
                          value={formData.journalistInfo.portfolio}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                          placeholder="https://example.com/portfolio"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;