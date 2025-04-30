import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function AdvanceTodo(){
    const [todos,setTodos] = useState([]);
    const [inputs,setInputs] = useState('');
    
    return(
        <div>

        </div>
    );

}

export default AdvanceTodo;

if (document.getElementById('AdvanceTodo')) {
    ReactDOM.render(<AdvanceTodo />, document.getElementById('AdvanceTodo'));
}
