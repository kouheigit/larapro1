import './App.css';
import { useEffect } from "react";
import PokemonThumbnails from "./PokemonThumbnails";


function App() {
    const pokemons = [
        {
            id: 1,
            name: "フシギダネ",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            type: "くさ",
        },
        {
            id: 2,
            name: "フシギソウ",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            type: "くさ",
        },
        {
            id: 3,
            name: "フシギバナ",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            type: "くさ",
        }
    ]
    const url ="https://pokeapi.co/api/v2/pokemon";
    useEffect(()=> {
        fetch(url)
            .then(response => response.json)
            .then(data => {
                console.log(data);
            })
    },[])


  return (
    <div className="App">
        <div className='pokemon-container'>
            <div className='all-container'>
                
            </div>
        </div>
    </div>
  );
}

export default App;
