import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function AdvanceTodo(){

    const [todos,setTodos] = useState([]);
    const [inputs,setInput] = useState('');
    const [checks,setCheck] = useState(false);

    //値を追加するメソット
    const addTodo = ()=>{
        if(inputs.trim()==='') return;
        setTodos([...todos, { text: inputs,done: false }]);
        //setTodos([...todos,inputs]);
        setInput('');
    };
    //値を削除するメソット
    const deleteTodo = (deleteIndex) => {
        setTodos(todos.filter((_, index) => index !== deleteIndex));
    };

    const handleChange = (e)=>{
        const checked = e.target.checked;
        updateState(checked);
    };

    const updateState = (checked) =>{
        setCheck(checked);
    };

    return (
        <div className="todo">
            <input type="text" value={inputs} onChange={(e) => setInput(e.target.value)}/>
            <p>入力された値: {inputs}</p>
            {/*修正以前の状態*/}
            <button onClick={addTodo}>追加</button>
            {todos.map((todo, index) => (
                <li key={index}>
                    <input type="checkbox" checked={checks} onChange={handleChange} />
                    {/*<input type="checkbox" checked={checks} onChange={(e)=> setCheck(e.target.checked)}/>*/}
                    {todo.text}<button onClick={() => deleteTodo(index)}>削除</button></li>
            ))}
        </div>
    );
}

export default AdvanceTodo;

if (document.getElementById('AdvanceTodo')) {
    ReactDOM.render(<AdvanceTodo />, document.getElementById('AdvanceTodo'));
}
