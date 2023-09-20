import React from 'react';
import ReactDOM from 'react-dom';
function EachPosts(){
    const props1 = { title:'内田はなぜひいらぎ事件を起こしたのか?', url: 'post.html'}
    const props2 = { title:'内田の8連続記録はなぜ打ち立てられたのか?',url: 'post1.html'}
 return(
     <div id="Posts2">
         <section>
             <h2>おすすめ記事2</h2>
             <EachPosts {...props1} />
             <EachPosts {...props2} />
         </section>
     </div>
 )
}


if (document.getElementById('Posts2')) {
    ReactDOM.render(<Posts2 />, document.getElementById('Posts2'));
}
