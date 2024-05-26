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

    ]


  return (
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
