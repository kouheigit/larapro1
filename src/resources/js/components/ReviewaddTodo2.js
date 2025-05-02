import ReactDOM from 'react-dom';
import React,{ useState } from 'react';



function ReviewaddTodo2(){
const [todos,setTodos] = useState([]);
const [inputs,setInputs] = useState('');

const addTodo = () =>{
    if(inputs.trim==="") return;
    setInputs(...todos,{ text:inputs });
    setInputs('');
    }
    return(
        <div>
            <input type=""
            <h1>TODO2</h1>
        </div>
    );
}
export default ReviewaddTodo2;

if (document.getElementById('ReviewaddTodo2')) {
    ReactDOM.render(<ReviewaddTodo2 />, document.getElementById('ReviewaddTodo2'));
}
