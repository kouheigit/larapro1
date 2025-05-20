import ReactDom from 'react-dom';
import React,{ useState,useEffect } from 'react';
import ReactDOM from "react-dom";


function Todo() {
    const [todo, setTodo] = useState([]);
    const [input, setInput] = useState('');

    const [filter,setFilter] = useState('all');

    const addTodo = () => {
        if (input.trim() === "") {
            return;
        }
        setTodo([...todo, {text: input, done: false}]);
        setInput('');
    }

    const deleteTodo = (deleteindex) =>{
        setTodo(todo.filter((todos,index)=>index!==deleteindex));
    }
    const toggleCheck = (index) =>{
        setTodo(
            todo.map((todo,i)=>{
                if(i === index){
                    return {...todo,done:　!todo.done };
                }else{
                    return todo;
                }
            }
            )
        )
    }

   const filterTodo = todo.filter((todos)=>{
       if(filter=='done') return todo.done;
       if(filter=='undone') return !todo.done;
       return true;
   });


    return(
        <div>
            <h1>APIテスト</h1>
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={addTodo}>追加する</button>
            <button onClick={()=>setFilter('all')}>すべて</button>
            <button onClick={()=>setFilter('done')}>完了</button>
            <button onClick={()=>setFilter('undone')}>未完了</button>
            <p>入力された文字{input}</p>
            {filterTodo.map((todos,index)=>(
                    <div>
                        <li key={index}>
                            <input type="checkbox" value={todo.done} onChange={()=>toggleCheck(index)}/>
                            <p>{todos.text}</p>
                            <button onClick ={()=>deleteTodo(index)}>削除する</button>
                        </li>
                    </div>
            ))}
        </div>
    );
}

export default Todo;
if (document.getElementById('Todo')) {
    ReactDOM.render(<Todo />, document.getElementById('Todo'));
}
