import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Update({ chat }) {
  const [titre, setTitre] = useState(chat.titre);
  const [description, setDescription] = useState(chat.description);
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    const newImage = event.target.files[0];
    setImage(newImage);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (image) {
      // Upload the new image and get the new image name
      const { data, error } = await supabase.storage.from('images').upload(`images/${image.name}`, image);
      if (error) {
        console.error(error);
        return;
      }

      const newItem = { titre, description, image_name: image.name };
      // Update the chat with the new item
      const { data: chatData, error: chatError } = await supabase
        .from('chat')
        .update(newItem)
        .match({ id: chat.id });

      if (chatError) {
        console.error(chatError);
        return;
      }

      setTitre('');
      setDescription('');
      setImage(null);
    } else {
      const newItem = { titre, description };
      // Update the chat with the new item
      const { data: chatData, error: chatError } = await supabase
        .from('chat')
        .update(newItem)
        .match({ id: chat.id });

      if (chatError) {
        console.error(chatError);
        return;
      }

      setTitre('');
      setDescription('');
    }
  }

  return (
    <div>
      <h1>Update Chat</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Titre :
          <input type="text" value={titre} onChange={(event) => setTitre(event.target.value)} />
        </label>
        <br />
        <label>
          Description :
          <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <br />
        <label>
          Image :
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
     
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { data: chat, error } = await supabase.from('chat').select('*').eq('id', id).single();

  if (!chat) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      chat,
    },
  };
}
