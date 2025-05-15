// components/CreateProblemModal.js
import Modal from "./Modal";

export default function CreateProblemModal({ isOpen, onClose, onCreate }) {
    const handleCreate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = new FormData();

        updatedData.append("title", formData.get("title"));
        updatedData.append("timeLimit", formData.get("timeLimit"));
        updatedData.append("memoryLimit", formData.get("memoryLimit"));
        updatedData.append("point", formData.get("point"));
        const contentFile = formData.get("content");
        updatedData.append("content", contentFile);
        onCreate(updatedData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleCreate}
            title="Tạo Bài Toán Mới"
        >
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Tiêu đề</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Nhập tiêu đề bài toán"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block mb-1 font-semibold text-gray-700">Thời gian (ms)</label>
                        <input
                            type="number"
                            name="timeLimit"
                            required
                            min={100}
                            placeholder="VD: 1000"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-semibold text-gray-700">Bộ nhớ (MB)</label>
                        <input
                            type="number"
                            name="memoryLimit"
                            required
                            min={16}
                            placeholder="VD: 256"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-semibold text-gray-700">Điểm</label>
                        <input
                            type="number"
                            name="point"
                            required
                            min={1}
                            placeholder="VD: 100"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">File đề bài (.md)</label>
                    <input
                        type="file"
                        name="content"
                        accept=".md"
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
            </div>
        </Modal>
    );
}
