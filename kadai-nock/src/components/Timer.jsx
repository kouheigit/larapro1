import { useTimer } from 'react-timer-hook';
import React, { useState } from 'react';



function Timer() {
    const [times, setTimer] = useState(() => {
        const t = new Date();
        t.setSeconds(t.getSeconds() + 1);
        return t;
    });
// explain
//    const dummyTime = new Date();
//    dummyTime.setSeconds(dummyTime.getSeconds() + 1);


    const {
        seconds,
        minutes,
        hours,
        start,
        pause,
        resume,
        restart,
        reset,
        expiryTimestamp,
    }=useTimer({
        expiryTimestamp:times,
        autoStart:true,
        onExpire:()=>console.log('時間切れ'),
    });

    const addminutes = (expiryTimestamp) => {

        /*
        const newTime = new Date(expiryTimestamp.getTime() + 10 * 60 * 1000); // ✅ expiryTimestampベースで加算
        setTimer(newTime);                                                   // ✅ 新しい状態をセット
        restart(newTime, false);
         */

        times.setMinutes(times.getMinutes()+ 10);
        setTimer(times);
        restart(times,false);
    }
    const addhour = (expiryTimestamp) => {

        times.setHours(times.getHours()+ 1);
        setTimer(times);
        restart(times);
    }
    const addsecond = (expiryTimestamp) => {
        times.setSeconds(times.getSeconds()+ 10);
        setTimer(times);
        restart(times);
    }
    const resetTime = (expiryTimestamp) => {
        const reset = new Date();
        reset.setSeconds(reset.getSeconds() + 1); // 1秒後にする
        setTimer(reset);       // 状態も更新（使ってるなら）
        restart(reset);
    }


    return(
        <div>
            <div>
                <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <button onClick={addhour}>1時間</button>
            <button onClick={addminutes}>10分</button>
            <button onClick={addsecond}>10秒</button>
            <button onClick={start}>スタート</button>
            <button onClick={pause}>一時停止</button>
            <button onClick={resume}>再スタート</button>
            <button onClick={resetTime}>リセット</button>
        </div>
    );
}
export default Timer;