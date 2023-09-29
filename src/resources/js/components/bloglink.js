import React from 'react'
import ReactDOM from "react-dom";
import Link from 'next/js';
/*npm linkがインストールできない*/

export default function bloglink(){
    return (
        
        <Link href="/">
            <a>Cube</a>
        </Link>

    )
}


if (document.getElementById('bloglink')) {
    ReactDOM.render(<Bloghome />, document.getElementById('blogkink'));
}
