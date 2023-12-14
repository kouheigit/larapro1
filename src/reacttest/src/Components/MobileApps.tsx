import React, { useEffect, useState } from "react";
import { useInView } from "react-hook-inview";

export default function MobileApps(props: any) {
    const [showing, setShowing] = useState(false)
    const [ref, inView] = useInView({
        threshold: 0,
      })
    useEffect(()=>{
        if (inView) {
            setShowing(true)
        }
    }, [inView])
    return (
        <div ref={ref} className='absolute w-60 md:w-[400px] -top-4 md:top-0 -right-14 md:left-0 md:right-auto'>
            <img src="/images/iphone.png" className={`transition-all duration-[2000ms] delay-700 ease-out absolute -top-20 opacity-0 drop-shadow-[0_100px_100px_rgba(0,0,0,0.25)] ${showing? '!top-0 !opacity-100 !drop-shadow-[0_15px_10px_rgba(0,0,0,0.25)]': ''}`} />
        </div>
    )
}