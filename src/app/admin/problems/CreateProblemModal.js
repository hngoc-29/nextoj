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
        />
    );
}
