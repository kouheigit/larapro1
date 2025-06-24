import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [count, setCount] = useState(0);

    const addsecond = () =>{
            setCount(prev => prev + 10);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setCount(prev => prev - 1); // ✅ prevを使うと安全
        }, 1000);

        return () => clearTimeout(timer);
    }, [count]);


    /*
    useEffect(() => {
        const timer = setTimeout(() => {
            setCount(prev => prev + 1); // ✅ prevを使うと安全
        }, 1000);

        return () => clearTimeout(timer);
    }, [count]);*/


    return (
        <div>
            <button onClick={addsecond}>10秒</button>
            <h1>タイマー: {count}秒</h1>
        </div>
    );
};

export default Timer;