import ReactDom from 'react-dom';
import React,{ useState,useEffect } from 'react';
import ReactDOM from "react-dom";


function Todo(){
    const[todo,setTodo] = useState([]);
    const[input,setInput] = useStat('');
    const addTodo = () =>{
        if (input.trim() !== "") {
            return;
            setTodo([...todo,{text:inputs,done:false}]);
            setInput('');
        }

    }

    return(
        <div>
            <h1>APIテスト</h1>
            <button onClick={addTodo}></button>
        </div>
    );
}

export default Todo;

if (document.getElementById('Todo')) {
    ReactDOM.render(<Todo />, document.getElementById('Todo'));
}
