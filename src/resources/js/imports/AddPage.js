import ReactDOM from 'react-dom';
import React,{ useState } from 'react';
import { useTodos } from '../contexts/TodoContext';

function AddPage(){
    const {inputs,setInput, addTodo} = useTodos();
    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={addTodo}>追加</button>
        </div>
    );
}

export default AddPage;

if (document.getElementById('AddPage')) {
    ReactDOM.render(<AddPage />, document.getElementById('AddPage'));
}
