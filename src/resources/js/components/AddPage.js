import ReactDOM from 'react-dom';
import React,{ useState }from 'react';
import ListPage from "./ListPage";

function AddPage(){
    return(
        <div>
            <h1>テスト追加ページ</h1>
        </div>
    );

}

export default AddPage;
if (document.getElementById('AddPage')) {
    ReactDOM.render(<AddPage />, document.getElementById('AddPage'));
}
