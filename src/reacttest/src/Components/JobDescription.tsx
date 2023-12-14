import React, { useState } from "react";

export default function JobDescription(props: any) {
    const [tab, setTab] = useState(1)
    return (
        <>
            <div className="relative">
                <img src="/images/bg-job.jpg" className="w-screen md:w-[450px] lg:w-[500px] xl:w-[620px] h-auto absolute top-0 -right-20"/>
            </div>
            <div className='max-w-4xl mx-auto mt-60 px-4 lg:px-0 relative'>
                <h2 className='text-slate-700 text-4xl md:text-5xl font-black mt-20'>Job Description</h2>
                <h6 className='mt-4 text md:text-xl text-slate-500'>募集要項</h6>
                <ul className="flex mt-10 items-end">
                    <li>
                        <button onClick={()=>setTab(1)} className={`relative pt-3 pb-4 px-3 md:px-10 text-xl text-center transition-colors ${tab===1? 'text-gray-900': 'text-gray-500 hover:bg-slate-100 hover:text-gray-900'}`}>
                        Webアプリケーション開発者
                            <div className={`absolute bottom-0 left-0 w-full h-1 ${tab===1? 'bg-gradient-to-r from-cyan-500 to-blue-600': 'bg-slate-300'}`}></div>
                        </button>
                    </li>
                    <li>
                        <button onClick={()=>setTab(2)} className={`relative pt-3 pb-4 px-3 md:px-10 text-xl  text-center transition-colors ${tab===2? 'text-gray-900': 'text-gray-500 hover:bg-slate-100 hover:text-gray-900'}`}>
                        ネイティブアプリ開発者
                            <div className={`absolute bottom-0 left-0 w-full h-1 ${tab===2? 'bg-gradient-to-r from-cyan-500 to-blue-600': 'bg-slate-300'}`}></div>
                        </button>
                    </li>
                    <li className="grow h-1 bg-slate-300">

                    </li>
                </ul>
                {tab===1? (
                    <div>
                        <h3 className="py-8 text-2xl md:text-4xl">Webアプリケーション開発者</h3>
                        <h4 className="bg-slate-100 px-4 py-2 text-lg text-slate-700">職務内容</h4>
                        <div className="p-4">
                            <p className="text-slate-600 text-sm md:text-base">当社のWebアプリケーションの開発業務を担当していただきます。具体的には、下記の業務を担当していただきます。</p>
                            <ul className="list-disc pl-6 md:pl-10 mt-4 space-y-2 text-slate-600 text-sm md:text-base">
                                <li>クライアントの要望をヒアリングし、システム設計や開発計画を立てる。</li>
                                <li>フロントエンド技術を用いたWebアプリケーションの開発（HTML/CSS/JavaScript等）</li>
                                <li>サーバーサイドの開発（PHP/Java/Ruby等）</li>
                                <li>開発したアプリケーションの保守・運用・改善</li>
                                <li>チーム開発でのコードレビュー、テスト、品質管理</li>

                            </ul>
                        </div>
                        <h4 className="bg-slate-100 px-4 py-2 text-lg text-slate-700">応募資格</h4>
                        <div className="p-4">
                            <ul className=" list-disc pl-6 md:pl-10 space-y-4 text-slate-600 text-sm md:text-base">
                                <li>Webアプリケーションの開発経験が3年以上あること。</li>
                                <li>フロントエンド技術（HTML/CSS/JavaScript）に精通していること。</li>
                                <li>サーバーサイドの開発言語（PHP/Java/Ruby等）のいずれかで開発経験があること。</li>
                                <li>チーム開発でのコミュニケーション能力があること。</li>
                                <li>顧客折衝やプレゼンテーションができること。</li>
                                <li>常に新しい技術やトレンドに関心があり、自己学習能力が高いこと。</li>
                            </ul>
                        </div>
                    </div>
                ): tab===2? (
                    <div>
                        <h3 className="py-8 text-2xl md:text-4xl">ネイティブアプリ開発者</h3>
                        <h4 className="bg-slate-100 px-4 py-2 text-lg text-slate-700">職務内容</h4>
                        <div className="p-4">
                            <p className="text-slate-600 text-sm md:text-base">当社では、iOS/Androidアプリのネイティブアプリ開発者を募集しています。以下の条件に当てはまる方を歓迎します。</p>
                            <ul className="list-disc pl-6 md:pl-10 mt-4 space-y-2 text-slate-600 text-sm md:text-base">
                                <li>iOS/Androidアプリのネイティブアプリ開発</li>
                                <li>アプリの仕様策定、開発・テスト・リリースまでの一連の開発業務</li>
                            </ul>
                        </div>
                        <h4 className="bg-slate-100 px-4 py-2 text-lg text-slate-700">必須要件</h4>
                        <div className="p-4">
                            <ul className=" list-decimal pl-6 md:pl-10 space-y-4 text-slate-600 text-sm md:text-base">
                                <li>iOSまたはAndroidアプリ開発の経験があること</li>
                                <li>Objective-C/SwiftまたはJava/Kotlinのいずれかに熟達していること</li>
                                <li>Gitを使ったバージョン管理の経験があること</li>
                            </ul>
                        </div>
                        <h4 className="bg-slate-100 px-4 py-2 text-lg text-slate-700">歓迎要件</h4>
                        <div className="p-4">
                            <ul className=" list-decimal pl-6 md:pl-10 space-y-4 text-slate-600 text-sm md:text-base">
                                <li>大規模アプリ開発の経験があること</li>
                                <li>コミュニケーション能力が高く、チームでの開発が得意であること</li>
                                <li>UI/UXに関する知識・経験があること</li>
                            </ul>
                        </div>
                    </div>
                ): (
                    <div>&nbsp;</div>
                )}
            </div>
        </>
    )
}