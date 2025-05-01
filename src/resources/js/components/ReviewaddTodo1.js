import ReactDOM from 'react-dom';
import React from 'react';

function ReviewaddTodo1(){
    const todos = [
        { text: '英語', done: true },
        { text: '数学', done: false },
        { text: '理科', done: true }
    ];
    const bool = todos.filter((todo))
    //const newRandomArry = randomArry.filter(Boolean)
    const todovalues = todos.filter((todo) => todo.text.includes('買'));
    return(
        <div>

        </div>
    );
}
