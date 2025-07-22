import React, { useEffect, useState } from 'react';
//Pokemon
function Pokemon() {
    const [pokemon, setPokemon] = useState(null);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    //useEffectを別のconst形式にする
    const searchPokemon = () => {
        fetch('https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}')
            .then(response => {
                if (!response.ok) {
                    throw new Error('データの取得に失敗しました');
                }
                return response.json();
            })
            .then(data => {
                setPokemon(data);
                setError(null);
            })
            .catch(error => {
                setPokemon(null);
                setError(error.message);
            });
    }

    {error && <p style={{ color: 'red' }}>{error}</p>}

    return (
        <div>
            <input type="text" placeholder="ポケモン名を英語で入力(例:pikachu)" value={name} onChange={(e)=>setName(e.target.value)} style={{ padding: '0.5rem', width: '200px' }}/>
            <button onClick={searchPokemon} style={{ marginLeft: '1rem' }}>
                検索
            </button>
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
            <p>鳴き声</p>
            <audio controls>
                <source src={pokemon.cries.latest} type="audio/ogg" />
                あなたのブラウザは audio タグをサポートしていません。
            </audio>
        </div>
    );
}
export default Pokemon;
