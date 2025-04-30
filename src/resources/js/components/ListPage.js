import ReactDOM from 'react-dom';
import React,{ useState } from 'react';
import {useCounter3} from "../hooks/useCounter3";


function ListPage(){
    const { todos,setTodos,inputs,setInput, addTodo, deleteTodo, toggleCheck } = useCounter3();
    return(
        <div>
            <h1>テストリストページ</h1>
        </div>
    );
}

export default ListPage;

if (document.getElementById('ListPage')) {
    ReactDOM.render(<ListPage />, document.getElementById('ListPage'));
}
