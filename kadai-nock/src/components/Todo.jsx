import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function Todo(){
    const[todos,setTodos] = useState([]);
    const[inputs,setInputs] = useState('');

    const addTodo = () =>{
    if(inputs.trim()==='')return;

    }

    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
        </div>
    );
}