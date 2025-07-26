import React,{ useEffect,useState }from 'react';

//pokemon1
function Pokemon1(){
    const[pokemon,setPokemon] = useState(null);
    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
            .then(res => res.json())
            .then(data => setPokemon(data))
            .catch(err => console.error('取得失敗',err));
    },[]);


    if (!pokemon) return <p>読み込み中...</p>;

    return(
        <div style={{ padding: '20px' }}>
            <b>（ID: {pokemon.id}）{pokemon.name.toUpperCase()}</b>
            <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
            <p><strong>タイプ:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>高さ:</strong> {pokemon.height}</p>
            <p><strong>重さ:</strong> {pokemon.weight}</p>
        </div>
    );
}
export default Pokemon1;


