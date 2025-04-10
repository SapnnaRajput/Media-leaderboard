import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setError('Verification token is missing');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/auth/verify-email', { token });
        
        if (response.data.status === 'success') {
          // Save auth data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          setStatus('success');
          
          // Redirect to social page after a short delay
          setTimeout(() => {
            navigate('/social');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setError(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  const handleResendVerification = async () => {
    try {
      const email = searchParams.get('email');
      if (!email) {
        setError('Email is missing');
        return;
      }

      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      setError('New verification email has been sent. Please check your inbox.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">MediaLeader</Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Your Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
              <p className="text-gray-600">Your email has been verified successfully. Redirecting you to social feed...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <div className="space-y-4">
                <button
                  onClick={handleResendVerification}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Resend Verification Email
                </button>
                <Link
                  to="/login"
                  className="block px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
