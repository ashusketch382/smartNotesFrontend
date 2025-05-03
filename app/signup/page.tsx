"use client";
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext/page';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      localStorage.setItem('token', res.data.token);
      auth?.setUser({ id: res.data.user.id, email: res.data.user.email }); // Update user state
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign up. Please check your credentials and try again.');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold">Sign Up</h1>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <LabelledInput label="Email" type="email" placeholder="ashutosh382singh@gmail.com" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-4">
          <LabelledInput label="Password" type="password" placeholder="123456" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4">
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account? <a href="/signin" className="text-blue-500 hover:underline">Sign In</a>
        </p>
      </form>
    </div>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold">{label}</label>
      <input type={type || "text"} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
  );
}
