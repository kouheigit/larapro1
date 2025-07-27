import React,{ useEffect,useState }from'react';

function Pokemon2() {
    //  const[pokemon,setPokemon] = useState(null);
    const[pokemon,setPokemon] = useState(null);
    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
    },[]);
   

   return(
       <div>

       </div>
   );

}