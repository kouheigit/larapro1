import React from 'react'
import ReactDOM from "react-dom";
import Layout from "../components/Layout";


function Blogindex(){
    return (
        <div id="blogindex">
            <Layout>
                <h1>Testvalue</h1>
            </Layout>
        </div>
    )
}


if (document.getElementById('blogindex')) {
    ReactDOM.render(<Blogindex />, document.getElementById('blogindex'));
}
