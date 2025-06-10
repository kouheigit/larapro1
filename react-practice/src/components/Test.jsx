import ReactDOM from'react-dom';
import React,{ useState,useRef } from 'react';
function Test(){
    const[todos,setTodos] = useState([]);
    const[inputs,setInputs] = useState('');
    const inputRef = useRef(null);

    const addTodo = () =>{
        if(inputs.trim()==='')return;
        inputRef.current.focus()
        setTodos(...todos,{text:inputs,done:false});
        setInputs('');
    }


    return(
        <div>
            <input ref={inputRef} type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}placeholder="タスクを入力"/>
            <button onClick={addTodo}>追加</button>
            <p>{inputs}</p>
            <h1>Test.JSX View Test</h1>
        </div>
    );
}
export default Test;