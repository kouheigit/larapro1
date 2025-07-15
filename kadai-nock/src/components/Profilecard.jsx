import React,{ useState } from 'react';

function Profilecard(){
    const [name,setName] = useState('');
    const [hobby,setHobby] = useState('');
    const[comment,setComment] = useState('');
    const [profiles, setProfiles] = useState([]);
    const[show,setShow] = useState(false);

    const addTodo = () => {
        if(name.trim()===''||hobby.trim()===''||comment.trim()==='')return;
        const newProfile = { name,hobby,comment };
        setProfiles([...profiles,newProfile]);

        setName('');
        setHobby('');
        setComment('');
    }

    return(
        <div>
            <h2>プロフィール登録</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="タスクを入力"/>
            <input type="text" value={hobby} onChange={(e)=>setHobby(e.target.value)} placeholder="タスクを入力"/>
            <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="タスクを入力"/>
            {profiles.map((profile,index)=>(
                <li key={index}>
                    {profile.name}
                    {profile.hoppy}
                    {profile.comment}
                </li>
            ))}
        </div>
    );
}
export default Profilecard;