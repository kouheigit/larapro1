import ReactDOM from 'react-dom';
import { useCounter2 } from '../hooks/useCounter2';
import React,{ useState } from 'react';

function AdvanceTodo3() {
    const { todos,setTodos,inputs,setInput, addTodo, deleteTodo, toggleCheck } = useCounter2();
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
            {/*修正以前の状態*/}
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

export default AdvanceTodo2;

if (document.getElementById('AdvanceTodo3')) {
    ReactDOM.render(<AdvanceTodo3 />, document.getElementById('AdvanceTodo3'));
}
