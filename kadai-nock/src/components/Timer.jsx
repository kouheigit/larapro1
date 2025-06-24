import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        // カウントが0以下なら何もしない（止める）
        if (count <= 0||!isRunning) return;


        // 1秒後に -1 するタイマーをセット
        const timer = setTimeout(() => {
            setCount(prev => prev - 1);
        }, 1000);

        // 次にこの useEffect が動くとき、前のタイマーを止める
        return () => clearTimeout(timer);
    }, [count,isRunning]); // ← count が変わるたびに動く

    const addSeconds = () => {
        setCount(prev => prev + 10);
        //isRunning(false);
    };
    const timerStart = () => {
        if(count > 0){
            setIsRunning(true);
        }
    };
    const timerStop = () =>{
        setIsRunning(false);
    }



    return (
        <div>
            <button onClick={addSeconds}>10秒</button>
            <button onClick={timerStart}>スタート</button>
            <button onClick={timerStop}>ストップ</button>
            <h1>タイマー: {count} 秒</h1>
        </div>
    );
};

export default Timer;