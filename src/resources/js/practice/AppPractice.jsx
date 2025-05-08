import ReactDOM from 'react-dom'
import React,{ useState } from 'react';


function AppPractice() {
    const [todos, setTodos] = useState([]);
    const [inputs, setInputs] = useState('');

    const addTodo = () => {
        if (inputs.trim() == "") return;
        setTodos([...todos, {text: inputs, done: false}]);
        setInputs('');
    }
    const deleteTodo = (deletevalue)=>{
        setTodos(todos.filter((todo, index) => index !== deleteIndex));
       // setTodos(todos.filter(todo,index) => index !==deletevalue));
    }
        return (
            <div>
                <input type="text" value={inputs} onChange={(e) => (e.target.value)}/>
                <p>{inputs}</p>
                <button onClick={addTodo}>追加する</button>
                {todos.map((todo,index)=>
                    <div>
                        <li key={index}>
                            {todo.text}
                            <button onclick={()=>deleteTodo(index)}>削除する</button>
                        </li>
                    </div>
                )}
            </div>
        );

}

export default AppPractice;
if (document.getElementById('AppPractice')) {
    ReactDOM.render(<AppPractice/>, document.getElementById('AppPractice'));
}
