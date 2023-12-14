import React from 'react';
import BgTop from './BgTop';
import Postform from "./Postform";
import Texttest from './Texttest';
import Access from './Access';

import JobDescription from './Components/JobDescription';
import OurTeam from './Components/OurTeam';
import Person from './Components/Person';
import Form from './Components/Form/Form'
import Footer from './Components/Footer';
import Logo3D from './Components/Logo3D';
import SystemIntegration from './Components/SystemIntegration';
import OpeningCover from './Components/OpeningCover';
import Career from './Components/Career';
import MobileApps from './Components/MobileApps';
import WebApps from './Components/WebApps';
import ServerNetwork from './Components/ServerNetwork';

function App() {
  return (
    <>
    <OpeningCover />
    <div className="App w-screen overflow-hidden">
      <BgTop />
      <div className='container mx-auto relative px-4 ld:px-0 xl:px-20'>
        <h1 className='text-white text-7xl md:text-[140px] lg:text-[200px] text-right font-black lg:mt-8'>teconet</h1>
        <h6 className='text-white text-xl lg:text-4xl text-right lg:mt-8'>あなたのビジネスを次のステージへ</h6>
        <p className='text-white text-right text-sm md:text-lg mt-8 md:mt-20 lg:mt-32'>
        テクノロジーを活用することで、<br />
        お客様のビジネスを進化させ、<br />
        成長に繋げます。
        </p>
        <Logo3D />
      </div>
      <SystemIntegration />

      <div className='relative pt-20 pb-20'>
        <svg className='hidden lg:block absolute left-0 w-screen h-auto' style={{top: (window.innerWidth-1333)*(-0.3) + 'px'}} viewBox="0 0 640 480">
          <line fill='none' stroke="#aaa" strokeWidth={0.2} x1={640} y1={0} x2={0} y2={400} />
        </svg>
        <svg className='hidden lg:block absolute left-0 w-screen h-auto' style={{top: (2728-window.innerWidth)*0.28 + 'px'}} viewBox="0 0 640 480">
          <line fill='none' stroke="#aaa" strokeWidth={0.2} x1={0} y1={0} x2={640} y2={400} />
        </svg>
        <div className='lg:max-w-5xl mx-auto relative md:mt-20 px-4 lg:px-0'>
          <div className='flex md:grid grid-cols-7'>
            <div className='col-span-4'>
              <h4 className='mt-4 text-5xl font-black text-slate-700'>Mobile <br className='md:hidden'/>Apps</h4>
              <h6 className='mt-4'>お客様のビジネスやご要望に応じたスマートフォンアプリ開発</h6>
              <p className='text-xs mt-4 leading-5 text-slate-500'>
                テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。
              </p>
            </div>
            <div className=' col-span-3 relative'>
              <MobileApps />
            </div>
          </div>
          <div className='flex md:grid grid-cols-7 mt-6'>
            <div className=' col-span-3 relative'>
              <WebApps />
            </div>
            <div className='relative col-span-4 py-10 md:py-32 lg:pl-20'>
              <h4 className='mt-4 text-5xl font-black text-slate-700 text-right md:text-left'>Web Apps</h4>
              <h6 className='mt-4 text-right md:text-left'>さまざまな技術分野における<br className='md:hidden' />豊富な受託開発実績</h6>
              <p className='text-xs mt-4 leading-5 text-slate-500'>
                テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。
              </p>
            </div>
          </div>
          <div className='flex md:grid grid-cols-7 py-10'>
            <div className=' col-span-4'>
              <h4 className='mt-4 text-5xl font-black text-slate-700'>Server<span className='hidden md:inline'> / </span><br className='md:hidden' />Network</h4>
              <h6 className='mt-4'>さまざまな技術分野における<br className='md:hidden'/>豊富な受託開発実績</h6>
              <p className='text-xs mt-4 leading-5 text-slate-500'>
                テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。テコネットの特徴をどうぞ。
              </p>
            </div>
            <div className='relative col-span-3'>
              <ServerNetwork />
            </div>
          </div>
        </div>
      </div>

      <Career />

      <div className='max-w-4xl mx-auto mt-20 px-4 lg:px-0'>
        <Person />
        <OurTeam />
      </div>
      <JobDescription />
      <Form />
      <Footer />
    </div>
    </>
  );
}

export default App;
