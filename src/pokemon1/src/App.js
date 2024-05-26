import './App.css';
import PokemonThumbnails from './PokemonThumbnails';


function App() {
    const pokemon = [
        {
            id: 1,
            name: "フシギダネ",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            tyep:"くさ"
        },
        {
            id:2,
            name:"フシギソウ",
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            type: "くさ"
        },
        {
            id:3,
            name:"フシギバナ",
            image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
            type:"くさ"
        },
    ]


  return (
      //STEP4 pokeAPIからデータを取得する
    <div className="App">
        <PokemonThumbnails
        id={pokemon.id}
        name={pokemon.name}
        image={pokemon.image}
        tyep={pokemon.type}
        />
    </div>
  );
}

export default App;
