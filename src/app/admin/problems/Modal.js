'use client';

// components/Modal.js
import { useEffect, useState } from 'react';

export default function Modal({ isOpen, onClose, onSubmit, title, initialData, selectedContests, setSelectedContests }) {
  const [contentType, setContentType] = useState('file'); // 'file' hoặc 'link'

  useEffect(() => {
    if (isOpen && initialData && Array.isArray(initialData.contestId)) {
      setSelectedContests(initialData.contestId);
      if (initialData.content && initialData.content.startsWith('http') && !initialData.content.endsWith('.pdf')) {
        setContentType('link');
      } else {
        setContentType('file');
      }
    }
    // eslint-disable-next-line
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white w-[95vw] max-w-lg sm:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Tiêu đề</label>
            <input
              type="text"
              defaultValue={initialData?.title || ""}
              name="title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Time Limit & Memory Limit & Point */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Thời gian (ms)</label>
              <input
                type="number"
                defaultValue={initialData?.timeLimit || ""}
                name="timeLimit"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Bộ nhớ (MB)</label>
              <input
                type="number"
                defaultValue={initialData?.memoryLimit || ""}
                name="memoryLimit"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Điểm</label>
              <input
                type="number"
                defaultValue={initialData?.point || ""}
                name="point"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
          </div>

          {/* Chọn kiểu nhập nội dung */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Nội dung bài toán</label>
            <div className="flex gap-4 mb-2">
              <label>
                <input
                  type="radio"
                  name="contentType"
                  value="file"
                  checked={contentType === 'file'}
                  onChange={() => setContentType('file')}
                  className="mr-1 cursor-pointer"
                />
                File PDF
              </label>
              <label>
                <input
                  type="radio"
                  name="contentType"
                  value="link"
                  checked={contentType === 'link'}
                  onChange={() => setContentType('link')}
                  className="mr-1 cursor-pointer"
                />
                Link (URL)
              </label>
            </div>
            {contentType === 'file' ? (
              <input
                type="file"
                name="content"
                accept=".pdf"
                className="w-full p-2 border cursor-pointer border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required={contentType === 'file' && !initialData?.content}
              />
            ) : (
              <input
                type="url"
                name="content"
                placeholder="Nhập link nội dung (URL)"
                defaultValue={initialData?.content && !initialData.content.endsWith('.pdf') ? initialData.content : ''}
                className="w-full p-3 border cursor-pointer border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required={contentType === 'link'}
              />
            )}
          </div>

          {/* Contests checkboxes if provided */}
          {initialData?.contests && (
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Kỳ thi</label>
              <div className="flex flex-wrap gap-3">
                {selectedContests && initialData?.contests.map((el) => (
                  <label key={el._id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full cursor-pointer">
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
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700">{el.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Public checkbox */}
          <div>
            <label className="inline-flex items-center mt-2">
              <input
                type="checkbox"
                name="public"
                className="form-checkbox h-5 w-5 text-blue-600"
                defaultChecked={initialData?.public || false}
              />
              <span className="ml-2 text-gray-700 font-semibold">Công khai (public)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end items-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full font-semibold transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow transition cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
