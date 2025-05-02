import ReactDOM from 'react-dom';
import React,{ useState } from 'react';



function ReviewaddTodo2(){
const [todos,setTodos] = useState([]);
const [inputs,setInputs] = useState('');

const addTodo = () =>{
    if(inputs.trim()==="") return;
    setTodos(...todos,{ text:inputs });
    setInputs('');
    }
    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
            <button onClick={addTodo}>追加する</button>
            {todos.map((todo,index)=>(
                <li>
                    <p>{todo.text}</p>
                </li>

            ))}
        </div>
    );
}
export default ReviewaddTodo2;

if (document.getElementById('ReviewaddTodo2')) {
    ReactDOM.render(<ReviewaddTodo2 />, document.getElementById('ReviewaddTodo2'));
}
