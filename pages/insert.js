import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Create() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    const newImage = event.target.files[0];
    setImage(newImage);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('image', image);

    const { data, error } = await supabase.storage.from('images').upload(`images/${image.name}`, image);
    if (error) {
      console.error(error);
      return;
    }

    const newItem = { titre, description, image_name: image.name };

    await supabase.from('chat').insert(newItem);
    setTitre('');
    setDescription('');
    setImage(null);
  }

  return (
    <div>
      <h1>Create Todo</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Titre :
          <input type="text" value={titre} onChange={event => setTitre(event.target.value)} />
        </label>
        <br />
        <label>
          Description :
          <input type="text" value={description} onChange={event => setDescription(event.target.value)} />
        </label>
        <br />
        <label>
          Image :
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
