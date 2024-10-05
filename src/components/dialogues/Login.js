import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { loginUser } from '../../services/api';
import { toast } from 'react-toastify';

const Login = ({ setUser }) => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await loginUser(email, password);
            setUser(data.user);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            setOpen(false);
            toast.success("Login successful!");
        } catch (err) {
            toast.error(`Login failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition duration-200"
            >
                Login
            </button>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-60 z-100" />
                <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-8 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-60">
                    <Dialog.Title className="text-2xl text-gray-800 font-bold mb-4 text-center">Welcome Back</Dialog.Title>
                    <Dialog.Description className="mb-6 text-gray-600 text-center">
                        Please enter your credentials to login.
                    </Dialog.Description>
                    <form onSubmit={handleSubmit} className="flex text-gray-700 flex-col">
                        <label htmlFor="email" className="mb-2 font-semibold flex items-center">
                            <AiOutlineMail className="mr-2 text-gray-500" />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border w-full border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="you@example.com"
                        />
                        <label htmlFor="password" className="mb-2 font-semibold flex items-center">
                            <AiOutlineLock className="mr-2 text-gray-500" />
                            Password
                        </label>
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
                            className={`bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="mt-4 text-gray-500 hover:text-blue-600 underline text-center"
                        >
                            Cancel
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
};

export default Login;
