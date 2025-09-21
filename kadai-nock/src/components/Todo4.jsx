import React,{ useState } from 'react';

function Todo4(){
    const[todos,setTodos] = useState([]);
    const[input,setInputs] = useState('');

    const addTodo= () => {
        if(inputs.trim()==='')return;
        setTodos([...todos,{text,inputs,done:false}]);
        setInputs('');
    }

    return(
        <div>
            <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
            <button onClick={addTodo}>追加</button>
            

        </div>
    )
}