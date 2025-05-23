import React, { createContext, useContext, useState, useEffect } from 'react';
const TodoContext = createContext();

export function TodoProvider ({ children }){

    const [todos, setTodos] = useState([]);
    const [inputs, setInput] = useState('');

    //ローカルストレージを出力している
    useEffect(() =>{
        const stored = localStorage.getItem('todos');
        if(stored){
            setTodos(JSON.parse(stored));
        }
    },[])

    //ストレージに保存する処理
    useEffect(()=>{
        localStorage.setItem('todos',JSON.stringify(todos));
    },[todos])


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
    };
    return(
      <TodoContext.Provider value={{ todos,setTodos,inputs,setInput,addTodo,deleteTodo,toggleCheck}}>
          {children}
      </TodoContext.Provider>
    );
}
export function useTodos() {
    return useContext(TodoContext);
}
