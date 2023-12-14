import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const items = [
    {
        icon: '/images/icons/Business_-Honor.svg',
        title: '豊富な経験と技術力',
        description: '当社にはシステムインテグレーションに豊富な経験と技術力を持ったエンジニアが在籍しています。システムインテグレーションの専門知識を持ち、様々なプラットフォームやシステムの統合に対応できます。'
    },
    {
        icon: '/images/icons/Business_Innovation.svg',
        title: 'フレキシブルなソリューション',
        description: '当社は、お客様のニーズに合わせたフレキシブルなシステムインテグレーションのソリューションを提供します。カスタマイズされたソリューションにより、お客様のビジネスニーズに最適なシステム統合が実現できます。'
    },
    {
        icon: '/images/icons/Business_Speed.svg',
        title: 'オンタイムデリバリー',
        description: '当社は、約束された期限内にプロジェクトを完了することを重視しています。オンタイムデリバリーを実現するために、厳密なプロジェクト管理手法を採用しています。'
    },
    {
        icon: '/images/icons/Business_Advice.svg',
        title: 'シームレスなコミュニケーション',
        description: '当社は、お客様とのコミュニケーションを大切にしています。プロジェクトの進捗状況を適宜報告し、お客様からの要望や質問に迅速に対応します。'
    },
]

export default function SystemIntegration(props: any) {
    return (
        <>
        <div className='container mx-auto relative px-4 mt-32 2xl:mt-0 2xl:pr-40 xl:px-20'>
            <h3 className='text-slate-700 text-3xl md:text-5xl font-black'>System Integration</h3>
            <h6 className='text-slate-500 md:text-xl mt-3 lg:mt-6'>ITの最適化をワンストップでお届けします。</h6>
        </div>
            {window.innerWidth < 756? (
                <div className="mt-10">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={'auto'}
                    >
                        {items.map((item: any, i: number) => (
                            <SwiperSlide key={i} className="!w-[calc(100vw-80px)]">
                                <div className=" w-full px-4">
                                    <div>
                                        <img src={item.icon} className="w-10 h-auto" />
                                        <h5 className='mt-2 md:mt-4 font-bold'>{item.title}</h5>
                                        <p className='text-xs mt-2 md:mt-4 leading-5 text-slate-500'>
                                        {item.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ): (
                <div className='container mx-auto relative px-4 2xl:pr-40 xl:px-20'>
                    <div className='grid grid-cols-4 gap-4 lg:gap-6 mt-10 2xl:pr-60'>
                        {items.map((item: any, index: number) => (
                            <div key={index+'-2'}>
                                <img src={item.icon} className="w-10 h-auto" />
                                <h5 className='mt-4 font-bold'>{item.title}</h5>
                                <p className='text-xs mt-4 leading-5 text-slate-500'>
                                    {item.description}
                                </p>
                            </div> 
                        ))}
                    </div>
                </div>
    
            )}
        </>
    )
}