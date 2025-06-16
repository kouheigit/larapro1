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
    const doneTodos = todos.filter((todo) => todo.done === true);

    const deleteTodo = (deleteIndex) =>{
        setTodos(todos.filter((_,index)=>index!==deleteIndex));
    }


    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
            <button onClick={addTodo}></button>
            {todo.map((todos,index)=>{
                {todos.text}
                <button onClick ={()=>deleteTodo(index)}></button>
            })}
        </div>
    );
}