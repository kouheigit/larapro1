import ReactDOM from'react-dom';
import React,{ useState } from 'react';

function Todo(){
    const[todos,setTodos] =useState([]);
    const[inputs,setInputs] =useState('');
    const[filter,setFilter] = useState('all');

    const addTodo = () => {
        if(inputs.trim()==='') return;
        setTodos([...todos,{ text: inputs, done:false }]);
        setInputs('');
    };

    const deleteTodo = (deleteIndex) =>{
        setTodos(todos.filter((_, index) => index !== deleteIndex));
    }
    /*
    const filterTodos = todos.filter((todo)=>{
        if(filter==='done') return todo.done;
        if(filter==='undone') return !todo.done;
        return true;
    })*/

    const setToggle = (index) =>{
        setTodos(
          todos.map((todo,i)=>{
              if(i === index){
                  return{...todo,done:!todo.done}
              }else{
                  return todo;
              }
          })
        );
    };




    return(
        <div>
            <ul>

                <input type="text" value={inputs} onChange={(e)=>setInputs(e.target.value)} placeholder="タスクを入力"/>
                <p>入力された値:{inputs}</p>
                <button onClick={addTodo}>追加</button>
                <button onClick={()=>setFilter('all')}>すべて</button>
                <button onClick={()=>setFilter('done')}>完了</button>
                <button onClick={()=>setFilter('undone')}>未完了</button>
                    {filterTodos.map((todo,index)=>{
                        return(
                            <li key="index">
                                <input type="checkbox" checked={todo.done} onChange={()=>setToggle(index)} />
                                <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                                    <p>{todo.text}</p>
                                </span>
                                <button onClick={()=>deleteTodo(index)}>削除</button>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );

}

export default Todo;