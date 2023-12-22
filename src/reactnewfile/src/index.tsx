import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import App from './App'; // Appコンポーネントのインポート

// Reactアプリケーションをレンダリング
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
