import './App.css';
import { useEffect, useState  } from "react";
import PokemonThumbnails from "./PokemonThumbnails";

function App() {

    const [allPokemons, setAllPokemons] = useState([]);

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

    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");
    // 仮でフシギダネのURLを使用する
    const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/bulbasaur"


    const getAllPokemons = () => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.results)
                setAllPokemons(data.results);
                createPokemonObject(data.results);
                setUrl(data.next);
            })
    }

    const createPokemonObject = (results) => {
            results.forEach(pokemon => {
                  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
                     fetch(pokemonUrl)
                         .then(res => res.json())
                         .then(data => {
                          const image = data.sprites.other["official-artwork"].front_default;
                          const type = data.types[0].type.name;
                          console.log(data.name, image, type);
                        })
                })
          }
    /*
    const createPokemonObject = () =>{
        fetch(pokemonUrl)
            .then(response => response.json)
            .then(data =>{
                console.log(data);
                console.log(data.sprites.other["official-artwork"].front_default);
                console.log(data.types[0].type.name);
            })
    }*/
    useEffect(()=> {
        getAllPokemons();
    },[])


  return (
    <div className="App">
        <div className='pokemon-container'>
            <div className='all-container'>
                {pokemons.map((pokemon, index) => (
                    <PokemonThumbnails
                        id={pokemon.id}
                        // 初回レンダリングの際にエラーになるので、オプショナルチェーン(?)をつける
                        name={allPokemons[index]?.name}
                        image={pokemon.image}
                        type={pokemon.type}
                        key={index}
                    />
                ))}
            </div>
        </div>
    </div>
  );
}

export default App;
