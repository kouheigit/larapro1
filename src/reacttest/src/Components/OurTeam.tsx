import React from "react";

export default function OurTeam(props: any) {
    const items = [
        {
            icon: '/images/icons/avatar1.png',
            name: '20代男性',
            title: 'WEB開発',
            description: '入社してから3年が経ちましたが、毎日新しいことを学ぶことができて、とても充実しています。<br />会社は若手社員の意見にも耳を傾けてくれるので、自分たちでアイデアを出し、実現することができます。また、社内でのコミュニケーションも良く、先輩社員にはいつも助けてもらっています。<br />一緒に働く仲間たちもとても優秀で、切磋琢磨しながら日々成長しています。将来的には、自分が開発したサービスが多くの人に利用されるような仕事をしたいと思っています。'
        },
        {
            icon: '/images/icons/avatar2.png',
            name: '30代女性',
            title: 'アプリ開発',
            description: 'iPhoneネイティブアプリ開発者として働いています。<br />当社では、チームでアプリ開発を行っていますが、良いチームワークで仕事が進んでいると思います。私自身もアプリ開発の知識を深めるために勉強会に参加したり、技術書を読んだりしています。<br />より多くの人々に利用されるような、新しいサービスの開発に携わりたいと思っています。この会社での仕事が、私のスキルアップや成長に繋がっていることを実感しています。'
        },
        {
            icon: '/images/icons/avatar3.png',
            name: '30代男性',
            title: 'アプリ開発',
            description: '当社では、新しい技術やツールを積極的に取り入れているため、日々学ぶことが多いです。また、チームメンバーとの意見交換やコードレビューを通じて、技術の向上や品質の向上を図っています。<br />仕事以外でも、社内でのイベントやアクティビティが多く、楽しく過ごすことができます。また、会社はプライベートと仕事のバランスを取ることを重視しており、有給休暇の取得を推奨してくれます。<br />将来的には、より高度な開発業務に携わり、自分自身のスキルアップとともに、会社の成長に貢献したいと考えています。日々新しい課題に挑戦し、成長することができる環境です。'
        },
        {
            icon: '/images/icons/avatar4.png',
            name: '20代男性',
            title: 'WEB開発',
            description: '私は、入社してからまだ1年しか経っていませんが、すでに多くのことを学びました。特に、PHPとLaravelについて深く学ぶことができ、それを活かして開発業務に取り組んでいます。<br />リモート勤務での仕事も非常に快適で、同僚たちともスムーズにコミュニケーションを取ることができています。<br />今後も、より多くの知識やスキルを身につけていきたいと思っています。'
        },
        
    ]
    return (
        <>
            <h2 className='text-slate-700 text-5xl md:text-7xl font-black mt-20'>Our Team</h2>
            <h6 className='mt-4 md:text-xl text-slate-500'>テコネットの声</h6>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 mt-10'>
            {items.map((item: any, index: number) => (
                <div key={index} className="flex flex-col">
                    <p className='text-xs text-slate-500 leading-5 grow' dangerouslySetInnerHTML={{ __html: item.description }}>
                    </p>
                    <div className='h-0.5 my-4 bg-gradient-to-r from-cyan-500 to-blue-600'>
                    </div>
                    <div className='flex items-center gap-4 md:gap-8'>
                        <img className="w-16 h-16 rounded-full" src={item.icon} />
                        <div>
                        <h6 className='font-bold text-sm'>{item.name}</h6>
                        <p className='text-slate-600 text-xs'>{item.title}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </>
    )
}