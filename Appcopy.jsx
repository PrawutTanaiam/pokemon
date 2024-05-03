import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pokemonName) {
      fetchPokemonData();
    }
  }, [pokemonName]);

  const fetchPokemonData = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      const data = await response.json();
      setPokemonData(data);
    } catch (error) {
      setError('Pokemon not found');
    }
  };

  const handleInputChange = (event) => {
    setPokemonName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPokemonData(null);
    setError(null);
  };

  return (
    <div className="App">
      <h1>Pokemon Search</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Pokemon Name:
          <input type="text" value={pokemonName} onChange={handleInputChange} />
        </label>
        <button type="submit">Search</button>
      </form>
      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}
      {pokemonData && (
        <div>
          <h2>{pokemonData.name}</h2>
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
          <h3>Height: {pokemonData.height}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
