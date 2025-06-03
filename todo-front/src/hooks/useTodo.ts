import React, { useState,useEffect,useReducer } from 'react';

type Todo = {
  id:number;
  text:string;
  done:boolean;
};


type Action =
    | { type: 'ADD'; id: number; text: string; done?: boolean }
    | { type: 'DELETE'; id: number }
    | { type: 'TOGGLE'; id: number };

function todoReducer(state: Todo[], action: Action): Todo[]{
    switch(action.type){
        case'ADD':
            return([...state,{id:action.id,text:action.text,done:action.done ?? false}]);
        case'DELETE':
            return state.filter(todo=>todo.id !== action.id);
        case'TOGGLE':
            return state.map((todo)=>{
                if(todo.id === action.id){
                    return {...todo,done: !todo.done};
                }else{
                    return todo;
                }
            })
        default:
            return state;
    }
}


export function useTodo(){
    const [todo, dispatch] = useReducer(todoReducer, []as Todo[]);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        fetch('http://localhost:8888/api/todos')
            .then(res => res.json())
            .then((data: Todo[]) => {
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

        fetch('http://localhost:8888/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: input })
        })
            .then(res => res.json())
            .then((newTodo: Todo) => {
                dispatch({
                    type: 'ADD',
                    id: newTodo.id,
                    text: newTodo.text,
                    done: newTodo.done
                });
                setInput('');
            })
            .catch(err => console.error('POST /api/todos 失敗:', err));
    };


    //deleteTodo
    const deleteTodo = (id: number)=>{
        fetch(`http://localhost:8888/api/todos/${id}`,{
            method:'DELETE'
        })
            .then(()=>{
                dispatch({ type:'DELETE',id })
            })
            .catch(err => console.error('DELETE /api/todos 失敗:', err));
    };
    const toggleCheck = (id: number, currentDone: boolean)=>{
        fetch(`http://localhost:8888/api/todos/${id}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({done:!currentDone})
        })
            .then(res=>res.json())
            .then((data:Todo[])=>{
                dispatch({type:'TOGGLE',id});
            })
            .catch(err=>console.error('PATCH /api/todos 失敗:', err))
    };
    //function todoReducer(state: Todo[], action: Action): Todo[]

    return { todo,input,setInput,addTodo,deleteTodo,toggleCheck,dispatch };
};
