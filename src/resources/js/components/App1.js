import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import ListPage from '../imports/ListPage';
import AddPage from '../imports/AddPage';

export default function App1(){
    return (
        <Router>
            <nav>
                <Link to="/list">リスト</Link>
                <Link to="/add">追加</Link>
            </nav>
            <Switch>
                <Route path="/list">
                    <ListPage />
                </Route>
                <Route path="/add">
                    <AddPage />
                </Route>
            </Switch>
        </Router>

    );
}


if (document.getElementById('App1')) {
    ReactDOM.render(<App1 />, document.getElementById('App1'));
}
