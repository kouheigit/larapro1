import React from 'react'
import ReactDOM from 'react-dom';
import Layout from "../components/layout";

function Hero(){
    return (
       <div id="Hero">
           <h1>強くなりたい</h1>
           <p>願い泣いた</p>
       </div>
    )
}


if (document.getElementById('Hero')) {
    ReactDOM.render(<Hero />, document.getElementById('Hero'));
}
