import ReactDOM from 'react-dom';
import React, { useState } from 'react';


function ReviewaddTodo(){

    const todos = [
        { text: '掃除', done: false },
        { text: '買い物', done: false },
        { text: '勉強', done: true }
    ];
    todos.filter((todo)=>todo.text.includes('買'));

    return(
        <div>
            {todos.map((todo,index)=>())
            }
            <h1>正常なコード</h1>
        </div>
    );

}

export default ReviewaddTodo;

if (document.getElementById('ReviewaddTodo')) {
    ReactDOM.render(<ReviewaddTodo />, document.getElementById('ReviewaddTodo'));
}
