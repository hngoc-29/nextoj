// components/Modal.js
export default function Modal({ isOpen, onClose, onSubmit, title, children }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-md w-96"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    {children}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
