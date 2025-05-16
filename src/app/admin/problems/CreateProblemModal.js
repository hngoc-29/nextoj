// components/CreateProblemModal.js
import Modal from "./Modal";

export default function CreateProblemModal({ isOpen, onClose, onCreate, selectedContests, setSelectedContests }) {
    const handleCreate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = new FormData();

        updatedData.append("title", formData.get("title"));
        updatedData.append("timeLimit", formData.get("timeLimit"));
        updatedData.append("memoryLimit", formData.get("memoryLimit"));
        updatedData.append("point", formData.get("point"));

        // Lấy kiểu nhập content (file/link)
        const contentType = formData.get("contentType");
        if (contentType === "file") {
            const contentFile = formData.get("content");
            if (contentFile && contentFile.size > 0) {
                updatedData.append("content", contentFile);
            }
        } else if (contentType === "link") {
            const contentLink = formData.get("content");
            if (contentLink && contentLink.trim() !== "") {
                updatedData.append("content", contentLink.trim());
            }
        }

        updatedData.append("contestId", JSON.stringify(selectedContests));

        // Lấy giá trị public từ form
        const isPublic = formData.get("public") === "on" ? "true" : "false";
        updatedData.append("public", isPublic);

        onCreate(updatedData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleCreate}
            title="Tạo Bài Toán Mới"
            initialData={{}}
            setSelectedContests={setSelectedContests}
            selectedContests={selectedContests}
        />
    );
}
