import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Policy from "./Policy";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const schema = yup.object().required().shape({
    jobType: yup.array().min(1, '必須項目です'),
    name: yup.string().required('必須項目です'),
    kana: yup.string().matches(/^[ァ-ヶー　 ]+$/, 'カタカナを入力してください').required('必須項目です'),
    email: yup.string().email('メールアドレスの形式が異なります').required('必須項目です'),
    agreement: yup.bool().oneOf([true], '同意が必要です')
})

const ENTRY_TYPE = {
    FORMAL: 1,  // 正式応募
    CASUAL: 2   // カジュアル面談
}

const JOB_TYPE = {
    JOB1: 1,    // 希望職種1
    JOB2: 2    // 希望職種2
}

export default function Entry(props: any) {
    const [entryType, setEntryType] = useState(ENTRY_TYPE.FORMAL)

    const {register, formState: {isValid, errors}, getValues} = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            type: '1',
            jobType: '',
            name: '',
            kana: '',
            email: '',
            agreement: false
        }
    })
    const [message, setMessage] = useState('')
    const [previousCompany, setPreviousCompany] = useState('')
    const [previousTitle, setPreviousTitle] = useState('')
    const [social, setSocial] = useState('')

    const resumeRef = useRef<any>(null)
    const [resume, setResume] = useState<File | null>(null)
    const onResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        console.log('onFileChange', files)
        setResume(files? files[0]: null)
    }
    const cvRef = useRef<any>(null)
    const [cv, setCv] = useState<File | null>(null)
    const onCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        console.log('onFileChange', files)
        setCv(files? files[0]: null)
    }


    const canSubmit = () => {
        if (isValid && recaptcha) return true
        else return false
    }
    const [recaptcha, setRecapthca] = useState(false)

    const onChallenge = (value: any) => {
        setRecapthca(value != null)
    }
    const [nowLoading, setNowLoading] = useState(false)

    const submit = () => {
        const payload = {
            entryType: entryType,
            type: getValues('type'),
            jobType: getValues('jobType'),
            name: getValues('name'),
            kana: getValues('kana'),
            email: getValues('email'),
            previousCompany: previousCompany,
            previousTitle: previousTitle,
            social: social,
            message: message,
            resume: resume,
            cv: cv,

        }
        const url = 'http://localhost:4000/apply'
        setNowLoading(true)
        axios.post(url, payload,{
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }).then(res => {
            console.log('success', res)
            setNowLoading(false)
            props.showModal(true)   // 成功モーダル表示
        }).catch(errors => {
            console.log('error', errors)
            setNowLoading(false)
            props.showModal(false)   // 失敗モーダル表示
        })
    }

    return (
        <>
        <div className={`space-y-5 mt-8 ${props.visible&&!nowLoading? '': 'hidden'}`}>
            <div className="mt-8">
                <h6 className="text-sm text-slate-900">応募タイプ</h6>
                <div className="mt-4 md:flex md:space-x-8 space-y-4 md:space-y-0">
                    <label className="relative block">
                        <input type="radio" name="entrytype" value={ENTRY_TYPE.FORMAL} defaultChecked={entryType===ENTRY_TYPE.FORMAL} onClick={()=>setEntryType(ENTRY_TYPE.FORMAL)} className="peer" />
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
                        <span className="ml-3 text-slate-500 peer-checked:text-black">正式応募 (書類選考)</span>
                    </label>
                    <div>
                        <label className="relative">
                            <input type="radio" name="entrytype" value={ENTRY_TYPE.CASUAL} defaultChecked={entryType===ENTRY_TYPE.CASUAL} onClick={()=>setEntryType(ENTRY_TYPE.CASUAL)} className="peer" />
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
                            <span className="ml-3 text-slate-500 peer-checked:text-black">カジュアル面談</span>
                        </label>
                        <p className="text-xs mt-2 text-slate-500">※ 募集状況を考慮し、面談を実施できない可能性もありますのでご了承ください</p>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h6 className="text-sm text-slate-900">希望職種</h6>
                <div className="mt-4 flex space-x-8">
                    <label className="relative">
                        <input type="checkbox" value={JOB_TYPE.JOB1} {...register('jobType')} className="peer" />
                        <div className="absolute pointer-events-none -left-1 top-0.5 block">
                            <div className="w-5 h-5 border border-slate-300 rounded bg-white">
                            </div>
                        </div>
                        <div className="absolute pointer-events-none -left-1 top-0.5 transition-transform scale-0 peer-checked:scale-100">
                            <div className="w-5 h-5 border border-blue-600 rounded bg-blue-600">
                                <svg className="w-5 h-5" viewBox="0 0 20 20">
                                    <polyline fill="none" stroke="#fff" strokeWidth={3} points="4,8 8,12, 15,5"/>
                                </svg>
                            </div>
                        </div>
                        <span className="ml-3 text-slate-500 peer-checked:text-black">Webアプリケーション開発者</span>
                    </label>
                    <label className="relative">
                        <input type="checkbox" value={JOB_TYPE.JOB2} {...register('jobType')} className="peer" />
                        <div className="absolute pointer-events-none -left-1 top-0.5 block">
                            <div className="w-5 h-5 border border-slate-300 rounded bg-white">
                            </div>
                        </div>
                        <div className="absolute pointer-events-none -left-1 top-0.5 transition-transform scale-0 peer-checked:scale-100">
                            <div className="w-5 h-5 border border-blue-600 rounded bg-blue-600">
                                <svg className="w-5 h-5" viewBox="0 0 20 20">
                                    <polyline fill="none" stroke="#fff" strokeWidth={3} points="4,8 8,12, 15,5"/>
                                </svg>
                            </div>
                        </div>
                        <span className="ml-3 text-slate-500 peer-checked:text-black">ネイティブアプリ開発者</span>
                    </label>
                </div>
                <p className="text-xs text-red-600 mt-1">{errors.jobType?.message}</p>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">お名前</label>
                <input type="hidden" {...register('type')}  value="1"/>
                <input type="text" placeholder="山田 太郎" {...register('name')} className="mt-2 border border-slate-400 rounded p-2 block w-full"/>
                <p className="text-xs text-red-600 mt-1">{errors.name?.message}</p>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">フリガナ</label>
                <input type="text" placeholder="ヤマダ タロウ" {...register('kana')} className="mt-2 border border-slate-400 rounded p-2 block w-full"/>
                <p className="text-xs text-red-600 mt-1">{errors.kana?.message}</p>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">Email</label>
                <input type="email" placeholder="yamada@teconet.co.jp" {...register('email')} className="mt-2 border border-slate-400 rounded p-2 block w-full"/>
                <p className="text-xs text-red-600 mt-1">{errors.email?.message}</p>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">直近でお勤めの会社</label>
                <input type="text" value={previousCompany} onChange={e=>{setPreviousCompany(e.target.value)}} placeholder="テコネット株式会社" className="mt-2 border border-slate-400 rounded p-2 block w-full"/>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">直近の職種・肩書</label>
                <input type="text" value={previousTitle} onChange={e=>{setPreviousTitle(e.target.value)}} placeholder="" className="mt-2 border border-slate-400 rounded p-2 block w-full"/>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">ソーシャルプロフィールURL</label>
                <input type="text" value={social} onChange={e=>{setSocial(e.target.value)}} placeholder="LinkedinやTwitterなど" className="mt-2 border border-slate-400 rounded p-2 block w-full"/>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">履歴書</label>
                <div className="flex items-center space-x-6">
                    <div className="relative inline-block mt-2">
                        <button type="button" onClick={() => {
                            if (resumeRef.current) {
                                resumeRef.current.click()
                            }
                        }}
                            className="relative z-10 rounded border-2 border-sky-600 text-sky-600 py-2 px-4 text-lg inline-flex items-center transition-colors hover:bg-sky-50">
                            <svg className="w-6 h-6 inline-block mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
                            </svg>
                            アップロード
                        </button>
                        <input 
                            ref={resumeRef} 
                            accept="image/*,.pdf,.xlsx,.xls,.doc,.docx"
                            onChange={(e) => {
                                onResumeChange(e)
                            }}
                            type="file" 
                            className="opacity-0 absolute inset-0 cursor-pointer"/>
                    </div>
                    <p className="text-xs text-slate-500">{resume? resume.name: ''}</p>
                </div>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">職務経歴書</label>
                <div className="flex items-center space-x-6">
                    <div className="relative inline-block mt-2">
                        <button type="button" onClick={() => {
                            if (cvRef.current) {
                                cvRef.current.click()
                            }
                        }}
                            className="relative z-10 rounded border-2 border-sky-600 text-sky-600 py-2 px-4 text-lg inline-flex items-center transition-colors hover:bg-sky-50">
                            <svg className="w-6 h-6 inline-block mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
                            </svg>
                            アップロード
                        </button>
                        <input 
                            ref={cvRef} 
                            accept="image/*,.pdf,.xlsx,.xls,.doc,.docx"
                            onChange={(e) => {
                                onCvChange(e)
                            }}
                            type="file" 
                            className="opacity-0 absolute inset-0 cursor-pointer"/>
                    </div>
                    <p className="text-xs text-slate-500">{cv? cv.name: ''}</p>
                </div>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">補足</label>
                <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows={5} className="mt-2 border border-slate-400 rounded p-2 block w-full" placeholder="ご相談の内容を記入してください"></textarea>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">個人情報の取り扱いについて</label>
                <div className="mt-2 border border-slate-400 rounded md:p-2 block w-full h-40 overflow-scroll">
                    <div className="p-4 ">
                        <Policy />
                    </div>
                </div>
            </div>
            <div className="flex justify-center py-4">
                <label className="relative">
                    <input type="checkbox" {...register('agreement')} className="peer" />
                    <div className="absolute pointer-events-none -left-1 top-0.5 block">
                        <div className="w-5 h-5 border border-slate-300 rounded bg-white">
                        </div>
                    </div>
                    <div className="absolute pointer-events-none -left-1 top-0.5 transition-transform scale-0 peer-checked:scale-100">
                        <div className="w-5 h-5 border border-blue-600 rounded bg-blue-600">
                            <svg className="w-5 h-5" viewBox="0 0 20 20">
                                <polyline fill="none" stroke="#fff" strokeWidth={3} points="4,8 8,12, 15,5"/>
                            </svg>
                        </div>
                    </div>
                    <span className="ml-3 text-slate-500 peer-checked:text-black">個人情報の取り扱いに同意する</span>
                </label>
            </div>
            <div className="flex justify-center">
                <ReCAPTCHA
                    sitekey="6LeuuRQlAAAAAFkO14i9KX2lpJmpPBYm_51iMI4b"
                    onChange={onChallenge}
                />
            </div>
            <div className="flex justify-center">
                <button disabled={!canSubmit()} className="block w-80 bg-blue-500 text-white py-3 rounded-md text-lg disabled:bg-slate-400" onClick={()=>{submit()}}>
                    送信する
                </button>
            </div>

        </div>
        {props.visible&&nowLoading && (
            <div className="flex justify-center min-h-[240px] items-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        )}
        </>
    )
}