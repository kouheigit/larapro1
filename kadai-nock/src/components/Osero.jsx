import React, { useState, useEffect } from 'react';

const Osero = () => {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1: 黒, -1: 白
  const [gameStatus, setGameStatus] = useState('difficulty'); // 'difficulty', 'playing', 'finished'
  const [difficulty, setDifficulty] = useState(null);
  const [winner, setWinner] = useState(null);
  const [blackCount, setBlackCount] = useState(0);
  const [whiteCount, setWhiteCount] = useState(0);

  // 8x8のボードを初期化
  const initializeBoard = () => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(0));
    newBoard[3][3] = -1; // 白
    newBoard[3][4] = 1;  // 黒
    newBoard[4][3] = 1;  // 黒
    newBoard[4][4] = -1; // 白
    return newBoard;
  };

  // ゲーム開始
  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setBoard(initializeBoard());
    setCurrentPlayer(1);
    setGameStatus('playing');
    setWinner(null);
    setBlackCount(2);
    setWhiteCount(2);
  };

  // 石を置ける場所をチェック
  const isValidMove = (board, row, col, player) => {
    if (board[row][col] !== 0) return false;

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      let foundOpponent = false;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === 0) break;
        if (board[r][c] === -player) {
          foundOpponent = true;
        } else if (board[r][c] === player && foundOpponent) {
          return true;
        } else {
          break;
        }
        r += dx;
        c += dy;
      }
    }
    return false;
  };

  // 石をひっくり返す
  const flipStones = (board, row, col, player) => {
    const newBoard = board.map(row => [...row]);
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      const stonesToFlip = [];

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (newBoard[r][c] === 0) break;
        if (newBoard[r][c] === -player) {
          stonesToFlip.push([r, c]);
        } else if (newBoard[r][c] === player) {
          stonesToFlip.forEach(([fr, fc]) => {
            newBoard[fr][fc] = player;
          });
          break;
        } else {
          break;
        }
        r += dx;
        c += dy;
      }
    }

    newBoard[row][col] = player;
    return newBoard;
  };

  // 有効な手を取得
  const getValidMoves = (board, player) => {
    const validMoves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(board, row, col, player)) {
          validMoves.push([row, col]);
        }
      }
    }
    return validMoves;
  };

  // 石の数をカウント
  const countStones = (board) => {
    let black = 0;
    let white = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 1) black++;
        else if (board[row][col] === -1) white++;
      }
    }
    return { black, white };
  };

  // 人間の手
  const handleCellClick = (row, col) => {
    if (gameStatus !== 'playing' || currentPlayer !== 1) return;
    if (!isValidMove(board, row, col, currentPlayer)) return;

    const newBoard = flipStones(board, row, col, currentPlayer);
    setBoard(newBoard);
    
    const { black, white } = countStones(newBoard);
    setBlackCount(black);
    setWhiteCount(white);

    // 次のプレイヤーに切り替え
    setCurrentPlayer(-1);
    
    // AIのターン
    setTimeout(() => {
      makeAIMove(newBoard);
    }, 500);
  };

  // AIの手
  const makeAIMove = (currentBoard) => {
    const validMoves = getValidMoves(currentBoard, -1);
    
    if (validMoves.length === 0) {
      // AIが置けない場合、人間のターンに戻る
      const humanValidMoves = getValidMoves(currentBoard, 1);
      if (humanValidMoves.length === 0) {
        // 両方とも置けない場合、ゲーム終了
        endGame(currentBoard);
        return;
      }
      setCurrentPlayer(1);
      return;
    }

    let bestMove;
    if (difficulty === 'easy') {
      // 簡単: ランダム
      bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    } else if (difficulty === 'medium') {
      // 中級: 角を優先、次に端、最後にランダム
      const corners = validMoves.filter(([r, c]) => 
        (r === 0 || r === 7) && (c === 0 || c === 7)
      );
      const edges = validMoves.filter(([r, c]) => 
        r === 0 || r === 7 || c === 0 || c === 7
      );
      
      if (corners.length > 0) {
        bestMove = corners[Math.floor(Math.random() * corners.length)];
      } else if (edges.length > 0) {
        bestMove = edges[Math.floor(Math.random() * edges.length)];
      } else {
        bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      }
    } else {
      // 難しい: より多くの石を取る手を選ぶ
      let maxFlips = -1;
      for (const [row, col] of validMoves) {
        const testBoard = flipStones(currentBoard, row, col, -1);
        const { black: newBlack, white: newWhite } = countStones(testBoard);
        const flips = newWhite - whiteCount;
        if (flips > maxFlips) {
          maxFlips = flips;
          bestMove = [row, col];
        }
      }
    }

    const [row, col] = bestMove;
    const newBoard = flipStones(currentBoard, row, col, -1);
    setBoard(newBoard);
    
    const { black, white } = countStones(newBoard);
    setBlackCount(black);
    setWhiteCount(white);

    // 人間のターンに戻る
    setCurrentPlayer(1);

    // 人間が置けるかチェック
    setTimeout(() => {
      const humanValidMoves = getValidMoves(newBoard, 1);
      if (humanValidMoves.length === 0) {
        const aiValidMoves = getValidMoves(newBoard, -1);
        if (aiValidMoves.length === 0) {
          endGame(newBoard);
        } else {
          setCurrentPlayer(-1);
          makeAIMove(newBoard);
        }
      }
    }, 100);
  };

  // ゲーム終了
  const endGame = (finalBoard) => {
    const { black, white } = countStones(finalBoard);
    setBlackCount(black);
    setWhiteCount(white);
    
    if (black > white) {
      setWinner('黒');
    } else if (white > black) {
      setWinner('白');
    } else {
      setWinner('引き分け');
    }
    
    setGameStatus('finished');
  };

  // ゲームリセット
  const resetGame = () => {
    setGameStatus('difficulty');
    setBoard([]);
    setCurrentPlayer(1);
    setWinner(null);
    setBlackCount(0);
    setWhiteCount(0);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>オセロゲーム</h1>
      
      {gameStatus === 'difficulty' && (
        <div style={{ textAlign: 'center' }}>
          <h2>難易度を選択してください</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => startGame('easy')}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
              簡単
            </button>
            <button 
              onClick={() => startGame('medium')}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
              中級
            </button>
            <button 
              onClick={() => startGame('hard')}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
              難しい
            </button>
          </div>
        </div>
      )}

      {gameStatus === 'playing' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <strong>黒: {blackCount}</strong>
            </div>
            <div>
              <strong>現在のプレイヤー: {currentPlayer === 1 ? '黒' : '白'}</strong>
            </div>
            <div>
              <strong>白: {whiteCount}</strong>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(8, 1fr)', 
            gap: '2px', 
            backgroundColor: '#228B22',
            padding: '10px',
            borderRadius: '5px'
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
                    cursor: currentPlayer === 1 ? 'pointer' : 'default',
                    borderRadius: '50%',
                    opacity: isValidMove(board, rowIndex, colIndex, currentPlayer) ? 1 : 0.7
                  }}
                >
                  {cell === 1 && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#000',
                      borderRadius: '50%'
                    }} />
                  )}
                  {cell === -1 && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      border: '1px solid #000'
                    }} />
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={resetGame}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
              リセット
            </button>
          </div>
        </div>
      )}

      {gameStatus === 'finished' && (
        <div style={{ textAlign: 'center' }}>
          <h2>ゲーム終了！</h2>
          <h3>結果: {winner}</h3>
          <div style={{ margin: '20px 0' }}>
            <p>黒: {blackCount}個</p>
            <p>白: {whiteCount}個</p>
          </div>
          <button 
            onClick={resetGame}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </div>
  );
};

export default Osero;
