import React from 'react';
import { useTimer } from 'react-timer-hook';

function Timer() {

    const time = new Date();
    time.setSeconds(time.getSeconds() + 60);
    //time.setSeconds(time.getSeconds() + 60);

    const {
        seconds,
        minutes,
        hours,
        start,
        pause,
        resume,
        restart,
    }=useTimer({
        expiryTimestamp:time,
        autoStart:true,
        onExpire:()=>console.log('時間切れ'),
    });

    return(
        <div>
            <div>
                <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <button onClick={start}>スタート</button>
            <button onClick={pause}>一時停止</button>
            <button onClick={resume}>再スタート</button>
        </div>
    );
}
export default Timer;