import React, { useState, useEffect, useCallback } from 'react';

const Osero = () => {
  const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState({ black: 2, white: 2 });

  console.log('Osero component rendered, gameStarted:', gameStarted);

  // 音声ファイルのパス（実際のプロジェクトでは適切な音声ファイルを配置）
  const playSound = () => {
    try {
      const audio = new Audio('/src/components/sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // 音声ファイルが見つからない場合は、Web Audio APIで音を生成
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      });
    } catch (error) {
      console.log('音声再生エラー:', error);
    }
  };

  // 初期化
  useEffect(() => {
    if (gameStarted) {
      const newBoard = Array(8).fill(null).map(() => Array(8).fill(null));
      newBoard[3][3] = 'white';
      newBoard[3][4] = 'black';
      newBoard[4][3] = 'black';
      newBoard[4][4] = 'white';
      setBoard(newBoard);
      setCurrentPlayer('black');
      setGameOver(false);
      setScore({ black: 2, white: 2 });
    }
  }, [gameStarted]);

  // 有効な手をチェック
  const isValidMove = useCallback((row, col, player) => {
    if (board[row][col] !== null) return false;

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
        if (board[r][c] === null) break;
        if (board[r][c] === player) {
          if (foundOpponent) return true;
          break;
        }
        foundOpponent = true;
        r += dx;
        c += dy;
      }
    }
    return false;
  }, [board]);

  // 石を裏返す
  const flipStones = (row, col, player) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    const stonesToFlip = [];

    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      const tempStones = [];

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === null) break;
        if (board[r][c] === player) {
          stonesToFlip.push(...tempStones);
          break;
        }
        tempStones.push([r, c]);
        r += dx;
        c += dy;
      }
    }

    return stonesToFlip;
  };

  // 手を打つ
  const makeMove = (row, col) => {
    if (gameOver || board[row][col] !== null) return;

    if (!isValidMove(row, col, currentPlayer)) return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;

    const stonesToFlip = flipStones(row, col, currentPlayer);
    stonesToFlip.forEach(([r, c]) => {
      newBoard[r][c] = currentPlayer;
    });

    setBoard(newBoard);
    playSound(); // 音を再生

    // スコア更新
    const newScore = { black: 0, white: 0 };
    newBoard.forEach(row => {
      row.forEach(cell => {
        if (cell === 'black') newScore.black++;
        if (cell === 'white') newScore.white++;
      });
    });
    setScore(newScore);

    // 次のプレイヤー
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    
    // 次のプレイヤーが有効な手を持っているかチェック
    let hasValidMove = false;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(r, c, nextPlayer)) {
          hasValidMove = true;
          break;
        }
      }
      if (hasValidMove) break;
    }

    if (!hasValidMove) {
      // 現在のプレイヤーが再度プレイできるかチェック
      let currentPlayerHasMove = false;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (isValidMove(r, c, currentPlayer)) {
            currentPlayerHasMove = true;
            break;
          }
        }
        if (currentPlayerHasMove) break;
      }

      if (!currentPlayerHasMove) {
        setGameOver(true);
      } else {
        // パス
        alert(`${nextPlayer === 'black' ? '黒' : '白'}のパスです`);
      }
    } else {
      setCurrentPlayer(nextPlayer);
    }
  };

  // AIの手
  const makeAIMove = useCallback(() => {
    if (currentPlayer === 'white' && !gameOver) {
      setTimeout(() => {
        const validMoves = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (isValidMove(r, c, 'white')) {
              validMoves.push([r, c]);
            }
          }
        }

        if (validMoves.length > 0) {
          let chosenMove;
          
          if (difficulty === 'easy') {
            // 簡単：ランダム
            chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else if (difficulty === 'normal') {
        // 普通：角を優先、次に端、最後にランダム
        const corners = validMoves.filter(([r, c]) => 
          (r === 0 || r === 7) && (c === 0 || c === 7)
        );
        const edges = validMoves.filter(([r, c]) => 
          r === 0 || r === 7 || c === 0 || c === 7
        );
            
            if (corners.length > 0) {
              chosenMove = corners[Math.floor(Math.random() * corners.length)];
            } else if (edges.length > 0) {
              chosenMove = edges[Math.floor(Math.random() * edges.length)];
            } else {
              chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            }
          } else if (difficulty === 'hard') {
            // 難しい：より戦略的
        let bestMove = validMoves[0];
            let bestScore = -Infinity;
            
            validMoves.forEach(([r, c]) => {
              const tempBoard = board.map(row => [...row]);
              tempBoard[r][c] = 'white';
              const stonesToFlip = flipStones(r, c, 'white');
              stonesToFlip.forEach(([fr, fc]) => {
                tempBoard[fr][fc] = 'white';
              });
              
              let score = stonesToFlip.length;
              
              // 角の価値
              if ((r === 0 || r === 7) && (c === 0 || c === 7)) {
                score += 10;
              }
              // 端の価値
              else if (r === 0 || r === 7 || c === 0 || c === 7) {
                score += 3;
              }
              // 中央の価値
              else if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
                score += 1;
              }
      
      if (score > bestScore) {
        bestScore = score;
                bestMove = [r, c];
              }
            });
            
            chosenMove = bestMove;
          } else if (difficulty === 'extreme') {
            // 激強：最適化された戦略
            let bestMove = validMoves[0];
            let bestScore = -Infinity;
            
            validMoves.forEach(([r, c]) => {
              const tempBoard = board.map(row => [...row]);
              tempBoard[r][c] = 'white';
              const stonesToFlip = flipStones(r, c, 'white');
              stonesToFlip.forEach(([fr, fc]) => {
                tempBoard[fr][fc] = 'white';
              });
              
              let score = stonesToFlip.length;
              
              // 角の価値（最高）
              if ((r === 0 || r === 7) && (c === 0 || c === 7)) {
                score += 20;
              }
              // 角の隣は避ける
              else if (
                (r === 0 && c === 1) || (r === 0 && c === 6) ||
                (r === 1 && c === 0) || (r === 1 && c === 1) ||
                (r === 1 && c === 6) || (r === 1 && c === 7) ||
                (r === 6 && c === 0) || (r === 6 && c === 1) ||
                (r === 6 && c === 6) || (r === 6 && c === 7) ||
                (r === 7 && c === 1) || (r === 7 && c === 6)
              ) {
                score -= 5;
              }
              // 端の価値
              else if (r === 0 || r === 7 || c === 0 || c === 7) {
                score += 5;
              }
              // 中央の価値
              else if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
                score += 2;
              }
              
              // 相手の次の手を考慮
              const opponentMoves = [];
              for (let or = 0; or < 8; or++) {
                for (let oc = 0; oc < 8; oc++) {
                  if (isValidMove(or, oc, 'black')) {
                    opponentMoves.push([or, oc]);
                  }
                }
              }
              
              if (opponentMoves.length < 3) {
                score += 3; // 相手の選択肢を減らす
              }
              
              if (score > bestScore) {
                bestScore = score;
                bestMove = [r, c];
              }
            });
            
            chosenMove = bestMove;
          }
          
          makeMove(chosenMove[0], chosenMove[1]);
        }
      }, 500);
    }
  }, [currentPlayer, gameOver, difficulty, board, isValidMove]);

  useEffect(() => {
    makeAIMove();
  }, [makeAIMove]);

  const resetGame = () => {
    setGameStarted(false);
    setBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
    setCurrentPlayer('black');
    setGameOver(false);
    setScore({ black: 0, white: 0 });
  };

  const startGame = () => {
    console.log('startGame function called');
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🎯 オセロゲーム
          </h1>
          <p className="text-gray-600 text-lg">モダンなデザインで楽しむオセロ</p>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800">Tailwind CSSが正常に動作しています！</p>
          </div>
        </div>
      
        {!gameStarted ? (
          /* ゲーム開始画面 */
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">ゲーム設定</h2>
            <p className="text-lg text-gray-600 mb-6">オセロゲームを開始します</p>
            
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                難易度を選択してください
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'easy', label: '簡単', emoji: '😊' },
                  { value: 'normal', label: '普通', emoji: '😐' },
                  { value: 'hard', label: '難しい', emoji: '😤' },
                  { value: 'extreme', label: '激強', emoji: '🔥' }
                ].map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => {
                      console.log('Difficulty selected:', value);
                      setDifficulty(value);
                    }}
                    className={`p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      difficulty === value
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">{emoji}</div>
                    <div>{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                console.log('Start game clicked');
                startGame();
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🎮 ゲーム開始
            </button>
          </div>
        ) : (
          /* ゲーム画面 */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">ゲーム中</h2>
              <p className="text-lg text-gray-600 mb-4">現在のプレイヤー: {currentPlayer === 'black' ? '⚫ 黒' : '⚪ 白'}</p>
              <p className="text-lg text-gray-600 mb-4">スコア - 黒: {score.black}, 白: {score.white}</p>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🔄 リセット
              </button>
            </div>
          </div>
      )}
      </div>
    </div>
  );
};

export default Osero;
