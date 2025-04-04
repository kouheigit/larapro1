import ReactDOM from 'react-dom';
import React, { useState } from 'react';

function Counter(){
    // list(count, setCount) に相当。セッションで言えば count = $_SESSION['count'];
    const [ count,setCount] = useState(0)
    return (
        <div className="counter">
            <h2>カウンターアプリ</h2>
            <p>現在のカウント{count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
            <button onClick={() => setCount(0)}>リセット</button>
        </div>
    );
}

export default Counter;

if (document.getElementById('counter')) {
    ReactDOM.render(<Counter />, document.getElementById('counter'));
}

