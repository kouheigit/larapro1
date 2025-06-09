import ReactDOM from'react-dom';
import React,{ useState } from 'react';

function Todo(){
    const[todos,setTodos] =useState([]);
    const[inputs,setInputs] =useState('');

    const addTodo = () => {
        if(inputs.trim()=='') return;
        setTodos([...todos,{ text: inputs, done:false }]);
        setInputs('');
    };
    const deleteTodo = (deleteindex) =>{
        setTodos(todos.filter((_,index)=>!index == deleteindex));
        /*
        const filter_include_a = members.filter((output, index) => {
        return output.includes("a");
});
         */
    }



    return(
        <div>
            <ul>

                <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)} placeholder="タスクを入力"/>
                <p>入力された値:{inputs}</p>
                <button onClick={addTodo}>追加</button>
                    {todos.map((todo,index)=>{
                        return(
                            <li key="index">
                                <p>{todo.text}</p>
                                <button onClick={()=>deleteTodo(index)}>削除</button>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );

}

export default Todo;