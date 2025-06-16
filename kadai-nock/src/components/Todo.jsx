import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function Todo(){
    const[todos,setTodos] = useState([]);
    const[inputs,setInputs] = useState('');

    const addTodo = () =>{
    if(inputs.trim()==='')return;
    setTodos([...todos,{text:inputs,done:false}]);
    setInputs('');
    }

    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
            <button onClick={addTodo}></button>
        </div>
    );
}