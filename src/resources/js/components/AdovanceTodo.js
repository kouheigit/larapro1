import React from 'react'
import ReactDOM from "react-dom";

function AdvanceTodo(){
    return(
        <div id="AdvanceTodo">
            <h1>これはテスト歌舞伎町</h1>
        </div>
    )
}
if (document.getElementById('AdvanceTodo')) {
    ReactDOM.render(<AdvanceTodo />, document.getElementById('AdvanceTodo'));
}
