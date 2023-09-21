import React from 'react'
import ReactDOM from 'react-dom';

function Compindex(){
    return (
        <div id="Compindex">
                <h1>CUBE</h1>
                <p>アウトプットしていくサイト</p>
        </div>
    )
}

if (document.getElementById('Compindex')) {
    ReactDOM.render(<Compindex />, document.getElementById('Compindex'));
}

