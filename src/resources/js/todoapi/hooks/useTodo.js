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
        dispatch({type:'DELETE',index:index});
    }
    //toggleCheck
    const toggleCheck = (index) =>{
        dispatch({type:'TOGGLE',index:index})
        /*
        setTodo(
            todo.map((todos,i)=>{
                    if(i === index){
                        return {...todos,done:　!todos.done };
                    }else{
                        return todos;
                    }
                }
            )
        )*/
    }
    function todoReducer(state,action){
        switch(action.type){
            case'ADD':
                return([...state,{text:action.input,done:false}]);
            case'DELETE':
                return(state.filter((_,index)=>index!==action.index));
            case'TOGGLE':
                return state.map((todo,i)=>{
                    if(i === active.index){
                        return {todo,done: !todo.done};
                    }else{
                        return todo;
                    }
                })
            default:
                return state;
        }
    }
    return { todo,setTodo,input,setInput,addTodo,deleteTodo,toggleCheck };
};
