import React from 'react'
import ReactDOM from "react-dom";


export default function bloglink(){
    return (

        <a href="/">
            <a>Cube</a>
        </a>

    )
}


if (document.getElementById('bloglink')) {
    ReactDOM.render(<Bloghome />, document.getElementById('blogkink'));
}
