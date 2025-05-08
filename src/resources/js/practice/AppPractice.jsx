import ReactDOM from 'react-dom'
import React,{ useState } from 'react';


function AppPractice() {
    const [todos, setTodos] = useState([]);
    const [inputs, setInputs] = useState('');

    const addTodo = () => {
        if (inputs.trim() !== "") return;
        setTodos([...todos, {text: inputs, done: false}]);
        setInputs('');
        return (
            <div>
                <input type="text" value={inputs} onChange={(e) => (e.target.value)}/>
                <p>{inputs}</p>
                <button onClick={addTodo}>追加する</button>
                
            </div>
        );
    }
}

export default AppPractice;
if (document.getElementById('AppPractice')) {
    ReactDOM.render(<AppPractice/>, document.getElementById('AppPractice'));
}
