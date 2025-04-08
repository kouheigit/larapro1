import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function AdvanceTodo(){

    const [todos,setTodos] = useState([]);
    const [inputs,setInput] = useState('');
    const [checked, setChecked] = useState(false);


    const addTodo = ()=>{
        if(inputs.trim()==='') return;
        setTodos([...todos,inputs]);
        setInput('');
    };
    const deleteTodo = (deleteIndex) => {
        setTodos(todos.filter((_, index) => index !== deleteIndex));
    };

    return (
        <div className="todo">
            <input type="text" value={inputs} onChange={(e) => setInput(e.target.value)}/>
            <p>入力された値: {inputs}</p>
            <button onClick={addTodo}>追加</button>
            {/*<li key={index}>{todo}{index}</li>*/}
            {todos.map((todo, index) => (
                <li key={index}> <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)}/>{todo}<button onClick={() => deleteTodo(index)}>削除</button></li>
            ))}
        </div>
    );
}

export default AdvanceTodo;

if (document.getElementById('AdvanceTodo')) {
    ReactDOM.render(<AdvanceTodo />, document.getElementById('AdvanceTodo'));
}
