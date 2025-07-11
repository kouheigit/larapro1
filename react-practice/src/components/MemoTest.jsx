import React,{ useState,useMemo }  from'react';


function MemoTest(){
    const[filter,setFilter] = useState('all');
    const[todos,setTodos] =useState([
        { id:1,text:'買い物',done:false },
        { id:2,text:'勉強',done:true },
        { id:3,text:'運動',done:false}
    ]);

　　//useMemo
    const filteredTodos = useMemo(()=> {
        return todos.filter((todo) => {
            if (filter === 'done') return todo.done;
            if (filter === 'undone') return !todo.done;
            return true;
        }, [todos, filter]);
    });


    return(
       <div>
           <button onClick={()=>setFilter('all')}>全て</button>
           <button onClick={()=>setFilter('done')}>完了</button>
           <button onClick={()=>setFilter('undone')}>未完了</button>

           <ul>{filteredTodos.map((todo)=>(
               <li key={todo.id}>{todo.text}</li>
           ))}
           </ul>
       </div>
   );
}
export default MemoTest;
