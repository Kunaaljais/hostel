
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import * as api from './services/api';
import StudentPortal from './components/student/StudentPortal';
import AdminPortal from './components/admin/AdminPortal';
import Input from './components/ui/Input';
import Button from './components/ui/Button';

// Main App Component
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const user = await api.checkSession();
      setCurrentUser(user);
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = e.currentTarget;
    try {
      setAuthError('');
      const user = await api.login(email.value, password.value);
      setCurrentUser(user);
    } catch (error) {
      setAuthError((error as Error).message);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value;
    const rollNumber = (form.elements.namedItem('rollNumber') as HTMLInputElement).value;
    try {
      setAuthError('');
      const user = await api.register({
        name,
        email,
        password,
        role: role as UserRole,
        rollNumber: role === 'student' ? rollNumber : undefined,
      });
      setCurrentUser(user);
    } catch (error) {
      setAuthError((error as Error).message);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-slate-900">Loading...</div>;
  }

  if (!currentUser) {
    const backgroundImageUrl = 'https://storage.googleapis.com/aistudio-hosting/workspace-assets/5e81f185-c64a-466d-8067-279075be8c53/versions/default/files/Screenshot%202024-07-26%20at%204.38.16%E2%80%AFPM.png';
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-slate-900">
              {isRegister ? 'Create an Account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              IIITDM Kurnool Hostel Management
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={isRegister ? handleRegister : handleLogin}>
            {isRegister && <Input name="name" type="text" placeholder="Full Name" required />}
            <Input name="email" type="email" autoComplete="email" required placeholder="Email address" />
            <Input name="password" type="password" autoComplete="current-password" required placeholder="Password" />
            {isRegister && (
                <>
                    <select name="role" defaultValue="student" className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                    <Input name="rollNumber" type="text" placeholder="Roll Number (Students only)" />
                </>
            )}
            {authError && <p className="text-red-500 text-sm font-medium text-center">{authError}</p>}
            <Button type="submit" className="w-full">{isRegister ? 'Register' : 'Sign In'}</Button>
          </form>
          <div className="text-center">
            <button onClick={() => { setIsRegister(!isRegister); setAuthError(''); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-slate-900 print:block print:h-auto print:bg-white">
      {currentUser.role === 'student' ? (
        <StudentPortal user={currentUser} onLogout={handleLogout} />
      ) : (
        <AdminPortal user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}