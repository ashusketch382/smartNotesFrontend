"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function EditNote() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id !== 'new') {
      const fetchNote = async () => {
        const token = localStorage.getItem('token');
        console.log('Fetching note with ID:', id);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Note fetched:', res.data);
        setTitle(res.data.title);
        setTags(res.data.tags.join(', '));
        const contentState = convertFromRaw(JSON.parse(res.data.content));
        setEditorState(EditorState.createWithContent(contentState));
      };
      fetchNote();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const noteData = { title, content, tags: tags.split(',').map((tag) => tag.trim()) };
    console.log('Submitting note data:', noteData);
    try {
      if (id === 'new') {
        console.log(noteData);
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, noteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/notes/${id}`, noteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      router.push('/dashboard');
    } catch (err) {
      console.error('Error submitting note:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">{id === 'new' ? 'Create Note' : 'Edit Note'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 p-2 border w-full"
        />
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="mb-4 border"
          editorClassName="p-2 h-40"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mb-4 p-2 border w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Save
        </button>
      </form>
    </div>
  );
}
