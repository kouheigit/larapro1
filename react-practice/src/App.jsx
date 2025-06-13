import { useState,useRef,useEffect } from 'react';
import Todo from './components/Todo';
import Test from "./components/Test";
import MemoTest from "./components/MemoTest";
import Test1 from "./components/Test1";




function App() {
    const[todos,setTodos] = useState([]);
    const[inputs,setInputs] = useState('');
    const inputRef = useRef(null);

    useEffect(()=>{
        const stored = localStorage.getItem('todos');
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
        /*test*/
        inputRef.current.focus();
    }

  return (
    <div>
        <MemoTest/>
        <Todo/>
        <Test/>
        <Test1
            inputs={inputs}
            setInputs={setInputs}
            todos={todos}
            inputRef={inputRef}
            addTodo={addTodo}
        />
    </div>
  );
}

export default App
