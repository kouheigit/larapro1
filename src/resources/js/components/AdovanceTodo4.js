import ReactDOM from "react-dom";
import React,{ useState } from "react";


function AdovanceTodo4(){
    const [todos,setTodos] = useState([]);
    const [inputs,setInputs] = useState('');

    return(
        <div class="todo4">
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
            <p>入力された値{inputs}</p>
        </div>
    );

}

export default  AdovanceTodo4;

if (document.getElementById('AdovanceTodo4')) {
    ReactDOM.render(<AdovanceTodo4 />, document.getElementById('AdovanceTodo4'));
}
