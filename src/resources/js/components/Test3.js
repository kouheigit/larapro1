import React from 'react';
import ReactDOM from 'react-dom';

function Test3(){
    return(
     <React.Fragment>
         <h1 style={{ color: 'blue', fontSize: '30px' }}>新ページTest3追加</h1>
         <p>アウトプットしていくサイト</p>
     </React.Fragment>
    )
}

if (document.getElementById('test3')) {
    ReactDOM.render(<Test3 />, document.getElementById('test3'));
}
