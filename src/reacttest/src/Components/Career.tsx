import React from "react";
import { Parallax, Background } from "react-parallax"

export default function Career (props: any) {
    const bg = '/images/bg-career.jpg'
    return (
        <Parallax className="bg-slate-100 pb-16 md:pb-60" bgImage={bg} strength={500}>
            <div className='container mx-auto xl:px-20'>
                <div className='flex justify-center md:justify-between items-end'>
                    <h2 className='text-white text-[100px] md:text-[200px] font-black'>Career</h2>
                    <h6 className='hidden lg:block text-white font-bold text-xl leading-9'>
                        テコネットでは<br />
                        共にアレコレできる人材を<br />
                        募集しています
                    </h6>
                </div>
            </div>
        </Parallax>
    )
}