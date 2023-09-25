import React from 'react'
import ReactDOM from 'react-dom';
import Layout from "../components/layout";
import Example from "../components/Example";

export default function Hero(){
    return (
       <div id="herotest">
           <h1>CUBE</h1>
           <p>アウトプットしていくサイト</p>
       </div>
    )
}



if (document.getElementById('herotest')) {
    ReactDOM.render(<herotest />, document.getElementById('herotest'));
}
