import ReactDOM from'react-dom';
import React,{ useState } from'react';
function Todo() {
    const [todos, setTodos] = useState([]);
    const [inputs, setInuputs] = useState('');

    const addTodo = () => {
        if (inputs.trim === '') return;
        setTodos([...todos, {text: input, done: false}]);
        setInuputs('');
        /*
         if(inputs.trim()==='') return;
        setTodos([...todos,{ text: inputs, done:false }]);
        setInputs('');
         */

    }
    /*
    const deleteTodo = () =>{

    }*/

    return (
        <div>
            <ul>
                <input type="text" value={inputs} onChange={(e) => setInuputs(e.target.value)} placeholder="タスクを入力"/>
                <p>入力された値]{inputs}</p>
                <button onClick={addTodo}>追加</button>
                {todos.map((todo, index) => (
                    <li key={index}>
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;
