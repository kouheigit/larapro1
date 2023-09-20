import React from 'react';
import ReactDOM from 'react-dom';

function EachPost(){
    return (
        <article>
            <a href="yahoo.co.jp">
                <h3>記事のタイトル</h3>
            </a>
        </article>
    )
}

//export default function Posts(){
function Posts(){
    return(
        <section>
            <h2>おすすめな記事</h2>
            <EachPost />
            <EachPost />
        </section>
    )
}

if (document.getElementById('Posts')) {
    ReactDOM.render(<Posts />, document.getElementById('Posts'));
}
