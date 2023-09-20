import React from 'react'
import ReactDOM from "react-dom";

function EachPost(){
    return (
        <article>
            <a href="yahoo.co.jp">
                <h3>記事のタイトル</h3>
            </a>
        </article>
    )
}

function Posts(){
    return (
        <div id="Posts">
            <section>
                <h1>おすすめの記事</h1>
                <EachPost />
                <EachPost />
            </section>
        </div>
    )
}

if (document.getElementById('Posts')) {
    ReactDOM.render(<Posts />, document.getElementById('Posts'));
}
