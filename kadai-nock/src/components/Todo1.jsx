import React,{ useState } from 'react';

function Todo1(){
    const[todos,setTodos] = useState([]);
    const[inputs,setInputs] = useState('');

    const addTodo = () =>{
        if(inputs.trim==='') return;
        setTodos(...[todos,{text:inputs,done:false}]);
        setInputs('');
    }

    return(
        <div>

        </div>
    );
}