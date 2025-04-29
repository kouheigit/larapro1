import ReactDOM from 'react-dom';
import { useCounter3 } from '../hooks/useCounter3';
import React,{ useState } from 'react';

function AdvanceTodo4() {
    const { todos,setTodos,inputs,setInput, addTodo, deleteTodo, toggleCheck } = useCounter3();
    const[filter,setFilter] = useState('all');

    const filteredTodos = todos.filter((todo)=>{
        if(filter === 'done') return todo.done;
        if(filter === 'undone') return !todo.done;
        return true;
    });

    return (
        <div className="todo">
            <input type="text" value={inputs} onChange={(e) => setInput(e.target.value)}/>
            <p>入力された値: {inputs}</p>
            <button onClick={addTodo}>追加</button>
            <button onClick={()=>setFilter('all')}>すべて</button>
            <button onClick={()=>setFilter('done')}>完了</button>
            <button onClick={()=>setFilter('undone')}>未完了</button>

            {filteredTodos.map((todo, index) => (
                <li key={index}>
                    <input type="checkbox" checked={todo.done} onChange={() =>toggleCheck(index)} />
                    <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                        {todo.text}</span><button onClick={() => deleteTodo(index)}>削除</button></li>
            ))}
        </div>
    );
}

export default AdvanceTodo4;

if (document.getElementById('AdvanceTodo4')) {
    ReactDOM.render(<AdvanceTodo4 />, document.getElementById('AdvanceTodo4'));
}
