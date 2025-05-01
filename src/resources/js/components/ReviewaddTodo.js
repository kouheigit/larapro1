import ReactDOM from 'react-dom';
import React, { useState } from 'react';


function ReviewaddTodo(){
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
