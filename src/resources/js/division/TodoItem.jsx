export default function TodoItem({ todo,index,toggleCheck,deleteTodo }){
    return(
        <li key="index">
            <input type="checkbox" value={todo.done} onChange={()=>toggleCheck(index)}/>
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                {todo.text}
            </span>
            <button onClick={()=>deleteTodo(index)}>削除する</button>
        </li>
    );
}
