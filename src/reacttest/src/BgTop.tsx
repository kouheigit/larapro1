import React from "react";

export default function BgTop() {
    return (
        <div className='container mx-auto relative'>
            {window.innerWidth > 2400? (
                <div className="px-20">
                    <div className="relative">
                        <div className="absolute -top-20 left-0 w-[2147px]">
                            <img alt="" src="/images/bg-gradient-3000.svg" className="absolute top-0 left-0"/>
                        </div>
                    </div>
                </div>
            ): window.innerWidth > 1534? (
                <div className="px-20">
                    <div className="relative">
                        <div className="absolute -top-20 left-0 w-[1842px]">
                            <img alt="" src="/images/bg-gradient-2400.svg" className="absolute top-0 left-0"/>
                        </div>
                    </div>
                </div>
            ): window.innerWidth > 1366? (
                <div className="px-10">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-[1604px]">
                            <img alt="" src="/images/bg-gradient-1920.svg" className="absolute top-0 left-0"/>
                        </div>
                    </div>
                </div>
            ): window.innerWidth > 1024? (
                <div className="px-6">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-[1329px]">
                            <img alt="" src="/images/bg-gradient-1366.svg" className="absolute top-0 left-0"/>
                        </div>
                    </div>
                </div>
            ): window.innerWidth > 756? (
                <div className="px-6">
                    <div className="relative">
                        <div className="absolute -top-10 left-0 w-[1329px]">
                            <img alt="" src="/images/bg-gradient-tablet.svg" className="absolute top-0 left-0"/>
                        </div>
                    </div>
                </div>
            ): (
                <div className="px-4">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-[576px]">
                            <img alt="" src="/images/bg-gradient-mobile.svg" className="w-[576px] absolute top-0 left-0"/>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    )
}