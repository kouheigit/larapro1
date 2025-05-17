import ReactDom from 'react-dom';
import React,{ useState,useEffect } from 'react';
import ReactDOM from "react-dom";


function Todo(){
    const[todo,setTodo] = useState([]);
    const[input,setInput] = useState('');
    const addTodo = () =>{
        if (input.trim() === ""){
            return;
        }
            setTodo([...todo,{ text: input, done: false}]);
            setInput('');
    }

    return(
        <div>
            <h1>APIテスト</h1>
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={addTodo}>追加する</button>
            <p>入力された文字{input}</p>
            {todo.map((todos,index)=>(
                    <div>
                        <li key={index}>
                            <p>{todos.text}</p>
                        </li>
                    </div>
            ))}
        </div>
    );
}

export default Todo;
if (document.getElementById('Todo')) {
    ReactDOM.render(<Todo />, document.getElementById('Todo'));
}
