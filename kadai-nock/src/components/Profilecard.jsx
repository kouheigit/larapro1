import React,{ useState } from 'react';

function Profilecard(){
    const [name,setName] = useState('');
    const [hobby,setHobby] = useState('');
    const[comment,setComment] = useState('');
    const [profiles, setProfiles] = useState([]);
    const[show,setShow] = useState(false);
    //addTodo
    const addTodo = () => {
        if(name.trim()===''||hobby.trim()===''||comment.trim()==='')return;
        const newProfile = { name,hobby,comment };
        setProfiles([...profiles,newProfile]);
        setName('');
        setHobby('');
        setComment('');
    }

    return(
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>プロフィール登録</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="タスクを入力"/>
            <input type="text" value={hobby} onChange={(e)=>setHobby(e.target.value)} placeholder="タスクを入力"/>
            <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="タスクを入力"/>
            <button onClick={addTodo}>追加</button>
            <button onClick={() => setShow(true)}>表示する</button>
            <button onClick={() => setShow(false)}>表示をやめる</button>
            {show && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
                }}>
                    {profiles.map((profile, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <h3>{profile.name}</h3>
                            <p>趣味：{profile.hobby}</p>
                            <p>ひとこと：{profile.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Profilecard;