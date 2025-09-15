import React,{ useState } from 'react';

function Todo3(){
    const[todos,setTodos] = useState([]);
    const[inputs,setInputs] = useState('');

    const addTodo = () =>{
        if(inputs.trim()==='')return;
        setTodos([...todos,{text:inputs,done:false}]);
        setInputs('');
    }
    const deleteTodo =(deleteIndex)=> {
        setTodos(todos.filter((_,index)=>index!==deleteIndex));
    }
    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
            <button onClick={addTodo}>追加</button>
            {todos.map((todo,index)=>(
                <div key={index}>
                    {todo.text}
                    <button onClick={()=>deleteTodo(index)}>削除</button>
                </div>
            ))}
        </div>
    );
}
export default Todo3;