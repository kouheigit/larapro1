import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [count, setCount] = useState(0);
    //const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        // カウントが0以下なら何もしない（止める）
        if (count <= 0) return;

        // 1秒後に -1 するタイマーをセット
        const timer = setTimeout(() => {
            setCount(prev => prev - 1);
        }, 1000);

        // 次にこの useEffect が動くとき、前のタイマーを止める
        return () => clearTimeout(timer);
    }, [count]); // ← count が変わるたびに動く

    const addSeconds = () => {
        setCount(prev => prev + 10);
    };

    return (
        <div>
            <button onClick={addSeconds}>10秒</button>
            <h1>タイマー: {count} 秒</h1>
        </div>
    );
};

export default Timer;