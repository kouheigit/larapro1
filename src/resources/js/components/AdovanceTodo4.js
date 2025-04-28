import ReactDOM from "react-dom";
import React,{ useState } from "react";


function AdovanceTodo4(){
    const [todos,setTodos] = useState([]);
    const [inputs,setInput] = useState('');

    const addTodo= () =>{
        if(inputs.trim()==='') return;
        setTodos([...todos,{ text:inputs, done: false }]);
        setInput('');
    };
    const deleteTodo = (deleteIndex)=>{
        setTodos(todos.filter((test,index)=>index!==deleteIndex))
    }
    const togglecheck = (index) =>{
       setTodos(
           todos
       )
    }

    /*
    const filter_include_a = members.filter((output, index) => {
  return output.includes("a");
});
     */
    return(
        <div class="todo4">
            <input type="text" value={inputs} onChange={(e)=>setInput(e.target.value)}/>
            <p>入力された値{inputs}</p>
            <button onClick={addTodo}>追加</button>
            {todos.map((todo,index) => (
                <li key={index}>
                    <input type="checkbox" checked={todo.done} onChange={()=>togglecheck(index)}/>
                    <p>{todo.text}</p>
                    <button onClick={()=>deleteTodo(index)}>削除する</button>
                </li>
                ))}
        </div>
    );

}

export default  AdovanceTodo4;

if (document.getElementById('AdovanceTodo4')) {
    ReactDOM.render(<AdovanceTodo4 />, document.getElementById('AdovanceTodo4'));
}
