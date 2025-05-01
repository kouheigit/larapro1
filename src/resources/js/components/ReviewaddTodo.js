import ReactDOM from 'react-dom';
import React, { useState } from 'react';


function ReviewaddTodo(){
    const [todo,setTodo] = useState([]);
    setTodo(
        [...todo,{text: '掃除', done: false},{ text: '買い物', done: false }, { text: '勉強', done: true }]);
    return(
        <div>
            <h1>ReviewaddTodoは正常に表示されてます</h1>
        </div>
    );

}

export default ReviewaddTodo;

if (document.getElementById('ReviewaddTodo')) {
    ReactDOM.render(<ReviewaddTodo />, document.getElementById('ReviewaddTodo'));
}
