import React from 'react'
import ReactDOM from "react-dom";
const subtitle = 'アウトプットしていくサイト'

function Test5(){
    return (
        <div>
            <h1>ウルトラにいくなめだるま</h1>
            <p>{subtitle}</p>
        </div>
    )
}


if (document.getElementById('test5')) {
    ReactDOM.render(<Test5 />, document.getElementById('test5'));
}
