import * as Dialog from '@radix-ui/react-dialog';

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
            <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-8 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <Dialog.Title className="text-xl font-bold mb-4">Confirm Deletion</Dialog.Title>
                <Dialog.Description className="mb-4">
                    Are you sure you want to delete this item?
                </Dialog.Description>
                <div className="flex justify-end">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Yes, Delete
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

export default DeleteConfirmationDialog;
