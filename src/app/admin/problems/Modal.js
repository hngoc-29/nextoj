// components/Modal.js
import { useState, useEffect } from 'react';

export default function Modal({ isOpen, onClose, onSubmit, title, initialData, selectedContests, setSelectedContests }) {

  if (!isOpen) return null;

  useEffect(() => {
    if (initialData) {
      setSelectedContests(initialData.contestId)
    }
  }, [])

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
          {/* Title */}
          <div>
            <label className="block mb-1">Tiêu đề</label>
            <input
              type="text"
              defaultValue={initialData?.title || ""}
              name="title"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Time Limit */}
          <div>
            <label className="block mb-1">Thời gian (ms)</label>
            <input
              type="number"
              defaultValue={initialData?.timeLimit || ""}
              name="timeLimit"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Memory Limit */}
          <div>
            <label className="block mb-1">Bộ nhớ (MB)</label>
            <input
              type="number"
              defaultValue={initialData?.memoryLimit || ""}
              name="memoryLimit"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Point */}
          <div>
            <label className="block mb-1">Điểm</label>
            <input
              type="number"
              defaultValue={initialData?.point || ""}
              name="point"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Content file upload */}
          <div>
            <label className="block mb-1">File nội dung (PDF)</label>
            <input
              type="file"
              name="content"
              accept=".pdf"
              className="w-full p-2 border border-gray-300 rounded"
              required={!initialData?.content}
            />
          </div>

          {/* Contests checkboxes if provided */}
          {initialData?.contests && (
            <div>
              <label className="block mb-1">Kỳ thi</label>
              {initialData.contests.map((el) => (
                <label key={el._id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    value={el._id}
                    checked={selectedContests.includes(el._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContests([...selectedContests, el._id]);
                      } else {
                        setSelectedContests(selectedContests.filter((id) => id !== el._id));
                      }
                    }}
                  />
                  <span>{el.title}</span>
                </label>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
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
