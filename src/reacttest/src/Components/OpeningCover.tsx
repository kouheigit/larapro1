import React, { useEffect, useState } from "react";

export default function OpeningCover(props: any) {
    const [covered, setCovered] = useState(true)
    const [hidden, setHidden] = useState(false)
    useEffect(()=>{
        setTimeout(() => {
            setCovered(false)
        }, 600);
        setTimeout(()=>{
            setHidden(true)
        }, 2000)
    }, [])
    return (
        <div className={`fixed z-50 top-0 left-0 w-screen h-screen pointer-events-none ${hidden? 'hidden': ''}`}>
            <div className={`absolute h-full top-0 right-0 overflow-hidden transition-all duration-1000 ${covered? 'w-full': 'w-0'}`}>
                <div className="absolute top-0 right-0 w-screen h-screen bg-gradient-to-r to-[#0051b1] from-[#62b2f7]">

                </div>
            </div>
        </div>
    )
}