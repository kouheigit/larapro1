import React from "react";

export default function TodoItems({ todo, index, toggleCheck, deleteTodo }){
    return(
        <li>
           <input type="checkbox" checked={todo.done} onChange={()=>toggleCheck(index)}/>
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
            </span>
            <button onClick={()=>deleteTodo(index)}>削除</button>
        </li>
    );
}

