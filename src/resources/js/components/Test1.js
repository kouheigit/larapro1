import React from 'react';
import ReactDOM from 'react-dom';

function Test1() {
    return(<h1>This is a Test1 Value</h1>);
}


export default Test1;

if (document.getElementById('test1')) {
    ReactDOM.render(<Test1 />, document.getElementById('test1'));
}
