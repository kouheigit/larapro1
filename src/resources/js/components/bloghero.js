import React from 'react'
import ReactDOM from "react-dom";
import Layout from "../components/Layout";

function Bloghero({ title, subtitle }){
    return (
        <div id="bloghero">
            <Layout>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </Layout>
        </div>
    )
}


if (document.getElementById('bloghero')) {
    ReactDOM.render(<Bloghero />, document.getElementById('bloghero'));
}
