import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@tailwindui/react';
import { useRouter } from 'next/router';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Index() {
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTodos() {
      const { data } = await supabase.from('chat').select('*');
      setTodos(data);
    }

    fetchTodos();
  }, []);

  const handleUpdateClick = (id) => {
    router.push(`/update/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const { error } = await supabase.from('chat').delete().eq('id', id);

    if (!error) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <>
      <p className="text-gray-700 text-3xl mb-16 font-bold">Dashboard</p>
      <div className="grid lg:grid-cols-3 gap-5 mb-16">


       
        {todos.map((todo) => (
              <div key={todo.id} className="w-72 h-fit group">
    <div className="relative overflow-hidden">
              <img  className="h-96 w-full object-cover" src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/images/${todo.image_name}`} alt={todo.titre} />
              <div className="absolute h-full w-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className='text-white py-2 px-5'>{todo.titre}</p>
              <button onClick={() => handleUpdateClick(todo.id)} className="bg-black text-white py-2 px-5">Modifier</button>
              <button onClick={() => handleDeleteClick(todo.id)} className="bg-danger text-white py-2 px-5">Supprimer</button>
            </div>
            </div>
            </div>
        ))}
      
      </div>
    </>
  );
}
