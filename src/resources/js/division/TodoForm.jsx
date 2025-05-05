import { useTodos } from '../contexts/TodoContext';

export default function TodoFrom(){
    const { inputs,setInputs,addTodo } = useTodos();
    return(
        <div>
            <input type="text"value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
             <button onClick={addTodo}>追加する</>
        </div>
    );
}

