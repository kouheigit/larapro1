import React from 'react'
import ReactDOM from "react-dom";

function Bloghero(){
    return (
        <div id="bloghero">
            <h1>ウルトラにいくなめだるま</h1>
        </div>
    )
}


if (document.getElementById('bloghero')) {
    ReactDOM.render(<Bloghero />, document.getElementById('bloghero'));
}
