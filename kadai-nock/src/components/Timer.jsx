import { useTimer } from 'react-timer-hook';
import React, { useState } from 'react';


function Timer() {
    const [times, setTimer] = useState(new Date());

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
      //  const times = new Date();
        times.setMinutes(times.getMinutes()+ 10);
        setTimer(times);
        restart(times);
    }
    const resetTime = (expiryTimestamp) => {
        times.setSeconds(0);
        times.setMinutes(0);
        times.setHours(0);
        times.setSeconds(times.getSeconds() + 1);
        setTimer(times);
        restart(times);
    }

    return(
        <div>
            <div>
                <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <button onClick={addminutes}>10分</button>
            <button onClick={start}>スタート</button>
            <button onClick={pause}>一時停止</button>
            <button onClick={resume}>再スタート</button>
            <button onClick={resetTime}>リセット</button>
        </div>
    );
}
export default Timer;