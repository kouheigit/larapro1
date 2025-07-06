import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import alarm from './sounds/alarm.mp3';

import {
    CircularProgressbar,
    buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
//Timer
const Timer = () => {
    const [count, setCount] = useState(0); // 残り時間（秒）
    const [initialTime, setInitialTime] = useState(0); // 合計時間
    const [isRunning, setIsRunning] = useState(false);
    const [play, { stop }] = useSound(alarm);

    const [text, setText] = useState("");
    const [addMinute, setAddMinute] = useState("");

    //useEffect処理
    useEffect(() => {
        if (count <= 0 || !isRunning) return;
        //処理
        const timer = setTimeout(() => {
            setCount(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    play(); // 音を鳴らす
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [count, isRunning, play]);

    // 秒追加（＋initialTime更新）
    //onClickAddtext
    const onClickAddText = () => {
        const num = Number(text);
        if (isNaN(num)) {
            alert("数値を入力してください");
            return;
        }
        setCount(prev => {
            const newCount = prev + num;
            setInitialTime(newCount);
            return newCount;
        });
        setText("");
    };

    // 分追加（＋initialTime更新）
    //onClickAddMinute
    const onClickAddMinute = () => {
        const num = Number(addMinute);
        if (isNaN(num)) {
            alert("数値を入力してください");
            return;
        }
        setCount(prev => {
            const newCount = prev + num * 60;
            setInitialTime(newCount);
            return newCount;
        });
        setAddMinute("");
    };

    // 各種追加操作（初期時間も更新）
    const addHour = () => {
        setCount(prev => {
            const newCount = prev + 3600;
            setInitialTime(newCount);
            return newCount;
        });
    };
    //addMinutes
    const addMinutes = () => {
        setCount(prev => {
            const newCount = prev + 60;
            setInitialTime(newCount);
            return newCount;
        });
    };

    const addSeconds = () => {
        setCount(prev => {
            const newCount = prev + 10;
            setInitialTime(newCount);
            return newCount;
        });
    };

    const timerStart = () => {
        if (count > 0) setIsRunning(true);
    };

    const timerStop = () => {
        setIsRunning(false);
        stop();
    };

    const timerReset = () => {
        setCount(0);
        setInitialTime(0);
        stop();
    };

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

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>⏳ タイマー</h2>

            <div>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="秒を入力"
                />
                <button onClick={onClickAddText}>秒追加</button>
            </div>

            <div>
                <input
                    value={addMinute}
                    onChange={(e) => setAddMinute(e.target.value)}
                    placeholder="分を入力"
                />
                <button onClick={onClickAddMinute}>分追加</button>
            </div>

            <div style={{ marginTop: '10px' }}>
                <button onClick={addHour}>1時間</button>
                <button onClick={addMinutes}>1分</button>
                <button onClick={addSeconds}>10秒</button>
            </div>

            <div style={{ marginTop: '10px' }}>
                <button onClick={timerStart}>スタート</button>
                <button onClick={timerStop}>ストップ</button>
                <button onClick={timerReset}>リセット</button>
            </div>

            <h3 style={{ marginTop: '20px' }}>現在: {formatTime(count)}</h3>

            {/* 円形プログレスバー */}
            {initialTime > 0 && (
                <div style={{ width: 200, height: 200, margin: '20px auto' }}>
                    <CircularProgressbar
                        value={(count / initialTime) * 100}
                        text={formatTime(count)}
                        styles={buildStyles({
                            textColor: "#333",
                            pathColor: "#00bcd4",
                            trailColor: "#eee"
                        })}
                    />
                </div>
            )}
        </div>
    );
};

export default Timer;