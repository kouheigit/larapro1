import React from "react";

export default function Person(props: any) {
    const items = [
        {
            icon: '/images/icons/Business_Edit.svg',
            title: '技術力',
            description: 'プログラム開発に必要な技術力が高い人材を求めます。'
        },
        {
            icon: '/images/icons/Business_Conversation.svg',
            title: 'コミュニケーション能力',
            description: 'チーム内でのコミュニケーションや顧客とのコミュニケーションが円滑に行える人材を求めます。'
        },
        {
            icon: '/images/icons/Business_Strategy.svg',
            title: '解決能力',
            description: '問題解決能力が高く、自ら考えて行動できる人材を求めます。'
        },
        {
            icon: '/images/icons/Business_-Bookmarks.svg',
            title: '経験値',
            description: '開発経験が豊富な人材を求めます。'
        },
        {
            icon: '/images/icons/Business_Signature.svg',
            title: '学習能力',
            description: '新しい技術や開発手法に対して積極的に学び、習得できる人材を求めます。'
        },
        {
            icon: '/images/icons/Business_Cash.svg',
            title: '柔軟性',
            description: '柔軟な発想や考え方があり、様々な状況に対応できる人材を求めます。'
        },
    ]
    return (
        <>
            <h2 className='text-slate-700 text-5xl md:text-7xl font-black'>Person</h2>
            <h6 className='mt-4 lg:text-xl text-slate-500'>求める人材</h6>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-20 gap-y-6 mt-8'>
            {items.map((item: any, index: number) => (
                <div key={index}>
                    <img src={item.icon} className="w-10 h-10" />
                    <h5 className='mt-4 text-lg'>{item.title}</h5>
                    <p className='text-xs mt-3 leading-5 text-slate-500'>
                        {item.description}
                    </p>
                </div>
            ))}
            </div>
        </>
    )
}