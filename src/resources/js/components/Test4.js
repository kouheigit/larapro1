import React from 'react'
import ReactDOM from 'react-dom';
function Test4() {
    return (
        <div className="hero">
            <h1>積極的内田</h1>
            <p>アクトレにアドバイスをした</p>
        </div>
    )
}


if (document.getElementById('test4')) {
    ReactDOM.render(<Test4 />, document.getElementById('test4'));
}


