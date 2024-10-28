import React from 'react';
import { useLocation } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

const Insight = () => {
  const location = useLocation();
  const { pokemon } = location.state || {};

  // If there's no pokemon data, show a message
  if (!pokemon) {
    return <p>No Pokémon selected. Please go back and select a Pokémon.</p>;
  }

  // Prepare the stats data for Recharts
  const statsData = pokemon.stats.map(stat => ({
    name: stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1),
    value: stat.base_stat,
  }));

  // Get formatted Pokémon details
  const types = pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ');
  const abilities = pokemon.abilities.map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(', ');
  const weight = pokemon.weight / 10; // Weight is in decagrams, so convert to kg

  return (
    <div className="Insight">
      <h1>Stats for {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
      
      <div className="pokemon-details">
        <p><strong>Type:</strong> {types}</p>
        <p><strong>Abilities:</strong> {abilities}</p>
        <p><strong>Weight:</strong> {weight} kg</p>
      </div>

      <RadarChart
        cx="50%" cy="50%" outerRadius="80%" width={500} height={400}
        data={statsData}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar name="Stats" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </div>
  );
};

export default Insight;