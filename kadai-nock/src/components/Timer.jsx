import React from 'react';
import { useTimer } from 'react-timer-hook';

function Timer() {

    const dummyTime = new Date();


    const addminutes = () => {
        const minutes = new Date();
        minutes.setMinutes(time.getMinutes()+ 10);
        restart(minutes);
    }
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
            <button onClick={addminutes}>10分</button>
            <button onClick={start}>スタート</button>
            <button onClick={pause}>一時停止</button>
            <button onClick={resume}>再スタート</button>
        </div>
    );
}
export default Timer;