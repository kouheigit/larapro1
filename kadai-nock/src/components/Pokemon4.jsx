import React, { useState } from 'react';

function Pokemon4() {
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchPokemon = async () => {
        if (!searchTerm.trim()) {
            setError('ポケモン名を入力してください');
            return;
        }

        setLoading(true);
        setError('');
        setPokemon(null);

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
            
            if (!response.ok) {
                throw new Error('ポケモンが見つかりません');
            }

            const pokemonData = await response.json();
            setPokemon(pokemonData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchPokemon();
        }
    };

    return (
        <div>
            <h1>ポケモン検索</h1>
            
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="ポケモン名を英語で入力 (例: pikachu)"
                />
                <button onClick={searchPokemon} disabled={loading}>
                    {loading ? '検索中...' : '検索'}
                </button>
            </div>

            {error && <p style={{color: 'red'}}>{error}</p>}

            {pokemon && (
                <div>
                    <h2>{pokemon.name} (#{pokemon.id})</h2>
                    
                    <img 
                        src={pokemon.sprites.front_default} 
                        alt={pokemon.name}
                        width="150"
                        height="150"
                    />
                    
                    <h3>基本情報</h3>
                    <ul>
                        <li>身長: {(pokemon.height / 10).toFixed(1)} m</li>
                        <li>体重: {(pokemon.weight / 10).toFixed(1)} kg</li>
                        <li>基礎経験値: {pokemon.base_experience}</li>
                    </ul>

                    <h3>タイプ</h3>
                    <ul>
                        {pokemon.types.map((type, index) => (
                            <li key={index}>{type.type.name}</li>
                        ))}
                    </ul>

                    <h3>特性</h3>
                    <ul>
                        {pokemon.abilities.map((ability, index) => (
                            <li key={index}>
                                {ability.ability.name}
                                {ability.is_hidden && ' (隠れ特性)'}
                            </li>
                        ))}
                    </ul>

                    <h3>ステータス</h3>
                    <ul>
                        {pokemon.stats.map((stat, index) => (
                            <li key={index}>
                                {stat.stat.name}: {stat.base_stat}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Pokemon4;
