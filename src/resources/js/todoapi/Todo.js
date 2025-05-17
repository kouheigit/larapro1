import ReactDom from 'react-dom';
import React,{ useState,useEffect } from 'react';
import ReactDOM from "react-dom";


function Todo(){
    const[todo,setTodo] = useState([]);
    const[input,setInput] = useStat('');
    const addTodo = () =>{
        if (input.trim() !== "") {
            return;
        }
        
    }

    return(
        <div>
            <button onClick={addTodo}></button>
            <h1>テスト</h1>
        </div>
    );
}

export default Todo;

if (document.getElementById('Todo')) {
    ReactDOM.render(<Todo />, document.getElementById('Todo'));
}
