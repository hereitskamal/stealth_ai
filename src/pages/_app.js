import '../styles/globals.css';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogin={handleLogout} user={user} setUser={setUser} />
      <main className="flex-grow p-4 bg-gray-100">
        <Component {...pageProps} user={user} setUser={setUser} />
      </main>
      <ToastContainer />
    </div>
  );
}

export default MyApp;
