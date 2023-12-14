const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// MySQL接続情報
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'teconet-db',
    password: 'teconet-db',
    database: 'teconet-db'
});

app.use(cors());
app.use(express.json());


// MySQL接続
connection.connect((err) => {
    if (err) {
        console.error('MySQL接続エラー:', err);
        throw err;
    }
    console.log('MySQLに接続しました');
});

app.post('/api', (req, res) => {
    const { name, mail } = req.body;

    connection.query(
        'INSERT INTO mail(name, mail) VALUES (?, ?)',
        [name, mail],
        (error, results) => {
            if (error) {
                console.error('MySQLクエリエラー:', error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json({ message: 'Data inserted successfully' });
        }
    );
});



// ルートエンドポイントの追加
app.get('/api', (req, res) => {
    // MySQLからデータを取得
    connection.query(
        'SELECT * FROM `mail`',
        function (err, results, fields) {
            if (err) {
                console.error('MySQLクエリエラー:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            const message = results.map(result => result.name).join(', ');
            const mail = results.map(result => result.mail).join(', ');
            res.json({ message,mail});
            //res.json({ message: results });

            //res.json({ data: results });
        }
    );
});

/*
app.get('/api', (req, res) => {
    res.json({ message: 'エンドポイントAPIテスト成功' });
});*/

// サーバー起動
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

