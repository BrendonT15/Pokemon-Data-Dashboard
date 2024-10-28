import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import PokeCard from './components/PokeCard';
import './App.css';
import About from './routes/About';
import Insight from './routes/Insight';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();

        const detailedPokemonList = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const pokemonData = await response.json();
            return pokemonData;
          })
        );

        setPokemonList(detailedPokemonList);
        setFilteredPokemon(detailedPokemonList);

        if (detailedPokemonList.length > 0) {
          setPokemon(detailedPokemonList[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPokemonList();
  }, []);

  const handleClick = (selectedPokemon) => {
    setPokemon(selectedPokemon);
    navigate('/insight', { state: { pokemon: selectedPokemon } });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = pokemonList.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(value);
      const typeMatch = pokemon.types.some(type => type.type.name.toLowerCase().includes(value));
      return nameMatch || typeMatch;
    });

    setFilteredPokemon(filtered);
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            {pokemon && (
              <div className="poke-card-container">
                <PokeCard info={pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} cardType="Name" />
                <PokeCard info={pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ')} cardType="Type" />
                <PokeCard info={pokemon.abilities.map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(', ')} cardType="Abilities" />
              </div>
            )}
            <div className="input-container">
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="content">
              {filteredPokemon.length > 0 ? (
                <div>
                  <ul>
                    <li><strong>Name</strong></li>
                    <li><strong>Type</strong></li>
                    <li><strong>Abilities</strong></li>
                    <li><strong>Weight</strong></li>
                  </ul>
                  {filteredPokemon.map((pokemon, index) => (
                    <div key={index} className="pokemon-info" onClick={() => handleClick(pokemon)}>
                      {pokemon.sprites?.front_default && <img src={pokemon.sprites.front_default} alt={pokemon.name} />}
                      <p><strong>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</strong></p>
                      <p>Type: {pokemon.types.map(type => type.type.name).join(', ')}</p>
                      <p>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                      <p>Weight: {pokemon.weight} kg</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Pokémon found.</p>
              )}
            </div>
          </>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/insight" element={<Insight />} />
      </Routes>
    </div>
  );
}

export default App;