import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function AdvanceTodo(){
    const [todos,setTodos] = useState([]);
    const [inputs,setInputs] = useState('');

    const addTodo = ()=>{
        if(inputs.trim()==='') return;
        setTodos([...todos, { text: inputs,done: false }]);
        //setTodos([...todos,inputs]);
        setInput('');
    };

    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
        </div>
    );

}

export default AdvanceTodo;

if (document.getElementById('AdvanceTodo')) {
    ReactDOM.render(<AdvanceTodo />, document.getElementById('AdvanceTodo'));
}
