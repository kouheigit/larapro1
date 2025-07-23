import React, { useState } from 'react';

function PokemonDex() {
    const [pokemon, setPokemon] = useState(null);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    //serchPokemon
    const searchPokemon = () => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
            .then(response => {
                if (!response.ok) throw new Error('データの取得に失敗しました');
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
    };

    return (
        <div style={{ backgroundColor: '#e53935', minHeight: '100vh', padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: 'white', textAlign: 'center' }}>ポケモン図鑑</h1>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="名前または図鑑番号を入力（例：pikachu, 25）"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        width: '250px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: 'none'
                    }}
                />
                <button
                    onClick={searchPokemon}
                    style={{
                        marginLeft: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#1a237e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}
                >
                    🔍検索
                </button>
                {error && <p style={{ color: 'yellow', marginTop: '0.5rem' }}>{error}</p>}
            </div>

            {pokemon && (
                <div
                    style={{
                        display: 'flex',
                        maxWidth: '800px',
                        margin: '0 auto',
                        backgroundColor: '#212121',
                        color: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                    }}
                >
                    {/* 左画面 */}
                    <div style={{ flex: 1, padding: '1.5rem', borderRight: '2px solid #424242' }}>
                        <h2 style={{ fontSize: '24px' }}>No.{pokemon.id} {pokemon.name.toUpperCase()}</h2>
                        <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '150px' }} />
                        <p style={{ marginTop: '1rem' }}>タイプ: {pokemon.types.map(t => t.type.name).join(', ')}</p>
                        <audio controls style={{ marginTop: '1rem', width: '100%' }}>
                            <source src={pokemon.cries.latest} type="audio/ogg" />
                            音声がサポートされていません。
                        </audio>
                    </div>

                    {/* 右画面 */}
                    <div style={{ flex: 1, padding: '1.5rem' }}>
                        <h3 style={{ borderBottom: '1px solid #fff', paddingBottom: '0.5rem' }}>基本データ</h3>
                        <p>高さ: {pokemon.height / 10} m</p>
                        <p>重さ: {pokemon.weight / 10} kg</p>
                        <p>特性: {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>

                        <h3 style={{ borderBottom: '1px solid #fff', marginTop: '1rem', paddingBottom: '0.5rem' }}>ステータス</h3>
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {pokemon.stats.map(stat => (
                                <li key={stat.stat.name}>
                                    <span style={{ display: 'inline-block', width: '80px' }}>{stat.stat.name}</span>
                                    <span style={{ display: 'inline-block', width: '40px' }}>{stat.base_stat}</span>
                                    <div style={{
                                        display: 'inline-block',
                                        height: '10px',
                                        width: `${stat.base_stat}px`,
                                        backgroundColor: '#4caf50',
                                        borderRadius: '5px'
                                    }}></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PokemonDex;
