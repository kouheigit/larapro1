import './App.css';
//STEP5 useStateで状態管理からスタート
//useEffect,useStateを追加している
import { useEffect, useState} from "react";
import PokemonThumbnails from "./PokemonThumbnails";

function App() {
    //useStateを追加している途中
    const [pokemonNames, setPokemonNames] = useState([]);
    const pokemons = [
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

    useEffect(() =>{
        //fetch urlでurlを読み込む
        fetch(url)
            //urlの情報をjsonに変更する
            .then(res => res.json())
            //dataという配列に格納している
            .then(data => {
                //Logを出力している
                //デバック出力
                /*
                console.log(data);
                setData(data);*/
                console.log(data.results[0].name);
                //namesの配列にnameを格納する
                //result配列の中のnameをconst namesの中に格納する
                const names = [
                    data.result[0].name,
                    data.result[1].name,
                    data.result[2].name,
                ]
                setPokemonNames(names);
            })
    },[])
    //map関数で処理する
    //mapの中のindexは配列の数にあたる
  return (
      <div className="app-container">
          <h1>ポケモン図鑑</h1>
          <div classNmae='pokemon-container'>
              <div className='all-container'>
                  {pokemons.map((pokemon,index) => (
                      <PokemonThumbnails
                      id={pokemons.id}
                      name={pokemonNames[index]}
                      image={pokemon.image}
                      type={pokemon.type}
                      key={pokemon.key}
                      />
                  ))}
              </div>
          </div>
      </div>
  );
}

export default App;
