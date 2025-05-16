// components/UpdateProblemModal.js
import Modal from "./Modal";

export default function UpdateProblemModal({
    isOpen,
    onClose,
    onUpdate,
    problemData,
    selectedContests,
    setSelectedContests
}) {
    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedData = new FormData();

        updatedData.append("title", formData.get("title"));
        updatedData.append("timeLimit", formData.get("timeLimit"));
        updatedData.append("memoryLimit", formData.get("memoryLimit"));
        updatedData.append("point", formData.get("point"));

        const contentFile = formData.get("content");
        if (contentFile && contentFile.size > 0) {
            updatedData.append("content", contentFile);
        }

        updatedData.append("contestId", JSON.stringify(selectedContests));

        const isPublic = formData.get("public") === "on" ? "true" : "false";
        updatedData.append("public", isPublic);

        onUpdate(problemData._id, updatedData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleUpdate}
            title="Cập Nhật Bài Toán"
            initialData={problemData}
            setSelectedContests={setSelectedContests}
            selectedContests={selectedContests}
        />
    );
}
