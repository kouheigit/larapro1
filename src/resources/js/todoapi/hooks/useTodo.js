import React, { useState,useEffect,useReducer } from 'react';

export function useTodo(){
    const [todo, dispatch] = useReducer(todoReducer, []);
    const [input, setInput] = useState('');

    //addTodo
    const addTodo = () => {
        if (input.trim() === "") {
            return;
        }
        dispatch({ type: 'ADD',text: inputs });
        setInput('');
    }
    //deleteTodo
    const deleteTodo = (deleteindex) =>{
        setTodo(todo.filter((todos,index)=>index!==deleteindex));
    }
    //toggleCheck
    const toggleCheck = (index) =>{
        setTodo(
            todo.map((todos,i)=>{
                    if(i === index){
                        return {...todos,done:　!todos.done };
                    }else{
                        return todos;
                    }
                }
            )
        )
    }
    function todoReducer(state,action){
        switch(action.type){
            case'ADD':
                return([...state,{text:action.input,done:false}]);
            default:
                return state;
        }
    }
    return { todo,setTodo,input,setInput,addTodo,deleteTodo,toggleCheck };
};
