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
    return (
        <div>
            <h1>ポケモン情報</h1>
            {pokemon ? (
                <div>
                    <p>名前: {pokemon.name}</p>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <p>高さ: {pokemon.height}</p>
                    <p>重さ: {pokemon.weight}</p>
                </div>
            ) : (
                <p>読み込み中...</p>
            )}
        </div>
    );
}