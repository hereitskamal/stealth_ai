"use client"
import { useState } from 'react';
import { AiOutlineLogin, AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import Login from '../dialogues/Login';
import Register from '../dialogues/Register';

const Navbar = ({ user, setUser }) => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <nav className="flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow-md">
            <div className="flex items-center justify-between w-full">
                <h1 className="text-2xl font-bold flex items-center">
                    <AiOutlineLogin className="mr-2 text-3xl" />
                    Stealth AI
                </h1>
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 focus:outline-none">
                        {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                    </button>
                </div>
            </div>

            <div className={`flex-col md:flex-row md:flex items-center md:justify-end w-full ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                {user ? (
                    <>
                        <span className="mx-4 my-2 flex items-center text-gray-700">
                            <AiOutlineUser className="mr-1" />
                            {`Hello, ${user.name}`}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                            Logout
                        </button>
                        {user.isAdmin && (
                            <button
                                onClick={() => setIsRegisterOpen(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-md transition duration-200 ml-4"
                            >
                                Register User
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex justify-end w-full md:mt-0">
                        <Login setUser={setUser} />
                    </div>
                )}
            </div>
            <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} setUser={setUser} />
        </nav>
    );
};

export default Navbar;
