import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { registerUser } from '../services/api';
import { toast } from 'react-toastify';

const Register = ({ setUser, isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await registerUser(name, email, password);
            setUser(data.user);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Registration successful!');
            onClose();
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60 z-100" />
            <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-8 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-60">
                <Dialog.Title className="text-2xl text-gray-800 font-bold mb-4 text-center">Create an Account</Dialog.Title>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <form onSubmit={handleRegister} className="flex flex-col">
                    <label htmlFor="name" className="mb-2 font-semibold">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border w-full border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Your Name"
                    />
                    <label htmlFor="email" className="mb-2 font-semibold">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border w-full border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="you@example.com"
                    />
                    <label htmlFor="password" className="mb-2 font-semibold">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border w-full border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="••••••••"
                    />
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-4 text-gray-500 hover:text-blue-600 underline text-center"
                    >
                        Cancel
                    </button>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default Register;
