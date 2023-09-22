import React from 'react'
import ReactDOM from 'react-dom';
import Layout from "../components/layout";

//MyApp
function MyApp({ Component, pageProps }){
    return (
            <Layout>
                return <Component {...pageProps} />
            </Layout>
        )
}

export default MyApp



