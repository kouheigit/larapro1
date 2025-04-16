import ReactDOM from 'react-dom';
import { useCounter1 } from '../hooks/useCounter1';

function AdvanceTodo2() {
    const { todos,setTodos,inputs,setInput, addTodo, deleteTodo, toggleCheck } = useCounter1();

    return (
        <div className="todo">
            <input type="text" value={inputs} onChange={(e) => setInput(e.target.value)}/>
            <p>入力された値: {inputs}</p>
            {/*修正以前の状態*/}
            <button onClick={addTodo}>追加</button>
            {todos.map((todo, index) => (
                <li key={index}>
                    <input type="checkbox" checked={todo.done} onChange={() =>toggleCheck(index)} />
                    <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                        {todo.text}</span><button onClick={() => deleteTodo(index)}>削除</button></li>
            ))}

        </div>
    );
}

export default AdvanceTodo2;

if (document.getElementById('AdvanceTodo2')) {
    ReactDOM.render(<AdvanceTodo2 />, document.getElementById('AdvanceTodo2'));
}
