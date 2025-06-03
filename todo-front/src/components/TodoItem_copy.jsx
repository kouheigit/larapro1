import React from 'react';

const TodoItem = ({ id, text, done, onToggle, onDelete }) => {
    return (
        <div>
            <li>
                <input type="checkbox" checked={done} onChange={() => onToggle(id, done)}/>
                <span style={{textDecoration: done ? 'line-through' : 'none'}}>
                                <p>{text}</p></span>
                <button onClick={() => onDelete(id)}>削除する</button>
            </li>
        </div>
    );
};
    export default React.memo(TodoItem);
