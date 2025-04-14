import ReactDOM from 'react-dom';
import { useCounter } from '../hooks/useCounter';

function AdvanceTodo1() {
    const { todos,setTodos,inputs,setInput, addTodo, deleteTodo, toggleCheck } = useCounter();

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
                    {/* <input type="checkbox" checked={checks} onChange={handleChange} />*/}
                    {/*<input type="checkbox" checked={checks} onChange={(e)=> setCheck(e.target.checked)}/>*/}
                        {todo.text}</span><button onClick={() => deleteTodo(index)}>削除</button></li>
            ))}

        </div>
    );
}

export default AdvanceTodo1;

if (document.getElementById('AdvanceTodo1')) {
    ReactDOM.render(<AdvanceTodo1 />, document.getElementById('AdvanceTodo1'));
}
