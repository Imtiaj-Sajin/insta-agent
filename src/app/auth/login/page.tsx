"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string>('');

  const handleLogin = () => {
    if (role === 'admin') {
      document.cookie = 'authToken=adminToken; path=/';
      router.push('/admin/dashboard');
    } else if (role === 'moderator') {
      document.cookie = 'authToken=moderatorToken; path=/';
      router.push('/moderator/dashboard');
    } else {
      alert('Invalid role');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
