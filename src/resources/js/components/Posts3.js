import React from 'react'
import ReactDOM from 'react-dom';

function Decoration(props){
    return (
        <div style={{ color: 'red' }}>
            {props.children}
        </div>
    )
}

function Posts3(){
    return (
        <div id="Posts3">
            <Decoration>
                <h1>CUBE</h1>
                <p>アウトプットしていくサイト</p>
            </Decoration>
        </div>
    )
}


if (document.getElementById('Posts3')) {
    ReactDOM.render(<Posts3 />, document.getElementById('Posts3'));
}
