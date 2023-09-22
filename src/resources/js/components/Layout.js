import React from 'react'
import ReactDOM from 'react-dom';

import Header from '../components/Compheader'
import Footer from '../components/Compfooter'

export default function Layout({ children }){
    return (
        <>
            <Header />
               <main>{children}</main>
            <Footer />
        </>
    )
}
