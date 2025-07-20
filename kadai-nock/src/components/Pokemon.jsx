import React, { useEffect, useState } from 'react';

function Pokemon(){
    const[pokemon,setPokemon] = useState(null);
    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
            .then(response=>{
                if(!response.ok){
                    throw new Error('データの取得に失敗しました');
                }
                return response.json();
            })
            .then(data=>{
                setPokemon(data);
                })
            .catch(error=>{
               console.error('エラー',error);
            });
        /*
        .then(data => {
            setPokemon(data);  // 成功時にstateへ保存
        })
        .catch(error => {
            console.error('エラー:', error);
        });*/
    },[]);
    return view(
        <div>

        </div>
    );
}