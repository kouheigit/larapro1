import './App.css';
//STEP5 useStateで状態管理からスタート
//useEffect,useStateを追加している
//開始
import { useEffect, useState} from "react";
import PokemonThumbnails from "./PokemonThumbnails";

function App() {
    //useStateを追加している途中
    const [allPokemons, setAllPokemons] = useState([]);
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

    //20件取得してくる
    const [url,setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");
    // const urlを追加している
    //関数化する

    //↓下記のものは消すな
    //spriteは画像関係を司どる
    //画像については"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    //stripe,other,official-artworkから出力する


    const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/bulbasaur"
    //ローディング処理
    //ローディング中の処理の追加
    const [isLoading, setIsLoading] = useState(false);

    const getAllPokemons = () =>{
        //ローディング中の追加
        setIsLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.result)
                setAllPokemons(data.results)
                createPokemonObject(data.results);
               // setUrl(data.text);
                //次の20件のURLをセットする
                setUrl(data.next);
            })
            //ローディング中の追加
            .finally(() => {
                setIsLoading(false);
            })
    }


    /*
     const createPokemonObject = (results) => {
+    results.forEach(pokemon => {
+      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
+      fetch(pokemonUrl)
+        .then(res => res.json())
+        .then(data => {
+          const image = data.sprites.other["official-artwork"].front_default;
+          const type = data.types[0].type.name;
+          console.log(data.name, image, type);
+        })
+    })
+  }
     */
    const createPokemonObject = (results) =>{
        results.forEach(pokemon => {
            const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
            fetch(pokemonUrl)
                .then(res => res.json())
                .then(data => {
                    const _image = data.sprites.other["official-artwork"].front_default;
                    const _type = data.types[0].type.name;
                    const newList = {
                        id: data.id,
                        name: data.name,
                        image: _image,
                        type: _type,
                    }
                    //既存のデータを展開し、新しいデータを追加する
                    setAllPokemons(currentList => [...currentList,newList]);
                })
        })
    }
    useEffect(() =>{
        getAllPokemons();
    },[])

   //下記のものはURLからJSONを取得してconsole.logにエラーを出力する例
    {/*
    const createPokemonObject = () => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.results[0].url); // 最初のポケモンのURLを表示
            })
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        createPokemonObject();
    }, []);*/}

//下記のものは処理が終わり次第これは消す
    {/*
    useEffect(() =>{
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.results[0].name);
                //namesの配列にnameを格納する
                //result配列の中のnameをconst namesの中に格納する
                const names = [
                    data.results[0].name,
                    data.results[1].name,
                    data.results[2].name,
                ]
                setPokemonNames(names);
            })
    },[])*/}



    //map関数で処理する
    //mapの中のindexは配列の数にあたる
    //indexはmap特有の関数で配列pokemonとは無関係
    //pokemonの配列を出力している
  return (
      <div className="app-container">
          <h1>ポケモン図鑑</h1>
          <div className='pokemon-container'>
              <div className='all-container'>
                  {allPokemons.map((pokemon,index) => (
                      <PokemonThumbnails
                      id={pokemons.id}
                      name={pokemon.name}
                      image={pokemon.image}
                      type={pokemon.type}
                      key={index}
                      />
                  ))}
              </div>
              <button className='load-more' onClick={getAllPokemons}>
                  もっとみる!
              </button>
          </div>
      </div>
  );
}

export default App;
