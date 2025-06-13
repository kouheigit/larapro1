import React from 'react';

  function Test1({inputs,setInputs,todos,inputRef,addTodo}){
    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                value={inputs}
                onChange={(e) => setInputs(e.target.value)}
                placeholder="タスクを入力"
            />
            <button onClick={addTodo}>追加</button>
            <p>{inputs}</p>
            <button onClick={() => inputRef.current.focus()}>
                フォーカスを当てる
            </button>
            {todos.map((todo, index) => (
                <li key={index}>{todo.text}</li>
            ))}
        </div>
    );
}

export default Test1;