import React, { useState, useEffect } from 'react';

const Osero = () => {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1: 黒, -1: 白
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [blackCount, setBlackCount] = useState(0);
  const [whiteCount, setWhiteCount] = useState(0);

  // 盤面の初期化
  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(0));
    // 初期配置
    newBoard[3][3] = -1; // 白
    newBoard[3][4] = 1;  // 黒
    newBoard[4][3] = 1;  // 黒
    newBoard[4][4] = -1; // 白
    setBoard(newBoard);
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    updateCounts(newBoard);
  };

  // 石の数をカウント
  const updateCounts = (boardState) => {
    let black = 0;
    let white = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (boardState[i][j] === 1) black++;
        else if (boardState[i][j] === -1) white++;
      }
    }
    setBlackCount(black);
    setWhiteCount(white);
  };

  // 指定方向にひっくり返せる石があるかチェック
  const checkDirection = (board, row, col, player, deltaRow, deltaCol) => {
    const opponent = -player;
    let r = row + deltaRow;
    let c = col + deltaCol;
    let foundOpponent = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === opponent) {
        foundOpponent = true;
      } else if (board[r][c] === player && foundOpponent) {
        return true;
      } else {
        break;
      }
      r += deltaRow;
      c += deltaCol;
    }
    return false;
  };

  // 石を置けるかチェック
  const isValidMove = (board, row, col, player) => {
    if (board[row][col] !== 0) return false;

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    return directions.some(([deltaRow, deltaCol]) =>
      checkDirection(board, row, col, player, deltaRow, deltaCol)
    );
  };

  // 石をひっくり返す
  const flipStones = (board, row, col, player) => {
    const newBoard = board.map(row => [...row]);
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    directions.forEach(([deltaRow, deltaCol]) => {
      if (checkDirection(board, row, col, player, deltaRow, deltaCol)) {
        let r = row + deltaRow;
        let c = col + deltaCol;

        while (r >= 0 && r < 8 && c >= 0 && c < 8 && newBoard[r][c] === -player) {
          newBoard[r][c] = player;
          r += deltaRow;
          c += deltaCol;
        }
      }
    });

    newBoard[row][col] = player;
    return newBoard;
  };

  // 石を置く処理
  const handleCellClick = (row, col) => {
    if (gameOver || board[row][col] !== 0) return;

    if (isValidMove(board, row, col, currentPlayer)) {
      const newBoard = flipStones(board, row, col, currentPlayer);
      setBoard(newBoard);
      updateCounts(newBoard);

      // 次のプレイヤーに交代
      const nextPlayer = -currentPlayer;
      
      // 次のプレイヤーが置ける場所があるかチェック
      let hasValidMove = false;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (isValidMove(newBoard, i, j, nextPlayer)) {
            hasValidMove = true;
            break;
          }
        }
        if (hasValidMove) break;
      }

      if (hasValidMove) {
        setCurrentPlayer(nextPlayer);
      } else {
        // 次のプレイヤーが置けない場合、現在のプレイヤーが続行
        let currentPlayerHasMove = false;
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (isValidMove(newBoard, i, j, currentPlayer)) {
              currentPlayerHasMove = true;
              break;
            }
          }
          if (currentPlayerHasMove) break;
        }

        if (!currentPlayerHasMove) {
          // ゲーム終了
          setGameOver(true);
          if (blackCount > whiteCount) {
            setWinner('黒');
          } else if (whiteCount > blackCount) {
            setWinner('白');
          } else {
            setWinner('引き分け');
          }
        }
      }
    }
  };

  // ゲーム終了判定
  useEffect(() => {
    if (blackCount + whiteCount === 64) {
      setGameOver(true);
      if (blackCount > whiteCount) {
        setWinner('黒');
      } else if (whiteCount > blackCount) {
        setWinner('白');
      } else {
        setWinner('引き分け');
      }
    }
  }, [blackCount, whiteCount]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>オセロゲーム</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          現在のプレイヤー: {currentPlayer === 1 ? '黒' : '白'}
        </div>
        <div style={{ fontSize: '16px' }}>
          黒: {blackCount} | 白: {whiteCount}
        </div>
      </div>

      {gameOver && (
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: winner === '引き分け' ? '#666' : winner === '黒' ? '#000' : '#fff',
          backgroundColor: winner === '引き分け' ? '#f0f0f0' : winner === '黒' ? '#fff' : '#000',
          padding: '10px',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Winner: {winner}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 50px)', 
        gap: '2px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#228B22',
                border: '1px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: board[rowIndex][colIndex] === 0 ? 'pointer' : 'default',
                borderRadius: '3px'
              }}
            >
              {cell === 1 && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#000',
                  borderRadius: '50%',
                  border: '2px solid #333'
                }} />
              )}
              {cell === -1 && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  border: '2px solid #ccc'
                }} />
              )}
            </div>
          ))
        )}
      </div>

      <button 
        onClick={initializeBoard}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        新しいゲーム
      </button>
    </div>
  );
};

export default Osero;
