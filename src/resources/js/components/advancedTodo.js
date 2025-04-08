import React from 'react';
import ReactDOM from 'react-dom';

function Test2() {
    const test = (
        <div>
            <h1>Const test</h1>
            <p>Const test success</p>
        </div>
    );
    //returnが必須
    return test;
}


export default Test2;

if (document.getElementById('advancedTodo')) {
    ReactDOM.render(<Test2 />, document.getElementById('advancedTodo'));
}
