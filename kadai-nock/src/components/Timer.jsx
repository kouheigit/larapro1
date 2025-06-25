import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    
    const [text, setText] = useState("");
    const [addText, setAddText] = useState("");
    const [addMinute, setAddMinute] = useState("");




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

    const addHour = () => {
        setCount(prev => prev + 3600);
    };

    const addMinutes = () => {
        setCount(prev => prev + 60);
    };

    const addSeconds = () => {
        setCount(prev => prev + 10);
    };
    const timerStart = () => {
        if(count > 0){
            setIsRunning(true);
        }
    };
    const timerStop = () =>{
        setIsRunning(false);
    }
    const timerReset = () =>{
        setCount(0);
    }

    const formatTime = (seconds) => {
        const date = new Date(seconds * 1000);
        return new Intl.DateTimeFormat('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        }).format(date);
    };

    const onClickAddText = () => {
        setAddText(text);
        const str = text;
        const num = Number(str);
        if (isNaN(num)) {
            alert("数値を入力してください");
            return;
        }
        setCount(count + num);
        console.log(num);
        setText("");
    }

    const onClickAddMinute = () => {
        setAddMinute(addMinute);
        const str = addMinute;
        const num = Number(str);
        if (isNaN(num)) {
            alert("数値を入力してください");
            return;
        }
        setCount(count + num * 60);
        console.log(num);
        setAddMinute("");
    }
    
    return (
        <div>
            <input value={text} onChange={(event) => setText(event.target.value)}/>
            <button onClick={onClickAddText}>秒追加</button>
            <input value={addMinute} onChange={(event) => setAddMinute(event.target.value)}/>
            <button onClick={onClickAddMinute}>分追加</button>
            <button onClick={addHour}>1時間</button>
            <button onClick={addMinutes}>1分</button>
            <button onClick={addSeconds}>10秒</button>
            <button onClick={timerStart}>スタート</button>
            <button onClick={timerStop}>ストップ</button>
            <button onClick={timerReset}>リセット</button>
            <h1>タイマー: {formatTime(count)}</h1>
        </div>
    );
};

export default Timer;