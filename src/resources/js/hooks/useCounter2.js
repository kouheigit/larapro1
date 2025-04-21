import ReactDOM from 'react-dom';
import React, { useState } from 'react';
export function useCounter() {

    const [todos, setTodos] = useState([]);
    const [inputs, setInput] = useState('');

    useEffect(()=>{
    },[])

    //値を追加するメソット
    const addTodo = () => {
        if (inputs.trim() === '') return;
        setTodos([...todos, {text: inputs, done: false}]);
        //setTodos([...todos,inputs]);
        setInput('');
    };
    //値を削除するメソット
    const deleteTodo = (deleteIndex) => {
        setTodos(todos.filter((_, index) => index !== deleteIndex));
    };
    const toggleCheck = (index) => {
        setTodos(
            todos.map((todo, i) => {
                if (i === index) {
                    return {...todo, done: !todo.done};
                } else {
                    return todo;
                }
            })
        );
    }
    return { todos,setTodos,inputs,setInput,addTodo,deleteTodo,toggleCheck };
};
