import ReactDom from 'react-dom';
import React,{ useState,useEffect } from 'react';
import ReactDOM from "react-dom";
import AdvanceTodo from "../components/AdovanceTodo";

function Todo(){
    const[todo,setTodo] = useState([]);
    const[input,setInput] = useStat('');
    const addTodo = () =>{

    }

    return(
        <div>
            
            <h1>テスト</h1>
        </div>
    );
}

export default Todo;

if (document.getElementById('Todo')) {
    ReactDOM.render(<Todo />, document.getElementById('Todo'));
}
