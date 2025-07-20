import React, { useEffect, useState } from 'react';

function Pokemon(){
    const[pokemon,setPokemon] = useState(null);
    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
            .then(response=>{
                if(!response.ok){
                    throw new Error('データの取得に失敗しました');
                }
                return response.json();
            })
            .then(data=>{
                setPokemon(data);
                })
            .catch(error=>{
               console.error('エラー',error);
            });
        }, []);

    if (!pokemon) {
        return <p>読み込み中...</p>;
    }

    return (
        <div>
            <b>ポケモン情報</b>
            <p>{pokemon.name}</p>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <b>データ</b>
            <p>高さ{pokemon.height}</p>
            <p>重さ:{pokemon.weight}</p>
            <p>タイプ: {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p>特性: {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            <p>ステータス:</p>
            <ul>
                {pokemon.stats.map(s => (
                    <li key={s.stat.name}>
                        {s.stat.name}: {s.base_stat}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Pokemon;
