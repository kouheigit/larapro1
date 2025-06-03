import React from 'react';

type Props = {
    id:number;
    text:string;
    done: boolean;
    onToggle: (id: number, done: boolean) => void;
    onDelete: (id: number) => void;

};
const TodoItem: React.FC<Props>  = ({ id, text, done, onToggle, onDelete }) => {
    return (
            <li>
                <input type="checkbox" checked={done} onChange={() => onToggle(id, done)}/>
                <span style={{textDecoration: done ? 'line-through' : 'none'}}>
                                <p>{text}</p></span>
                <button onClick={() => onDelete(id)}>削除する</button>
            </li>
    );
};
    export default React.memo(TodoItem);
