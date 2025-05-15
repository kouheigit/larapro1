import React, { createContext, useContext, useState, useReducer,useEffect } from 'react';
const TodoContext = createContext();

export function TodoProvider ({ children }){
    const [todos, dispatch] = useReducer(todoReducer, []);
    const [inputs, setInput] = useState('');

    //ローカルストレージを出力している
    useEffect(() => {
        const stored = localStorage.getItem('todos');
        if (stored) {
            const loaded = JSON.parse(stored);
            loaded.forEach(todo => {
                dispatch({ type: 'ADD', text: todo.text });
            });
        }
    }, []);

    //ストレージに保存する処理
    useEffect(()=>{
        localStorage.setItem('todos',JSON.stringify(todos));
    },[todos])


    //値を追加するメソット
    const addTodo = () => {
        if (inputs.trim() === '') return;
        dispatch({ type: 'ADD',text: inputs });
        setInput('');
    };

    //値を削除するメソット
    const deleteTodo = (deleteIndex) => {
        dispatch({ type: 'DELETE',index:deleteindex });
       // setTodos(todos.filter((_, index) => index !== deleteIndex));
    };

    const toggleCheck = (index) => {
        dispatch({ type: 'TOGGLE',index:index });
    };
    function todoReducer(state,action){
        switch(action.type){
            case 'ADD':
                return([...state, {text: action.text, done: false}]);
            case 'DELETE':
                return state.filter((_,index) => index !== action.index);
            case 'TOGGLE':
                return state.map((todo,i)=>{
                    if (i == action.index) {
                        return {...todo, done: !todo.done};
                    } else {
                        return todo;
                    }
                });
            default:
                return state;
        }
    }

    return(
        <TodoContext.Provider value={{ todos,inputs,setInput,addTodo,deleteTodo,toggleCheck}}>
            {children}
        </TodoContext.Provider>
    );
}
export function useTodos() {
    return useContext(TodoContext);
}
