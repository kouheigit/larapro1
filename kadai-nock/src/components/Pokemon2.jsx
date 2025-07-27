import React,{ useEffect,useState }from'react';
import Pokemon1 from "./Pokemon1.jsx";

function Pokemon2() {
    //  const[pokemon,setPokemon] = useState(null);
    const[pokemon,setPokemon] = useState(null);
    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
            .then(res=>res.json())
            .then(data=>setPokemon(data))
            .catch(err => console.error('取得失敗',err));
    },[]);

    if (!pokemon) return <p>読み込み中...</p>;
    
   return(
       <div>

       </div>
   );

}
export default Pokemon1;