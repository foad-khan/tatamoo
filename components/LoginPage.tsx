import React, { useState } from 'react';
import { OrganizationType } from '../types';
import { ORGANIZATION_TYPES } from '../constants';

interface LoginPageProps {
  onLogin: (email: string, organization: string, orgType: OrganizationType) => void;
}

const AbstractBackground: React.FC = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-[200%] opacity-15" style={{
            backgroundImage: 'radial-gradient(circle at center, white 2px, transparent 2.5px)',
            backgroundSize: '40px 40px',
            animation: 'pan-background 60s linear infinite'
        }}></div>
        <style>{`
            @keyframes pan-background {
                0% { transform: translate(0, 0); }
                100% { transform: translate(-50%, -50%); }
            }
        `}</style>
    </div>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [orgType, setOrgType] = useState<OrganizationType>(ORGANIZATION_TYPES[0]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup') {
      if (email && organization && orgType && password) {
        onLogin(email, organization, orgType);
      } else {
        setError('Please fill out all fields to sign up.');
      }
    } else { // Login
      if (email && password) {
        // In a real app, you'd verify credentials and fetch org info.
        // We'll use a default orgType for login simulation.
        onLogin(email, organization || email.split('@')[1]?.split('.')[0] || 'My Org', orgType);
      } else {
        setError('Please enter your email and password to log in.');
      }
    }
  };
  
  const handleGoogleLogin = () => {
    setError('');
    // In a real app, this would trigger the Google OAuth flow.
    // Here, we'll simulate a successful login with placeholder data.
    onLogin('demouser@google.com', 'Demo Organization', orgType);
  };

  const TabButton: React.FC<{tabName: 'login' | 'signup', children: React.ReactNode}> = ({ tabName, children }) => (
    <button
      type="button"
      onClick={() => {
        setActiveTab(tabName);
        setError('');
      }}
      className={`w-full py-2.5 text-sm font-semibold rounded-md focus:outline-none transition-colors ${
        activeTab === tabName
          ? 'bg-white text-indigo-700 shadow-sm'
          : 'bg-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:grid md:grid-cols-5 border border-slate-200">
      
      {/* Form Section */}
      <div className="md:col-span-3 p-8 sm:p-12">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-100 p-1 rounded-lg grid grid-cols-2 gap-1 mb-8">
             <TabButton tabName="login">Log In</TabButton>
             <TabButton tabName="signup">Sign Up</TabButton>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-slate-900">
            {activeTab === 'login' ? 'Welcome Back!' : 'Begin Your Assessment'}
          </h2>
          <p className="text-slate-600 mb-8">
            {activeTab === 'login' ? 'Log in to continue your journey.' : 'Create an account to get a benchmarked evaluation.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'signup' && (
              <>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Organization Name
                  </label>
                  <input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="block w-full bg-slate-50 border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Healthcare Inc."
                  />
                </div>
                <div>
                    <label htmlFor="orgType" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Organization Type
                    </label>
                    <select
                        id="orgType"
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value as OrganizationType)}
                        className="block w-full bg-slate-50 border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    >
                        {ORGANIZATION_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full bg-slate-50 border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="you@your-organization.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  {activeTab === 'login' && (
                      <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">
                          Forgot Password?
                      </a>
                  )}
              </div>
              <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full bg-slate-50 border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                      {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.012 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /><path d="M2 10s3.939 4 8 4 8-4 8-4-3.939-4-8-4-8 4-8 4zm10 2a2 2 0 100-4 2 2 0 000 4z" /></svg>
                      )}
                  </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>{activeTab === 'login' ? 'Log In & Start Assessment' : 'Sign Up & Start Assessment'}</span>
              </button>
            </div>
          </form>

          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">OR</span>
              </div>
          </div>

          <div>
              <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                  <svg className="w-5 h-5 mr-3" role="img" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.241,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  <span>{activeTab === 'login' ? 'Log in with Google' : 'Sign up with Google'}</span>
              </button>
          </div>
        </div>
      </div>

      {/* Branding Section */}
      <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex-col justify-center items-center text-white relative">
          <AbstractBackground />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-center">Unlock Benchmarked Insights</h3>
            <p className="mt-4 text-slate-200 text-center text-sm leading-relaxed">
              See how your AI readiness compares to your peers and get a roadmap for intelligent healthcare.
            </p>
          </div>
      </div>

    </div>
  );
};

export default LoginPage;