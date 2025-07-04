import ReactDom from 'react-dom';
import React,{ useState,useEffect } from 'react';
import ReactDOM from "react-dom";
import { useTodo } from './hooks/useTodo';



function Todo() {
    //state一覧
    const { todo,setTodo,input,setInput, addTodo, deleteTodo, toggleCheck } = useTodo();
    const [filter,setFilter] = useState('all');
    const filterTodo = todo.filter((todos)=>{
        if(filter === 'done') return todos.done;
        if(filter === 'undone') return !todos.done;
        return true;
    });

    return(
        <div>
            <h1>API✖️Laravel提携</h1>
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={addTodo}>追加する</button>
            <button onClick={()=>setFilter('all')}>すべて</button>
            <button onClick={()=>setFilter('done')}>完了</button>
            <button onClick={()=>setFilter('undone')}>未完了</button>
            <p>入力された文字{input}</p>
            {/*<ul>をつけないとチェックボックスが正しく作動しない*/}
            <ul>
            {filterTodo.map((todos,index)=> {
                //追加した
                const originalIndex = todo.indexOf(todos);
                //returnをもうひとつ追加した
                return (
                    <div>
                        <li key={index}>
                            <input type="checkbox" checked={todos.done} onChange={() => toggleCheck(originalIndex)}/>
                            <span style={{textDecoration: todos.done ? 'line-through' : 'none'}}>
                                <p>{todos.text}</p></span>
                            <button onClick={() => deleteTodo(originalIndex)}>削除する</button>
                        </li>
                    </div>
                );
            })}
            </ul>
        </div>
    );
}

export default Todo;
if (document.getElementById('Todo')) {
    ReactDOM.render(<Todo />, document.getElementById('Todo'));
}
