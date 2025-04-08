import ReactDOM from 'react-dom';

function advanceTodo(){
    // list(count, setCount) に相当。セッションで言えば count = $_SESSION['count'];

    return (
        <div className="advanceTodo">
            <h2>これが正規の表現です</h2>
        </div>
    );
}

export default advanceTodo;

if (document.getElementById('advanceTodo')) {
    ReactDOM.render(<advanceTodo />, document.getElementById('advanceTodo'));
}
