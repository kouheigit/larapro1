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
        <div>

        </div>
    );
}
export default Pokemon1;




