import React from 'react';
import ReactDOM from 'react-dom';

function Eachpost(props){
    return(
        <article>
            <a href={props.url}>
                <h3>{props.title}</h3>
            </a>
        </article>
    )
}

function Posts1(){
    return(
        <div id="Posts1">
            <section>
                <h1>おすすめの記事その2</h1>
                <Eachpost title="スケジュール管理" url="yahoo.co.jp"></Eachpost>
                <Eachpost title="なめさんついに100即" url="google.com"></Eachpost>
            </section>
        </div>
    )
}
if (document.getElementById('Posts1')) {
    ReactDOM.render(<Posts1 />, document.getElementById('Posts1'));
}
