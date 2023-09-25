import Layout from 'component/layout'

function MyApp({ Component, pagePros}){
    return (
        <Layout>
            <Component {...pagePros} />
        </Layout>
    )
}

export default MyApp
