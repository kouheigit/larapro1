import { useState } from 'react'

function Count(){
    const[count,setCount] = useState(0);
    const addClick = () => {
        setCount(count +1 );
    }

    const subtractClick = () => {
        setCount(count-1);
    }
    return(
        <div>
            <p>{count}</p>
            <button onClick={addClick}>➕</button>
            <button onClick={subtractClick}>➖</button>
            <h1>Count処理</h1>
        </div>
    );
}
export default Count;