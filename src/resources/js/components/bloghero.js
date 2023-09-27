import React from 'react'
import ReactDOM from "react-dom";
import Layout from "../components/Layout";

export default function Bloghero({ title, subtitle, imageOn = false }){
    return (
        <div id="bloghero">
            <Layout>
                <h1>{title}</h1>
                <p>{subtitle}</p>
                {imageOn && <figure>[画像]</figure>}
            </Layout>
        </div>
    )
}


if (document.getElementById('bloghero')) {
    ReactDOM.render(<Bloghero />, document.getElementById('bloghero'));
}
