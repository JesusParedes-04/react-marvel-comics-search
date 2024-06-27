

import { useEffect, useState } from 'react';
import md5 from 'crypto-js/md5';

//Utilizamos dotenv con ReactVite para proteger las keys que Marvel brinda
const publicKey = import.meta.env.VITE_PUBLIC_KEY;
const privateKey = import.meta.env.VITE_PRIVATE_KEY;
const baseUrl = import.meta.env.VITE_URL;

const MarvelApi = () => {
  const [comics, setComics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const ts = new Date().getTime();
    const hash = md5(`${ts}${privateKey}${publicKey}`);
    let url = `${baseUrl}?apikey=${publicKey}&ts=${ts}&hash=${hash}`;

    //Si hay un término de búsqueda, se suma el parámetro titleStartsWith a la URL

    if (searchTerm) {
      url += `&titleStartsWith=${searchTerm}`;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();

    //Obtenida la respuesta del JSON, entramos a las propiedades de la API de Marvel 
    // para filtrar y que traigan las imágenes y los títulos q sean menores o igual a 52 caracteres.

        const filteredComics = data.data.results.filter(comic => 
          comic.images.length > 0 && comic.title.length <= 52);
        setComics(filteredComics);
      } catch (error) {
        console.error('Error fetch:', error);
      }
    };

    fetchData();
  }, [searchTerm]);

// Función que actualiza la búsqueda en el estado con el valor del input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>

      <input
        className='input'
        type="text"
        placeholder="Buscar comics..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="container">
      {/* Mapeo de cada cómic que me va a traer títulos e imágenes */}
        {comics.map(comic => (
          <div className='img-container' key={comic.id}>
            <h2>{comic.title}</h2>
            <img src={`${comic.images[0].path}.${comic.images[0].extension}`} alt={comic.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarvelApi;




