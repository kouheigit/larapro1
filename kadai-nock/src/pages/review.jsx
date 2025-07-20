import ReactDOM from'react-dom';
import React,{ useState } from'react';
function Todo() {
    const [todos, setTodos] = useState([]);
    const [inputs, setInuputs] = useState('');

    const addTodo = () => {
        if (inputs.trim() === '') return;
        setTodos([...todos, {text: inputs, done: false}]);
        setInuputs('');
    }
    const deleteTodo =(deleteIndex) =>{
        setTodos(todos.filter((_,index)=>index!==deleteIndex))
    }
    const toggleCheck =(index) =>{
        setTodos(
            todos.map((todo,i)=>{
                if(i === index){
                    return {...todo,done: !todo.done};
                }else{
                    return todo;
                }
            })
        )
    }


    return (
        <div>
            <ul>
                <input type="text" value={inputs} onChange={(e) => setInuputs(e.target.value)} placeholder="タスクを入力"/>
                <p>入力された値{inputs}</p>
                <button onClick={addTodo}>追加</button>
                {todos.map((todo, index) => (
                    <li key={index}>
                        <input type="checkbox" checked={todo.done} onChange={()=>toggleCheck(index)}/>
                        <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                            {todo.text}
                        </span>
                        <button onClick={()=>deleteTodo(index)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;
