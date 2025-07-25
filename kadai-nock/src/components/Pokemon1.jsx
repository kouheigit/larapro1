import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
                const results = res.data.results;

                // 各ポケモンの詳細を並列取得
                const detailedList = await Promise.all(
                    results.map(pokemon => axios.get(pokemon.url).then(res => res.data))
                );

                setPokemonList(detailedList);
            } catch (err) {
                console.error('取得失敗:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonList();
    }, []);

    if (loading) return <p>読み込み中...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>ポケモン一覧</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {pokemonList.map(pokemon => (
                    <div key={pokemon.id} style={{ border: '1px solid #ccc', padding: '10px', width: '150px' }}>
                        <h4>{pokemon.name}</h4>
                        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;