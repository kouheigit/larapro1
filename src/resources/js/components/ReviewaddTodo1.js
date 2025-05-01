import ReactDOM from 'react-dom';
import React from 'react';
//ReviewaddTodo1
function ReviewaddTodo1(){
    const todos = [
        { text: '英語', done: true },
        { text: '数学', done: false },
        { text: '理科', done: true }
    ];
    const bool = todos.filter((todo)=> todo.done == true);

    return(
        <div>
            {bool.map((todo,index)=>(
                <li key={index}>
                    <p>
                        {todo.text}
                    </p>
                </li>
            ))}
        </div>
    );
}

export default ReviewaddTodo1;

if (document.getElementById('ReviewaddTodo1')) {
    ReactDOM.render(<ReviewaddTodo1 />, document.getElementById('ReviewaddTodo1'));
}
