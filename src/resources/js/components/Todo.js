import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function Todo(){

    const [todo,setTodos] = useState([]);
    const [inputs,setInput] = useState('');
    const array = [1,2,3,4,5];
    return (
        <div className="todo">
            <input type="text" value={inputs} onChange={(e) => setInput(e.target.value)}/>
            <p>入力された値: {inputs}</p>

            {array.map((item) => {
                return <li>{item}</li>;
            })}
        </div>
    );
}

export default Todo;

if (document.getElementById('todo')) {
    ReactDOM.render(<Todo />, document.getElementById('todo'));
}

/*
import React, { useState } from 'react';
export default function Todo(){
    const [todos,setTodos] = useState([]);
    return (
        <div>
            <h1>テスト表示</h1>
            <input  value={todos} onChange={(e => setTodos(e.target.value))}/>
            <p>あなたの名前は{input}です</p>
        </div>
    )
}
 */
