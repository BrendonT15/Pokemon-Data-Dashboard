import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar'; // Assuming you have a Navbar component
import PokeCard from './components/PokeCard'; // Assuming you have a PokeCard component
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([]); // List of all Pokémon
  const [filteredPokemon, setFilteredPokemon] = useState([]); // List of filtered Pokémon based on search
  const [pokemon, setPokemon] = useState(null); // Currently selected Pokémon
  const [searchTerm, setSearchTerm] = useState(''); // Current search term

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
        setFilteredPokemon(detailedPokemonList); // Initialize filtered list with all Pokémon

        if (detailedPokemonList.length > 0) {
          setPokemon(detailedPokemonList[0]); // Set first Pokémon as the selected one
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPokemonList();
  }, []);

  const handleClick = (selectedPokemon) => {
    setPokemon(selectedPokemon);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase(); // Get the search value in lowercase
    setSearchTerm(value); // Update the search term state

    // Filter Pokémon based on the name or type
    const filtered = pokemonList.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(value);
      const typeMatch = pokemon.types.some(type => type.type.name.toLowerCase().includes(value));
      return nameMatch || typeMatch;
    });

    setFilteredPokemon(filtered); // Update the filtered Pokémon list
  };

  return (
    <div className="App">
      <Navbar />
      {pokemon && (
        <div className="poke-card-container">
          <PokeCard 
            info={pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            cardType={"Name"}
          />
          <PokeCard 
            info={pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ')}
            cardType={"Type"}
          />
          <PokeCard 
            info={pokemon.abilities.map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(', ')}
            cardType={"Abilities"}
          />
        </div>
      )}
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Search Pokémon..." 
          value={searchTerm} 
          onChange={handleSearch} // Call handleSearch on input change
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
                {pokemon.sprites && pokemon.sprites.front_default ? <img src={pokemon.sprites.front_default} alt={pokemon.name} /> : null}
                <p><strong>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</strong></p>
                <p>Type: {pokemon.types.map(type => type.type.name).join(', ')}</p>              
                <p>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>          
                <p>Weight: {pokemon.weight} kg</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No Pokémon found.</p> // Change loading message if nothing is found
        )}
      </div>
    </div>
  );
}

export default App;