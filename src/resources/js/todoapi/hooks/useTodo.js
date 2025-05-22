import React, { useState,useEffect } from 'react';

export function useTodo(){
    const [todo, setTodo] = useState([]);
    const [input, setInput] = useState('');

    //addTodo
    const addTodo = () => {
        if (input.trim() === "") {
            return;
        }
        setTodo([...todo, {text: input, done: false}]);
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
    return { todo,setTodo,input,setInput,addTodo,deleteTodo,toggleCheck };
};
