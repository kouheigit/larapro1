import React, { useState,useEffect,useReducer } from 'react';

export function useTodo(){
    const [todo, dispatch] = useReducer(todoReducer, []);
    const [input, setInput] = useState('');

    useEffect(()=>{
        fetch('http://localhost:8000/api/todos')
            .then(res=>res.json())
            .then(data=>{
                data.forEach(todo=>{
                    dispatch({type:'ADD',text: todo.text, done: todo.done });
                })
            })
            .catch(err=>console.error('GET/api/todos 失敗:',err));
        }, []);

    //addTodo
    const addTodo = () => {
        if (input.trim() === "") {
            return;
        }
        dispatch({ type: 'ADD',text: input });
        setInput('');
    }
    /*
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
      dispatch({ type: 'ADD', text: newTodo.text, done: newTodo.done });
      setInput('');
    })
    .catch(err => console.error('POST /api/todos 失敗:', err));
};
     */
    //deleteTodo
    const deleteTodo = (deleteindex) =>{
        dispatch({type:'DELETE',index:deleteindex});
    }
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
