import React,{ useState,useEffect,useMemo } from 'react';
import { useTodo } from '../hooks/useTodo.js';
import TodoItem from './TodoItem.js';



function Todo() {
    //state一覧
    const { todo,setTodo,input,setInput, addTodo, deleteTodo, toggleCheck } = useTodo();
    const [filter,setFilter] = useState('all');

    const filterTodo = useMemo(() => {
        return todo.filter((todos)=>{
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
            {filterTodo.map((item)=> {
                return (
                    <TodoItem
                        key={item.id}
                        id={item.id}
                        text={item.text}
                        done={item.done}
                        onToggle={toggleCheck}
                        onDelete={deleteTodo}
                    />
                );
            })}
            </ul>
        </div>
    );
}
export default Todo;

