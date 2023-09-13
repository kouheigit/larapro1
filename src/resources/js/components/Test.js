import React from 'react';
import ReactDOM from 'react-dom';


function Test() {
    return(<h1>Syamu</h1>);
}

export default Test;

if (document.getElementById('test')) {
    ReactDOM.render(<Test />, document.getElementById('test'));
}
