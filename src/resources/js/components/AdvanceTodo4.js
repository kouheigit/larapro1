import ReactDOM from "react-dom";
import React,{ useState } from "react";


function AdvanceTodo4(){
const [todos,setTodos] = useState([]);
const [inputs,setInputs] = useState('');

return(
    <div class="todo4">
    </div>
);

}

export default AdvanceTodo4;

if (document.getElementById('AdvanceTodo4')) {
    ReactDOM.render(<AdvanceTodo4 />, document.getElementById('AdvanceTodo4'));
}
