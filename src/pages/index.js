import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FaPlus, FaSortAlphaDown } from 'react-icons/fa';
import CreateItemDialog from '../components/dialogues/CreateItemDialog';
import DeleteConfirmationDialog from '../components/dialogues/DeleteConfirmationDialog';
import { fetchItems, createItem, deleteItem } from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = ({ setUser, user }) => {
    const [items, setItems] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSorted, setIsSorted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getItems = async () => {
            setLoading(true);
            try {
                const data = await fetchItems();
                setItems(data);
            } catch (error) {
                toast.error(`Failed to fetch items: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        getItems();
    }, []);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        }
    }, [setUser]);

    const handleAddItem = async (newItem) => {
        if (!user) {
            toast.warn("Please log in to create an item.");
            return;
        }

        try {
            setLoading(true);
            const createdItem = await createItem({ ...newItem, createdBy: user.id });
            setItems((prevItems) => [...prevItems, createdItem]);
            toast.success("Item created successfully!");
        } catch (error) {
            toast.error(`Failed to create item: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteDialog = (id) => {
        if (!user) {
            toast.warn("Please log in to delete an item.");
            return;
        }
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setLoading(true);
            await deleteItem( deleteId, user.id );
            setItems((prevItems) => prevItems.filter(item => item.id !== deleteId));
            toast.success("Item deleted successfully!");
        } catch (error) {
            toast.error(`Failed to delete item: ${error.message}`);
        } finally {
            setLoading(false);
        }
        setDeleteId(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleSort = () => {
        setIsSorted((prev) => !prev);
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedItems = isSorted
        ? [...filteredItems].sort((a, b) => a.title.localeCompare(b.title))
        : filteredItems;

    return (
        <div className="flex flex-col items-center p-4 pb-0">
            <Head>
                <title>My Next.js App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <div className="flex justify-between items-center mb-6 w-full max-w-md">
                <button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-blue-600 text-white flex items-center px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-700"
                >
                    <FaPlus className="mr-2" />
                    Create Item
                </button>
                <button
                    onClick={toggleSort}
                    className={`flex items-center px-4 py-2 rounded-lg transition duration-200 
                        ${isSorted ? 'bg-white border border-blue-600 text-blue-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                >
                    <FaSortAlphaDown className="mr-2" />
                    Sort A-Z
                </button>
            </div>

            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4 px-3 py-2 border rounded w-full max-w-md"
            />

            <div className="max-h-[66vh] overflow-y-auto w-full max-w-md scrollable-area">
                {loading ? (
                    <Loader />
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {sortedItems.map((item) => (
                            <div key={item.id} className="p-4 flex justify-between items-center rounded-lg bg-white hover:shadow-lg transition-shadow duration-200">
                                <div>
                                    <h2 className="font-semibold text-md">{item.title}</h2>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                                <button
                                    onClick={() => openDeleteDialog(item.id)} 
                                    className={`bg-red-600 text-white px-3 py-1 rounded-lg transition duration-200 hover:bg-red-700 ${item.createdBy !== user?.id ? 'bg-gray-400 cursor-not-allowed' : ''
                                        }`}
                                    disabled={item.createdBy !== user?.id}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateItemDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onCreate={handleAddItem}
            />

            <DeleteConfirmationDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteIndex(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default Home;
