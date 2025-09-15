import React, { useState, useEffect } from 'react';

function Pokemon3() {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // ポケモン一覧を取得
    const fetchPokemonList = async (offsetValue = 0, append = false) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offsetValue}`);
            if (!response.ok) throw new Error('データの取得に失敗しました');
            
            const data = await response.json();
            
            if (append) {
                setPokemonList(prev => [...prev, ...data.results]);
            } else {
                setPokemonList(data.results);
            }
            
            setHasMore(data.next !== null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 個別ポケモンの詳細データを取得
    const fetchPokemonDetails = async (pokemonName) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) throw new Error('ポケモンの詳細データの取得に失敗しました');
            
            const data = await response.json();
            setSelectedPokemon(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 検索機能
    const handleSearch = () => {
        if (searchTerm.trim()) {
            fetchPokemonDetails(searchTerm.toLowerCase());
        }
    };

    // もっと見る機能
    const loadMore = () => {
        const newOffset = offset + 20;
        setOffset(newOffset);
        fetchPokemonList(newOffset, true);
    };

    // 初期データ読み込み
    useEffect(() => {
        fetchPokemonList();
    }, []);

    // 検索結果のフィルタリング
    const filteredPokemonList = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ 
            backgroundColor: '#f5f5f5', 
            minHeight: '100vh', 
            padding: '2rem',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ 
                    textAlign: 'center', 
                    color: '#333',
                    marginBottom: '2rem',
                    fontSize: '2.5rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>
                    🎮 ポケモン図鑑 3.0
                </h1>

                {/* 検索バー */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '2rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <input
                        type="text"
                        placeholder="ポケモン名または図鑑番号を入力（例：pikachu, 25）"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{
                            padding: '0.8rem',
                            width: '300px',
                            fontSize: '16px',
                            borderRadius: '25px',
                            border: '2px solid #ddd',
                            outline: 'none',
                            transition: 'border-color 0.3s'
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        style={{
                            marginLeft: '1rem',
                            padding: '0.8rem 1.5rem',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? '🔍検索中...' : '🔍検索'}
                    </button>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        ❌ {error}
                    </div>
                )}

                {/* ポケモン詳細表示 */}
                {selectedPokemon && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '3px solid #ff6b6b'
                    }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                            {/* 左側：基本情報 */}
                            <div style={{ flex: '1', minWidth: '300px' }}>
                                <h2 style={{ 
                                    color: '#333',
                                    fontSize: '2rem',
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}>
                                    No.{selectedPokemon.id} {selectedPokemon.name.toUpperCase()}
                                </h2>
                                
                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <img 
                                        src={selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default} 
                                        alt={selectedPokemon.name}
                                        style={{ 
                                            width: '200px',
                                            height: '200px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>

                                {/* タイプ */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>タイプ</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {selectedPokemon.types.map((type, index) => (
                                            <span key={index} style={{
                                                backgroundColor: '#4ecdc4',
                                                color: 'white',
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '15px',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {type.type.name.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 鳴き声 */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>鳴き声</h3>
                                    <audio controls style={{ width: '100%' }}>
                                        <source src={selectedPokemon.cries.latest} type="audio/ogg" />
                                        音声がサポートされていません。
                                    </audio>
                                </div>
                            </div>

                            {/* 右側：詳細データ */}
                            <div style={{ flex: '1', minWidth: '300px' }}>
                                <h3 style={{ 
                                    color: '#333',
                                    borderBottom: '2px solid #ff6b6b',
                                    paddingBottom: '0.5rem',
                                    marginBottom: '1rem'
                                }}>
                                    基本データ
                                </h3>
                                
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p><strong>高さ:</strong> {selectedPokemon.height / 10} m</p>
                                    <p><strong>重さ:</strong> {selectedPokemon.weight / 10} kg</p>
                                    <p><strong>特性:</strong> {selectedPokemon.abilities.map(a => a.ability.name).join(', ')}</p>
                                </div>

                                <h3 style={{ 
                                    color: '#333',
                                    borderBottom: '2px solid #ff6b6b',
                                    paddingBottom: '0.5rem',
                                    marginBottom: '1rem'
                                }}>
                                    ステータス
                                </h3>
                                
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {selectedPokemon.stats.map(stat => (
                                        <div key={stat.stat.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ 
                                                minWidth: '80px', 
                                                fontWeight: 'bold',
                                                color: '#666'
                                            }}>
                                                {stat.stat.name}
                                            </span>
                                            <span style={{ 
                                                minWidth: '40px',
                                                fontWeight: 'bold',
                                                color: '#333'
                                            }}>
                                                {stat.base_stat}
                                            </span>
                                            <div style={{
                                                flex: 1,
                                                height: '15px',
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${Math.min(stat.base_stat / 2, 100)}%`,
                                                    backgroundColor: stat.base_stat > 100 ? '#4caf50' : stat.base_stat > 80 ? '#8bc34a' : '#ffc107',
                                                    borderRadius: '8px',
                                                    transition: 'width 0.5s ease'
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ポケモン一覧表示 */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    padding: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ 
                        color: '#333',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        📋 ポケモン一覧
                    </h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        {(searchTerm ? filteredPokemonList : pokemonList).map((pokemon, index) => (
                            <div
                                key={pokemon.name}
                                onClick={() => fetchPokemonDetails(pokemon.name)}
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '10px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    ':hover': {
                                        backgroundColor: '#e9ecef',
                                        borderColor: '#ff6b6b'
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#e9ecef';
                                    e.target.style.borderColor = '#ff6b6b';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                    e.target.style.borderColor = '#e9ecef';
                                }}
                            >
                                <h3 style={{ 
                                    color: '#333',
                                    fontSize: '1rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    {pokemon.name.toUpperCase()}
                                </h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                    No.{offset + index + 1}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* もっと見るボタン */}
                    {hasMore && !searchTerm && (
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                style={{
                                    padding: '1rem 2rem',
                                    backgroundColor: '#4ecdc4',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    fontSize: '1.1rem'
                                }}
                            >
                                {loading ? '読み込み中...' : 'もっと見る'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Pokemon3;
