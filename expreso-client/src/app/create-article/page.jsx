'use client';
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import Toolbar from '../../components/Toolbar';
import PostForm from '../../components/PostForm';
import axios from "axios"

export default function CreateArticle() {
  const [post, setPost] = useState({
    title: '',
    author: '',
    tags: '',
    content: '',
    images: [],
  });

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleImageUpload_t1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handlePaste = async (event) => {
    event.preventDefault(); // Prevent default paste behavior

    // Ensure clipboardData exists
    const clipboardData = event.clipboardData || window.clipboardData;
    if (!clipboardData) {
        console.error("❌ Clipboard data is unavailable");
        return;
    }

    const items = clipboardData.items;
  
    for (let item of items) {
        if (item.type.startsWith("image")) {
            const file = item.getAsFile();
            if (file) {
                console.log("📌 Pasted image detected:", file);

                // Convert file to base64 before uploading
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64Image = reader.result;

                    // Upload base64 image to Cloudinary
                    const imageUrl = await uploadImageToBackend(base64Image);
                    
                    if (imageUrl) {
                        console.log("✅ Image uploaded to Cloudinary:", imageUrl);

                        // Insert image into the editor
                        editor.chain().focus().setImage({ src: imageUrl }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }
};


  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false }),
      ImageResize.configure({ inline: true, allowBase64: true, minWidth: 100, maxWidth: 800,
        onResize: ({ width, height, node }) => {
          const newSrc = node.attrs.src;
          editor.chain().focus().setImage({ src: newSrc, width, height }).run();
        },
       }),
    ],
    content: '<p>Share your day.....</p>',
    onUpdate: ({ editor }) => {
      setPost((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps:{
      handlePaste,
    }
  });


  const uploadImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPost((prev) => ({
        ...prev,
        images: [...prev.images, base64],
      }));
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

  console.log("file",file)
  if (!editor) {
    console.error("❌ Editor instance not available yet!");
    return;
}
    const formData = new FormData();
    formData.append("images", file); // Append image file
  
    console.log("FormDtaa",formData);
    try {
      const response = await axios.post("http://localhost:5050/api/blogs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Important for file upload
      });
      console.log("res",response);
      console.log("repons url",response.data.data.url);
  
      if (response.success=== true && response.data.data.url) {
        const imageUrl = response.data.data.url;
        console.log("✅ Image uploaded successfully:", imageUrl);


          editor.chain().focus().setImage({ src: imageUrl }).run();

          editor.commands.setContent(editor.getHTML());
        // Insert the image into the editor
        // editor.chain().focus().setImage({ src: imageUrl, width: 400, height: 300  }).run();
        console.log("✅ Image inserted into the editor");

      }
    } catch (error) {
      console.error("❌ Error uploading image:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Blog Submitted:', post);

    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = post.content;
      const imgTags = tempDiv.getElementsByTagName("img");

      const imageUploadPromises= [];
      const imageMap = {};

      for(let img of imgTags){
        if(img.src.startsWith("data:image")){
          const uploadPromise = uploadImageToBackend(img.src)
              .then((url)=>{
                imageMap[img.src] = url;
                return url;
              })
              .catch((error)=>{
                console.error("❌ Image upload failed:", error.message);
            return null;
              })

              imageUploadPromises.push(uploadPromise);
        }
      }

      const uploadedImages = await Promise.all(imageUploadPromises);
    const filteredImages = uploadedImages.filter((url) => url);

    let updatedContent = post.content;

    for (let base64 in imageMap) {
      updatedContent = updatedContent.replace(base64, imageMap[base64]); // Replace in content
    }

    // Step 5: Send data to backend with Axios
    const finalPost = {
      title: post.title,
      author: post.author,
      tags: post.tags,
      content: updatedContent, // Updated content with URLs
      images: filteredImages, // Array of uploaded image URLs
    };

    console.log("📝 Final Post:", finalPost);

    // const response = await axios.post("/api/blogs", finalPost, {
    //   headers: { "Content-Type": "application/json" },
    //   withCredentials: true, // Ensure cookies (for auth) are sent
    // });

    // console.log("✅ Blog submitted successfully:", response.data);

    } catch (error) {
      console.error("❌ Error submitting blog:", error.response?.data || error.message);
    }
  };

  const uploadImageToBackend = async (base64Image) => {
    try {
      const response = await axios.post(
        "/api/upload",
        { images: base64Image },
      );
  
      if (response.status !== 200 || !response.data.secure_url) {
        throw new Error("Invalid Cloudinary response");
      }
  
      return response.data.secure_url; // Return uploaded image URL
    } catch (error) {
      console.error("❌ Backend Upload Error:", error.response?.data || error.message);
      return null;
    }
  };
  

  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      
      <div className="bg-white text-black rounded-lg p-2 mt-6">
        <Toolbar editor={editor} handleImageUpload={handleImageUpload} />
        <EditorContent
          editor={editor}
          className="border border-gray-300 rounded-b-lg p-2 min-h-[400px]"
        />
      </div>
      <PostForm
        post={post}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

<button onClick={() => editor?.chain().focus().setImage({ src: "https://res.cloudinary.com/dj74kplhx/image/upload/v1743528646/blog_images/kqjq7f0b4m0joqztjptc.png" }).run()}>
    Insert Test Image
</button>

      
    </div>
  );
}