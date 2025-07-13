import ReactDOM from'react-dom';
import React,{ useState } from'react';
function Todo(){
    const[todos,setTodos] = useState([]);
    const[inputs,setInuputs] = useState('');

    const addTodo = () =>{
        if(inputs.trim==='')return;
        setTodos([...todos,{text:input, done:false}]);
        setInuputs('');
        /*
         if(inputs.trim()==='') return;
        setTodos([...todos,{ text: inputs, done:false }]);
        setInputs('');
         */

    }
    const deleteTodo = () =>{

    }
}
return(
    <div>
        <ul>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)} placeholder="タスクを入力"/>
            <p>入力された値]{inputs}</p>
            


            {filterTodos.map((todo,index)=>{
                return(
                    <li key="index">
                        <input type="checkbox" checked={todo.done} onChange={()=>setToggle(index)} />
                        <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                                    {todo.text}
                                </span>
                        <button onClick={()=>deleteTodo(index)}>削除</button>
                    </li>
                );
            })}
        </ul>
    </div>
);
