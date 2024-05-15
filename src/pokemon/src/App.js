import './App.css';
//STEP5 useStateで状態管理からスタート
//開始
//useEffect,useStateを追加している
import { useEffect, useState} from "react";
import PokemonThumbnails from "./PokemonThumbnails";

function App() {
    //useStateを追加している途中
    const [pokemonNames, setPokemonNames] = useState([]);
    const pokemon = [
        {
        id:1,
        name:"フシギダネ",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        type:"くさ",
        },
        {
            id: 2,
            name: "フシギソウ",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            type: "くさ"
        },
        {
            id: 3,
            name:"フシギバナ",
            image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
            type: "くさ",
        }
    ];

    // const urlを追加している
    const url = "https://pokeapi.co/api/v2/pokemon";

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.results[0].name);
                const names = [
                        data.results[0].name,
                        data.results[1].name,
                        data.results[2].name,
                ]
                setPokemonNames(names);
            })
    }, [])


  return (
      <div className="app-container">
          <h1>ポケモン図鑑</h1>
          <div classNmae='pokemon-container'>
              <div className='all-container'>
                  <PokemonThumbnails
                      id={pokemon[0].id}
                      name={pokemon[0].name}
                      image={pokemon[0].image}
                      type={pokemon[0].type}
                  />
                  <PokemonThumbnails
                      id={pokemon[1].id}
                      name={pokemon[1].name}
                      image={pokemon[1].image}
                      type={pokemon[1].type}
                  />
                  <PokemonThumbnails
                      id={pokemon[2].id}
                      name={pokemon[2].name}
                      image={pokemon[2].image}
                      type={pokemon[2].type}
                  />
              </div>
          </div>
      </div>
  );
}

export default App;
