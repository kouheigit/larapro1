import { useTimer } from 'react-timer-hook';


function Timer() {

    const dummyTime = new Date();
    dummyTime.setSeconds(dummyTime.getSeconds() + 1);

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
        expiryTimestamp:dummyTime,
        autoStart:true,
        onExpire:()=>console.log('時間切れ'),
    });


    const addminutes = () => {
        const times = new Date(expiryTimestamp);
        times.setMinutes(times.getMinutes()+ 10);
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
        </div>
    );
}
export default Timer;