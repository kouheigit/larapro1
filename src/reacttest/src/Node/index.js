const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 4000;

// MySQL接続情報
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'teconet-db',
    password: 'teconet-db',
    database: 'teconet-db'
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

/*問い合わせテーブル*/
app.post('/api', (req, res) => {
    const { type,name, kana, email, message } = req.body;
    connection.query(
        'INSERT INTO inquire(type,name,kana,email,contact) VALUES (?,?,?,?,?)',
        [type,name, kana, email,message],
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



/*応募エンドポイント*/
app.post('/apply', upload.fields([{ name: 'resume' }, { name: 'cv' }]), (req, res) => {
    /*アップロードFile情報*/
    const { entryType, jobType, name, kana, email,type,previousCompany,previousTitle,social,message } = req.body;
    const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;
    const cvFile = req.files['cv'] ? req.files['cv'][0] : null;

    /*拡張子だけ抜き出す処理*/
    const resumeFileExt = resumeFile ? path.extname(resumeFile.originalname) : '';
    const cvFileExt = cvFile ? path.extname(cvFile.originalname) : '';

    // データベースへの挿入処理
    connection.query(
        'INSERT INTO applicant(name, kana, email,entryType,jobType,type,previousCompany,previousTitle,social,contact) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [name, kana, email,entryType,jobType,type,previousCompany,previousTitle,social,message],
        (error, results) => {
            if (error) {
                console.error('MySQLクエリエラー:', error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (resumeFile) {
                const resumeFileName = `${name}_履歴書${resumeFileExt}`;
                const filePath = path.join(__dirname, 'file',resumeFileName); // ファイルの保存先パス
                fs.writeFileSync(filePath, resumeFile.buffer);
            }

            if (cvFile) {
                const cvFileName = `${name}_職務経歴書${cvFileExt}`;
                const filePath = path.join(__dirname, 'file', cvFileName); // ファイルの保存先パス
                fs.writeFileSync(filePath, cvFile.buffer);
            }

            res.json({ message: 'Apply Data inserted successfully' });
        }
    );
});

// サーバー起動
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

