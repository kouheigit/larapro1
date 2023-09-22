/*import data list*/
import React from 'react'
import ReactDOM from 'react-dom';
import Hero from '../components/Comphero'

/*
function Compindex() {
    return (
        <div id="Compindex">
            <Hero />
        </div>
    );
}*/

import Layout from "../components/layout";

//The Compindex is the Home in the instruction book.
//Compindexは教本のHomeに該当します。
export default function Compindex(){
    return (
        <div id="Compindex">
            <Layout>
                <Hero />
            </Layout>
        </div>
    )
}
if (document.getElementById('Compindex')) {
    ReactDOM.render(<Compindex />, document.getElementById('Compindex'));
}
