import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const CreateItemDialog = ({ isOpen, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = () => {
        if (title && description) {
            onCreate({ title, description });
            setTitle('');
            setDescription('');
            onClose();
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
            <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-8 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <Dialog.Title className="text-xl font-bold mb-4">Create New Item</Dialog.Title>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Add Item
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default CreateItemDialog;
