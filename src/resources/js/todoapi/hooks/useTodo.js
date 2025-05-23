import React, { useState,useEffect,useReducer } from 'react';

export function useTodo(){
    const [todo, dispatch] = useReducer(todoReducer, []);
    const [input, setInput] = useState('');
    
    //addTodo
    const addTodo = () => {
        if (input.trim() === "") {
            return;
        }
        dispatch({ type: 'ADD',text: input });
        setInput('');
    }
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
