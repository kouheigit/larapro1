import React from 'react'
import ReactDOM from 'react-dom'
import Layout from 'component/layout'

function MyApp({ Component, pageProps }){
    return(
        <Layout>
            <Component{...pageProps} />
        </Layout>
    )
}

export default MyApp
