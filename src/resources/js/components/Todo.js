import ReactDOM from 'react-dom';



function Todo(){
    return (
        <div className="todo">
            <h1>テスト表示</h1>
        </div>
    );
}

export default Todo;

if (document.getElementById('todo')) {
    ReactDOM.render(<Todo />, document.getElementById('todo'));
}

