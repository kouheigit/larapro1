import ReactDOM from 'react-dom';
import React,{ useState } from 'react';
import { useCounter3 } from '../hooks/useCounter3';



function AddPage(){
    const { todos,setTodos,inputs,setInput, addTodo, deleteTodo, toggleCheck } = useCounter3();
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
