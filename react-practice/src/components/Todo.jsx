import ReactDOM from'react-dom';
import React,{ useState } from 'react';

function Todo(){
    const[todos,setTodos] =useState([]);
    const[inputs,setInputs] =useState();

    const addTodo = () => {
        if(inputs.trim()=='') return;
        setTodos([...todos,{ text: inputs, done:false }]);
        setInputs('');
    };

 

    return(
        <div>
            <li>
                <input type="text" value={input} onChange={(e)=>setInputs(e.target.value)}/>
                <p>入力された値:{inputs}</p>
                <button onClick={addTodo}>追加</button>
            </li>
        </div>
    );

}

export default Todo;