"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Note {
    _id: string;
    title: string;
    summary: string;
    tags: string[];
}

export default function Dashboard() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
    
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/notes/${id}`, {
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
                const res = await axios.get(`http://localhost:5000/api/notes?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(res.data.notes);
            setTotalPages(res.data.pages);
           } catch (err) {
                router.push('/signin');
           }
        };
        fetchNotes();
    }, [page]);

    return (
       <div className="container mx-auto p-4">
        <h1 className="text-3xl mb-4">Your Notes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
                <div key={note._id} className="border p-4 rounded">
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
           <div className="mt-4">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="mr-2 p-2 bg-gray-200">
                Previous
            </button>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="p-2 bg-gray-200">
                Next
            </button>
           </div>
           <button onClick={() => router.push('/note/new')} className="mt-4 bg-blue-500 text-white p-2">
                Create Note
           </button>
        </div>
    );
}