import ReactDOM from 'react-dom';
import React,{ useState } from 'react';
import {useCounter3} from "../hooks/useCounter3";


function ListPage(){
    const { todos,setTodos,inputs,setInput, addTodo, deleteTodo, toggleCheck } = useCounter3();
    const[filter,setFilter] = useState('all');

    const filteredTodos = todos.filter((todo)=>{
        if(filter === 'done') return todo.done;
        if(filter === 'undone') return !todo.done;
        return true;
    });

    return(
        <div>
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

export default ListPage;

if (document.getElementById('ListPage')) {
    ReactDOM.render(<ListPage />, document.getElementById('ListPage'));
}
