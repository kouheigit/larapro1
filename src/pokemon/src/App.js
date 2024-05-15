import './App.css';
//STEP5 useStateで状態管理からスタート
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
                const names = [
                    data.result[0].name,
                    data.result[1].name,
                    data.result[2].name,
                ]
                setPokemonNames(names);
            })
    },[])
//test
  return (
      <div className="app-container">
          <h1>ポケモン図鑑</h1>
          <div classNmae='pokemon-container'>
              <div className='all-container'>
                  <PokemonThumbnails
                      id={pokemon[0].id}
                      name={pokemonNames[0]}
                      image={pokemon[0].image}
                      type={pokemon[0].type}
                  />
                  <PokemonThumbnails
                      id={pokemon[1].id}
                      name={pokemonNames[1]}
                      image={pokemon[1].image}
                      type={pokemon[1].type}
                  />
                  <PokemonThumbnails
                      id={pokemon[2].id}
                      name={pokemonNames[2]}
                      image={pokemon[2].image}
                      type={pokemon[2].type}
                  />
              </div>
          </div>
      </div>
  );
}

export default App;
