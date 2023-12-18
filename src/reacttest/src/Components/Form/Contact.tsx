import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Policy from "./Policy";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const schema = yup.object().required().shape({
    name: yup.string().required('必須項目です'),
    kana: yup.string().matches(/^[ァ-ヶー　 ]+$/, 'カタカナを入力してください').required('必須項目です'),
    email: yup.string().email('メールアドレスの形式が異なります').required('必須項目です'),
    agreement: yup.bool().oneOf([true], '同意が必要です')
})

export default function Contact(props: any) {
    const {register, formState: {isValid, errors}, getValues, setValue} = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            type: '0',
            name: '',
            kana: '',
            email: '',
            agreement: false
        }
    })
    const [message, setMessage] = useState('')
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
            type: getValues('type'),
            name: getValues('name'),
            kana: getValues('kana'),
            email: getValues('email'),
            message: message
        }
        const url = 'http://localhost:8081/api/Reactapi'
        setNowLoading(true)
        axios.post(url, payload).then(res => {
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
            <div>
                <label className="text-sm text-slate-900 block">お名前</label>
                <input type="hidden" {...register('type')}  value="0"/>
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
                <input type="text" placeholder="yamada@teconet.co.jp" {...register('email')} className="mt-2 border border-slate-400 rounded p-2 block w-full"/>
                <p className="text-xs text-red-600 mt-1">{errors.email?.message}</p>
            </div>
            <div>
                <label className="text-sm text-slate-900 block">お問い合わせ内容</label>
                <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows={5} className="mt-2 border border-slate-400 rounded p-2 block w-full"></textarea>
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
