import ReactDOM from'react-dom';
import React,{ useState,useRef,useEffect } from 'react';
function Test(){
    const[todos,setTodos] = useState([]);
    const[inputs,setInputs] = useState('');
    const inputRef = useRef(null);

    useEffect(()=>{
        const stored = localStorage.getItem(todos);
        if(stored){
            setTodos(JSON.parse(stored));
        }
    },[])
    useEffect(()=>{
        localStorage.setItem('todos',JSON.stringify(todos));
    },[todos])


    const addTodo = () =>{
        if(inputs.trim()==='')return;
        setTodos([...todos,{text:inputs,done:false}]);
        setInputs('');
        inputRef.current.focus();
    }


    return(
        <div>
            <input ref={inputRef} type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}placeholder="タスクを入力"/>
            <button onClick={addTodo}>追加</button>
            <p>{inputs}</p>
            <button onClick={() => inputRef.current.focus()}>
                フォーカスを当てる
            </button>
            <h1>Test.JSX View Test</h1>
        </div>
    );
}
export default Test;