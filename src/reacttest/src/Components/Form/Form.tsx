import React, { useRef, useState } from "react";
import Contact from './Contact'
import Entry from './Entry'
import { ResultModal } from "./ResultModal";

const SUBJECT = {
    CONTACT: 1,
    RECRUIT: 2
}

export default function Form(props: any) {
    const [subject, setSubject] = useState(SUBJECT.CONTACT)
    const modalRef = useRef<any>()
    const showModal = (success: boolean) => {
        modalRef.current?.showModal(success)
    }

    return (
        <div className="bg-gradient-to-b from-[#0051B1] to-[#62B2F7] mt-20">
            <div className="lg:w-[800px] px-4 mx-auto py-20">
                <h2 className="text-center text-white text-7xl font-bold">Contact</h2>
                <h6 className="text-center text-white mt-4">お問い合わせ</h6>
                <div className="bg-white p-4 md:p-8 mt-10 shadow-[0_5px_15px_5px_rgba(0,0,0,0.3)]">
                    <div>
                        <h6 className="text-sm text-slate-900">お問い合わせ項目</h6>
                        <div className="mt-4 md:flex md:space-x-8 space-y-4 md:space-y-0">
                            <label className="relative block">
                                <input type="radio" name="subject" value={SUBJECT.CONTACT} defaultChecked={subject===SUBJECT.CONTACT} onClick={()=>setSubject(SUBJECT.CONTACT)} className="peer" />
                                <div className="absolute pointer-events-none -left-1 top-0 block">
                                    <svg className="w-6 h-6" viewBox="0 0 20 20">
                                        <circle fill="#fff" stroke="#aaa" strokeWidth={1} cx="9" cy="10" r="8" />
                                    </svg>
                                </div>
                                <div className="absolute pointer-events-none -left-1 top-0 transition-transform scale-0 peer-checked:scale-100">
                                    <svg className="w-6 h-6" viewBox="0 0 20 20">
                                        <circle fill="#1A6AC3" cx="9" cy="10" r="9" />
                                        <circle fill="#FFF" cx="9" cy="10" r="4" />
                                    </svg>
                                </div>
                                <span className="ml-3 text-slate-500 peer-checked:text-black">弊社へのお問い合わせ</span>
                            </label>
                            <label className="relative block">
                                <input type="radio" name="subject" value={SUBJECT.RECRUIT} defaultChecked={subject===SUBJECT.RECRUIT} onClick={()=>setSubject(SUBJECT.RECRUIT)} className="peer" />
                                <div className="absolute pointer-events-none -left-1 top-0 block">
                                    <svg className="w-6 h-6" viewBox="0 0 20 20">
                                        <circle fill="#fff" stroke="#aaa" strokeWidth={1} cx="9" cy="10" r="8" />
                                    </svg>
                                </div>
                                <div className="absolute pointer-events-none -left-1 top-0 transition-transform scale-0 peer-checked:scale-100">
                                    <svg className="w-6 h-6" viewBox="0 0 20 20">
                                        <circle fill="#1A6AC3" cx="9" cy="10" r="9" />
                                        <circle fill="#FFF" cx="9" cy="10" r="4" />
                                    </svg>
                                </div>
                                <span className="ml-3 text-slate-500 peer-checked:text-black">中途採用への応募</span>
                            </label>
                        </div>
                    </div>
                    <Contact visible={subject===SUBJECT.CONTACT} showModal={showModal}/>
                    <Entry visible={subject!==SUBJECT.CONTACT} showModal={showModal}/>
                    <ResultModal ref={modalRef}/>
                </div>
            </div>
        </div>
    )
}