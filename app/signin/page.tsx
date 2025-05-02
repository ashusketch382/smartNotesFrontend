"use client"
import { useState } from 'react';
//import { useRouter } from 'next/navigation'
import axios from 'axios';

export default function() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
//    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username: "ash", email, password });
            localStorage.setItem('token', res.data.token);
//            router.push('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return <div className="h-screen flex justify-center flex-col">
        <form onSubmit={handleSubmit} className="flex justify-center">
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            Sign In
                        </div>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="pt-2">
                        <LabelledInput label="Username" type={"email"} placeholder="ashutosh382singh@gmail.com" onChange={(e) => {setEmail(e.target.value); }} />
                        <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {setPassword(e.target.value); }} />
                        <button type="button" className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Sign In</button>
                    </div>
                </div>
            </a>
        </form>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({ label, placeholder, type, onChange}: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input type={type || "text"} id="first_name" onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}