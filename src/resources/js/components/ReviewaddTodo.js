import ReactDOM from 'react-dom';
import React from 'react';

function ReviewaddTodo() {
    const todos = [
        { text: '掃除', done: false },
        { text: '買い物', done: false },
        { text: '勉強', done: true }
    ];
    const todovalues = todos.filter((todo) => todo.text.includes('買'));

    return (
        <div>
            <ul>
                {todovalues.map((todo, index) => (
                    <li key={index}>
                        <p>{todo.text}</p>
                    </li>
                ))}
            </ul>
            <h1>正常なコード</h1>
        </div>
    );
}

export default ReviewaddTodo;

if (document.getElementById('ReviewaddTodo')) {
    ReactDOM.render(<ReviewaddTodo />, document.getElementById('ReviewaddTodo'));
}
