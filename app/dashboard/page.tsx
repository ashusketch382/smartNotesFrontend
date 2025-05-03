"use client";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";

interface Note {
  _id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
}

export default function Dashboard() {
  const auth = useContext(AuthContext) as AuthContextType;
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user && !auth?.loading) {
      router.push('/signin');
    }
  }, [auth?.user, auth?.loading, router]);

  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notes/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notes?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes);
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    if(auth?.user) fetchNotes();
  }, [page, auth?.user]);

  if(auth?.loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg shadow-md mb-4">
        <div className="text-xl font-bold">Welcome, {auth?.user?.email}!</div>
        <button onClick={auth?.logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </header>
      <h1 className="text-3xl mb-4">Your Notes</h1>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="mb-4 p-2 border w-full"
      />
      <div className="grid grid-cols-1 gap-4">
        {notes.map((note) => (
          <div key={note._id} className="border p-4 rounded w-full">
            <h2 className="text-xl">{note.title}</h2>
            <p>{note.summary}</p>
            <p className="text-sm text-gray-500">{note.tags.join(', ')}</p>
            <button onClick={() => router.push(`/note/${note._id}`)} className="text-blue-500 mt-2">
              Edit
            </button>
            <button onClick={() => handleDelete(note._id)} className="text-red-500 mt-2 ml-2">
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="mr-2 p-2 bg-gray-200">
          Previous
        </button>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="p-2 bg-gray-200">
          Next
        </button>
      </div>
      <button onClick={() => router.push('/note/new')} className="mt-4 bg-blue-500 text-white p-2 w-full">
        Create Note
      </button>
    </div>
  );
}
