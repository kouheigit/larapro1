import React, { useState,useEffect,useReducer } from 'react';

export function useTodo(){
    const [todo, dispatch] = useReducer(todoReducer, []);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/api/todos')
            .then(res => res.json())
            .then(data => {
                data.forEach(item => {
                    dispatch({ type: 'ADD', id: item.id, text: item.text, done: item.done });
                });
            })
            .catch(err => console.error('GET /api/todos 失敗:', err));
    }, []);
    /*【PHPに換算すると】
    　$response = Http::get('http://localhost:8000/api/todos');← fetch('http://localhost:8000/api/todos')
    　$data = $response->json(); //　← .then(res => res.json())

　　　handleData($data); // ← 関数呼び出しの部分がここになるthen(data => { ... })

　　　function handleData($data) {　　　
   　　　foreach ($data as $item) {
        　// dispatch 相当の処理
     　　 　　  echo "ID: {$item['id']} - Text: {$item['text']} - Done: {$item['done']}\n";
    　　}
　　　}
      ↑(関数の部分に当たる)
       data.forEach(item => {
                    dispatch({ type: 'ADD', id: item.id, text: item.text, done: item.done });
                });
     */

    //addTodo
    const addTodo = () => {
        if (input.trim() === '') return;

        fetch('http://localhost:8000/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: input })
        })
            .then(res => res.json())
            .then(newTodo => {
                dispatch({ type: 'ADD', id: newTodo.id, text: newTodo.text, done: newTodo.done });
                setInput('');
            })
            .catch(err => console.error('POST /api/todos 失敗:', err));
    };


    //ここから下のdeleteTodoから下はまだ未修正

    const deleteTodo = (deleteindex)=>{
        fetch('http://localhost:8000/api/todos/${id}',{
            method:'DELETE'
        })
            .then(()=>{
                dispatch({ type:'DELETE',index:deleteindex })
            })
            .catch(err => console.error('DELETE /api/todos 失敗:', err));
    };
    //toggleCheck
    const toggleCheck = (index) =>{
        dispatch({type:'TOGGLE',index:index})
    }
    function todoReducer(state,action){
        switch(action.type){
            case'ADD':
                return([...state,{text:action.text,done:false}]);
            case'DELETE':
                return(state.filter((_,index)=>index!==action.index));
            case'TOGGLE':
                return state.map((todo,i)=>{
                    if(i === action.index){
                        return {...todo,done: !todo.done};
                    }else{
                        return todo;
                    }
                })
            default:
                return state;
        }
    }
    return { todo,input,setInput,addTodo,deleteTodo,toggleCheck,dispatch };
};
