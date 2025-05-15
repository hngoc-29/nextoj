// components/Modal.js
export default function Modal({ isOpen, onClose, onSubmit, title, children }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 transition-all"
            onClick={onClose}
        >
            <div
                className="bg-white w-[95vw] z-50 max-w-md sm:max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{title}</h2>
                <form onSubmit={onSubmit} className="space-y-5">
                    {children}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end items-center mt-6">
                        <button
                            type="button"
                            className="w-full cursor-pointer sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full font-semibold transition"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="w-full cursor-pointer sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow transition"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
