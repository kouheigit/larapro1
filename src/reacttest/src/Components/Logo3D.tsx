import React, { useEffect } from "react";

export default function Logo3D(props: any) {

    // useEffect(()=>{
    //     setTimeout(()=>{

    //     }, 1000)
    // }, [])
    return (
        <div className="absolute -bottom-32 2xl:bottom-0 -left-6 lg:left-20">
            <svg className="block w-60 h-60 md:w-[440px] lg:w-[500px] md:h-[440px] lg:h-[500px]" viewBox="0 0 500 500">
                <image href="/images/logo3d/shadow-s-l.png" x="80" y="238" height="262" width="416" opacity={0}>
                    <animate
                        attributeType="CSS" 
                        attributeName="opacity"
                        dur="1.6s" 
                        from="0" 
                        to="1"
                        begin="1s"
                        repeatCount="1"
                        fill="freeze"/>
                </image>
                <image href="/images/logo3d/shadow-o-l.png" x="0" y="210" height="129" width="136" opacity={0}>
                    <animate
                        attributeType="CSS" 
                        attributeName="opacity"
                        dur="1.6s" 
                        from="0" 
                        to="1"
                        begin="1.2s"
                        repeatCount="1"
                        fill="freeze"/>
                </image>
                <image href="/images/logo3d/shadow-o-l.png" x="100" y="180" height="129" width="136" opacity={0}>
                    <animate
                        attributeType="CSS" 
                        attributeName="opacity"
                        dur="1.6s" 
                        from="0" 
                        to="1"
                        begin="1.4s"
                        repeatCount="1"
                        fill="freeze"/>
                </image>

                <image href="/images/logo3d/s-l.png" x="120" y="210" height="241" width="352" opacity={0}>
                    <animate
                        attributeType="CSS" 
                        attributeName="opacity"
                        dur="1.6s" 
                        from="0" 
                        to="1"
                        begin="1s"
                        repeatCount="1"
                        fill="freeze"/>
                    <animateTransform attributeName="transform" type="translate" from="0,-100" to="0,0" begin="1s" dur="1.6s" repeatCount="1" fill="freeze" calcMode="spline"  keyTimes="0;1" keySplines="0.0 0.0 0.58 1.0"/>
                </image>

                <image href="/images/logo3d/o-l.png" x="37" y="185" height="105" width="74" opacity={0}>
                    <animate
                        attributeType="CSS" 
                        attributeName="opacity"
                        dur="1.6s" 
                        from="0" 
                        to="1"
                        begin="1.0s"
                        repeatCount="1"
                        fill="freeze"/>
                    <animateTransform attributeName="transform" type="translate" from="0,-130" to="0,0" begin="1.0s" dur="1.6s" repeatCount="1" fill="freeze" calcMode="spline"  keyTimes="0;1" keySplines="0.0 0.0 0.58 1.0"/>
                </image>
                <image href="/images/logo3d/o-l.png" opacity={0} x="137" y="155" height="105" width="74">
                <animate
                    attributeType="CSS" 
                    attributeName="opacity"
                    dur="1.6s" 
                    from="0" 
                    to="1"
                    begin="1.4s"
                    repeatCount="1"
                    fill="freeze"/>
                    <animateTransform attributeName="transform" type="translate" from="0,-160" to="0,0" begin="1.4s" dur="1.6s" repeatCount="1" fill="freeze" calcMode="spline"  keyTimes="0;1" keySplines="0.0 0.0 0.58 1.0"/>
                </image>
            </svg>
        </div>
    )
}