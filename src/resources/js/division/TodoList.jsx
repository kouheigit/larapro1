import{ useTodos } from '../contexts/TodoContext';
import TodoItem from "./TodoItem";

export default function TodoList(){
    const { todos,toggleCheck,deleteTodo } = useTodos();
    return(
       <ul>
               {todos.map((todo,index)=>(
                   <TodoItem
                       key={index}
                       todo={todo}
                       index={index}
                       toggleCheck={toggleCheck}
                       deleteTodo={deleteTodo}
                   />
               ))}
       </ul>
    );
}
