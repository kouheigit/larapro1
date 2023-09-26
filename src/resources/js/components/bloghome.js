import React from 'react'
import ReactDOM from "react-dom";
import Bloghero from "../components/bloghero";


function Bloghome(){
    return (
        <div id="bloghome">
            <Bloghero title="シュメール斉藤"subtitle="介護士" />
        </div>
    )

}


if (document.getElementById('bloghome')) {
    ReactDOM.render(<Bloghome />, document.getElementById('bloghome'));
}
