import React, { useState } from 'react';

// チェスの駒画像をインポート
// 白い駒
const whiteKing = '/src/assets/chess/white-king.png';
const whiteQueen = '/src/assets/chess/white-queen.png';
const whiteRook = '/src/assets/chess/white-rook.png';
const whiteBishop = '/src/assets/chess/white-bishop.png';
const whiteKnight = '/src/assets/chess/white-knight.png';
const whitePawn = '/src/assets/chess/white-pawn.png';

// 黒い駒
const blackKing = '/src/assets/chess/black-king.png';
const blackQueen = '/src/assets/chess/black-queen.png';
const blackRook = '/src/assets/chess/black-rook.png';
const blackBishop = '/src/assets/chess/black-bishop.png';
const blackKnight = '/src/assets/chess/black-knight.png';
const blackPawn = '/src/assets/chess/black-pawn.png';

// 駒の画像マップ
const pieceImages = {
    // 白い駒
    'wK': whiteKing,
    'wQ': whiteQueen,
    'wR': whiteRook,
    'wB': whiteBishop,
    'wN': whiteKnight,
    'wP': whitePawn,
    // 黒い駒
    'bK': blackKing,
    'bQ': blackQueen,
    'bR': blackRook,
    'bB': blackBishop,
    'bN': blackKnight,
    'bP': blackPawn,
};

function Chess() {
    // チェス盤の初期状態（8x8）
    const initialBoard = [
        ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
        ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
        ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
    ];

    const [board, setBoard] = useState(initialBoard);

    // 駒を描画する関数
    const renderPiece = (piece) => {
        if (!piece) return null;
        
        // 白のポーンだけサイズを調整（全体的に大きく）
        const isWhitePawn = piece === 'wP';
        const pieceSize = isWhitePawn ? '50px' : '46px';
        
        return (
            <img 
                src={pieceImages[piece]} 
                alt={piece}
                style={{
                    width: pieceSize,
                    height: pieceSize,
                    objectFit: 'contain'
                }}
                onError={(e) => {
                    // 画像が見つからない場合はテキストで表示
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                }}
            />
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Chess</h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 50px)',
                gridTemplateRows: 'repeat(8, 50px)',
                gap: '0',
                border: '2px solid #333',
                margin: '20px auto',
                width: 'fit-content'
            }}>
                {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: (rowIndex + colIndex) % 2 === 0 ? '#f0d9b5' : '#b58863',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}
                        >
                            {renderPiece(piece)}
                            {/* 画像が読み込めない場合のフォールバック */}
                            <span style={{ 
                                display: 'none', 
                                fontSize: '12px', 
                                fontWeight: 'bold',
                                color: piece && piece[0] === 'w' ? '#fff' : '#000'
                            }}>
                                {piece}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p>駒画像の配置場所: /src/assets/chess/</p>
                <p>必要な画像ファイル:</p>
                <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                    <li>white-king.png, white-queen.png, white-rook.png</li>
                    <li>white-bishop.png, white-knight.png, white-pawn.png</li>
                    <li>black-king.png, black-queen.png, black-rook.png</li>
                    <li>black-bishop.png, black-knight.png, black-pawn.png</li>
                </ul>
            </div>
        </div>
    );
}

export default Chess;