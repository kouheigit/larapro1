import React,{useState} from 'react';
import Axios from 'axios';

function Postform() {
    const url ="http://localhost:4000/api"
    const[data,setData] = useState({
        name: "",
        mail: "",
    })　　

    function submit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        Axios.post(url,{
            name: data.name,
            mail: data.mail,
        })
            .then(res => {
                console.log(res.data)
            })
    }

    /*型変換を行う*/
    type Data = typeof data;

    function handle(e: React.ChangeEvent<HTMLInputElement>){
        const newdata: Data = { ...data };
        newdata[e.target.id as keyof Data] = e.target.value;
        setData(newdata);
        console.log(newdata);
    }

    return (
        <div>
            <form onSubmit={(e) => submit(e)}>
                <input onChange={(e)=>handle(e)} id="name" value={data.name} placeholder="name" type="text"></input>
                <input onChange={(e)=>handle(e)} id="mail" value={data.mail} placeholder="mail" type="text"></input>
                <input type="submit" value="リクエストを送信" />
            </form>
        </div>
    );
}

export default Postform;