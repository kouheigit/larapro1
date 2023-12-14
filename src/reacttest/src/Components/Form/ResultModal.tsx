import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export const ResultModal = forwardRef((props: any, ref) => {
    const [modalShowing, setModalShowing] = useState(false)
    const [modalActive, setModalActive] = useState(false)
    const [success, setSuccess] = useState(false)
    useEffect(()=> {
        if(modalShowing) {
            setTimeout(() => {
                setModalActive(true)                
            }, 100);
        }
    }, [modalShowing])
    
    const closeModal = () => {
        setModalActive(false)
        setTimeout(() => {
            setModalShowing(false)
        }, 600)
    }
    const showModal = (success:boolean) => {
        setSuccess(success)
        setModalShowing(true)
    }
    useImperativeHandle(ref, () => ({
        showModal, 
    }))
    return (
        <div className="relative">
            {modalShowing&&(
                <div className={`fixed z-40 top-0 left-0 w-screen h-screen bg-black/40 transition-opacity duration-500 px-4 flex justify-center items-center ${modalActive? 'opacity-100': 'opacity-0'}`} onClick={()=>{closeModal()}}>
                    <div className={`py-4 md:w-[500px] max-h-screen overflow-scroll transition-all duration-500 ${modalActive? 'opacity-100 scale-100': 'opacity-0 scale-105'}`} >
                        <div className="p-4 bg-white rounded border border-slate-300 shadow-lg" onClick={e=>{e.stopPropagation()}}>
                            <h4 className="text-xl">{success? '投稿を承りました': '通信エラーが発生しました'}</h4>
                            {success? (
                                <div className="my-6 text-slate-700 text-sm leading-7">
                                    後ほど改めて担当者よりご連絡いたします。<br />
                                    ご利用ありがとうございました！
                                </div>
                            ): (
                                <div className="my-6 text-slate-700 text-sm leading-7">
                                    お手数をおかけしますが、時間を空けてもう一度実行して頂くか<br />
                                    info@teconet.co.jp 宛にメールにてご連絡をお願いいたします。
                                </div>
                            )}

                            <div className="flex justify-end mt-4">
                                <button type="button" className="rounded transition-colors hover:bg-slate-100 text-slate-900 p-2" onClick={()=>{closeModal()}}>OK</button>
                            </div>
                        </div>

                    </div>
                </div>
                
            )}
        </div>
    )
})