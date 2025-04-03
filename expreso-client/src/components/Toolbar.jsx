'use client';
import React from 'react';

const Toolbar = ({ editor, handleImageUpload }) => {
  if (!editor) return null;

  return (
    <div className="flex space-x-2 bg-gray-800 p-2 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn ${editor.isActive('bold') ? 'bg-gray-900' : 'bg-gray-600'}`}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`btn ${editor.isActive('italic') ? 'bg-gray-600' : ''}`}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`btn ${editor.isActive('underline') ? 'bg-gray-600' : ''}`}
      >
        U
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>Left</button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>Right</button>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="fileInput"
      />
      <button
        onClick={() => document.getElementById('fileInput').click()}
        className="btn cursor-pointer bg-gray-700"
      >
        Upload Image
      </button>

      <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
    </div>
  );
};

export default Toolbar;