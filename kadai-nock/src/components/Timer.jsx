import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import alarm from './sounds/alarm.mp3';


const Timer = () => {
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    //サウンド
    const [play, { stop, pause }] = useSound(alarm);

    const [text, setText] = useState("");
    const [addText, setAddText] = useState("");
    const [addMinute, setAddMinute] = useState("");




    useEffect(() => {
        if (count <= 0 || !isRunning) return;

        const timer = setTimeout(() => {
            setCount(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    play();  //音を鳴らす処理
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [count, isRunning, play]);

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
        stop();
    }
    const timerReset = () =>{
        setCount(0);
        stop();
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