import React,{ useState,useEffect } from 'react';
import { useTodo } from '../hooks/useTodo';



function Todo() {
    //state一覧
    const { todo,setTodo,input,setInput, addTodo, deleteTodo, toggleCheck } = useTodo();
    const [filter,setFilter] = useState('all');
    
    const filterTodo = useMemo(() => {
        todo.filter((todos)=>{
            if(filter === 'done') return todos.done;
            if(filter === 'undone') return !todos.done;
            return true;
        });
    },[todo,filter])

    return(
        <div>
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={addTodo}>追加する</button>
            <button onClick={()=>setFilter('all')}>すべて</button>
            <button onClick={()=>setFilter('done')}>完了</button>
            <button onClick={()=>setFilter('undone')}>未完了</button>
            <p>入力された文字{input}</p>
            {/*<ul>をつけないとチェックボックスが正しく作動しない*/}
            <ul>
            {filterTodo.map((todos)=> {
                //追加した
                const originalIndex = todo.indexOf(todos);
                //returnをもうひとつ追加した
                return (
                    <div>
                        <li key={todos.id}>
                            <input type="checkbox" checked={todos.done} onChange={() => toggleCheck(todos.id,todos.done)}/>
                            <span style={{textDecoration: todos.done ? 'line-through' : 'none'}}>
                                <p>{todos.text}</p></span>
                            <button onClick={() => deleteTodo(todos.id)}>削除する</button>
                        </li>
                    </div>
                );
            })}
            </ul>
        </div>
    );
}

