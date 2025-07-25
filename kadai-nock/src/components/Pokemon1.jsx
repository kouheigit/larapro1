import React,{ useEffect,useState }from 'react';

function Pokemon1(){
    const[pokemon,setPokemon] = useState(null);
    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
            .then(res => res.json())
            .then(data => setPokemon(data))
            .catch(err => console.error('取得失敗',err));
    },[]);
    return(
        <div style={{ padding: '20px' }}>
            <b>ポケモン情報</b>
            {pokemon ? (
                <div>
                    <h2>{pokemon.name.toUpperCase()}（ID: {pokemon.id}）</h2>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <p>タイプ: {pokemon.types.map(t => t.type.name).join(', ')}</p>
                </div>
            ) : (
                <p>読み込み中...</p>
            )}
        </div>
    );
}
export default Pokemon1;


/*
import React, { useEffect, useState } from 'react';

function App() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
      .then(res => res.json())
      .then(data => setPokemon(data))
      .catch(err => console.error('取得失敗:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>ピカチュウ情報</h1>
      {pokemon ? (
        <div>
          <h2>{pokemon.name.toUpperCase()}（ID: {pokemon.id}）</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>タイプ: {pokemon.types.map(t => t.type.name).join(', ')}</p>
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
}

export default App;
*/

