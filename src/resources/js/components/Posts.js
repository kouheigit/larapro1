import React from 'react'
import ReactDOM from "react-dom";

function Posts(){
    return (
        <section>
            <h2>おすすめ記事</h2>
        </section>
    )
}


if (document.getElementById('Posts')) {
    ReactDOM.render(<Posts />, document.getElementById('Posts'));
}
