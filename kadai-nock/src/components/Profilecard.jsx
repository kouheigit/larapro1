import React,{ useState } from 'react';
import Todo from "../pages/review.jsx";

function Profilecard(){
    const [name,setName] = useState('');
    const [hobby,setHobby] = useState('');
    const[comment,setComment] = useState('');
    const[show,setShow] = useState(false);

    return(
        <div>
            <h2>プロフィール登録</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="タスクを入力"/>
            <input type="text" value={hobby} onChange={(e)=>setHobby(e.target.value)} placeholder="タスクを入力"/>
            <input type="text" value{comment} onChange={(e)=>setComment(e.target.value)} placeholder="タスクを入力"/>
        </div>
    );
}
export default Profilecard;