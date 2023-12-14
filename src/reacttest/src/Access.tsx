import React from "react";
import { useState, useEffect } from 'react';

function Access() {
    /*constのメッセージはこういう宣言をする*/
    const [message, setMessage] = useState('');
    const [mail, setMail] = useState('');


    useEffect(() => {
        fetch('/api')
            .then((res) => res.json())
            .then((data) =>{
                setMessage(data.message);
                setMail(data.mail);
            })
        /*
         .then((data) => {
                setMessage(data.message);
                setMail(data.mail);
            })
         */
    }, []);

    return (
        <div className="App">
            <h1>ナメックムーブ</h1>
            <p>{message}</p>
            <p>{mail}</p>
        </div>
    );
}

export default Access;