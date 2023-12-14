import React from 'react'
import ReactDOM from "react-dom";

export default function Sometext()
{
    return(
        <>
            <h1>ナメックムーブ</h1>
              <p>なめさん</p>
              <p>なめさん</p>
            <h1>くぅくぅくぅクリケット</h1>
        </>
    );
}

if (document.getElementById('Sometext')) {
    ReactDOM.render(<Sometext />, document.getElementById('Sometext'));
}
