import ReactDOM from'react-dom';
import React,{ useState } from 'react';
function Todo(){
    const [todos,setTodos] = useState([]);
    const [inputs,setInputs] = useState('');

    const addTodo = () =>{
        if(inputs.trim()==='') return;
        setTodos([...todos,{text: inputs,done:false}]);
        setInputs('');
    }

    const deleteTodo = (deleteIndex) =>{
        setTodos(todos.filter((_,index)=>index!==deleteIndex))
    }


    /*
    const deleteTodo =(deleteIndex) =>{
        setTodos(todos.filter((_,index)=>index!==deleteIndex))
    }*/
    /*
       const addTodo = () => {
        if (inputs.trim() === '') return;
        setTodos([...todos, {text: inputs, done: false}]);
        setInuputs('');
    }
     */
    return (
        <div>
            <ul>
                <input tyep="text" value={inputs} onChange={(e)=>setInputs(e.target.value)} placeholder ="タスクを入力"/>
                <p>入力された値{inputs}</p>
                <button onClick={addTodo}>追加</button>
            </ul>
        </div>
    );
}


export default Todo;