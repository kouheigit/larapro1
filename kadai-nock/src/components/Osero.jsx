import React, { useState, useEffect, useCallback } from 'react';

const Osero = () => {
  const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState({ black: 2, white: 2 });

  const playSound = () => {
    try {
      const audio = new Audio('/src/components/sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

  const isValidMove = useCallback((row, col, player) => {
    if (board[row][col] !== null) return false;
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      let foundOpponent = false;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === null) break;
        if (board[r][c] === player) { if (foundOpponent) return true; break; }
        foundOpponent = true;
        r += dx; c += dy;
      }
    }
    return false;
  }, [board]);

  const flipStones = (row, col, player) => {
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    const stonesToFlip = [];
    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      const tempStones = [];
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === null) break;
        if (board[r][c] === player) { stonesToFlip.push(...tempStones); break; }
        tempStones.push([r, c]);
        r += dx; c += dy;
      }
    }
    return stonesToFlip;
  };

  const makeMove = (row, col) => {
    if (gameOver || board[row][col] !== null) return;
    if (!isValidMove(row, col, currentPlayer)) return;
    const newBoard = board.map(rowArr => [...rowArr]);
    newBoard[row][col] = currentPlayer;
    const stonesToFlip = flipStones(row, col, currentPlayer);
    stonesToFlip.forEach(([r, c]) => { newBoard[r][c] = currentPlayer; });
    setBoard(newBoard);
    playSound();
    const newScore = { black: 0, white: 0 };
    newBoard.forEach(r => r.forEach(cell => { if (cell === 'black') newScore.black++; if (cell === 'white') newScore.white++; }));
    setScore(newScore);
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    let hasValidMove = false;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(r, c, nextPlayer)) { hasValidMove = true; break; }
      }
      if (hasValidMove) break;
    }
    if (!hasValidMove) {
      let currentPlayerHasMove = false;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (isValidMove(r, c, currentPlayer)) { currentPlayerHasMove = true; break; }
        }
        if (currentPlayerHasMove) break;
      }
      if (!currentPlayerHasMove) { setGameOver(true); }
      else { alert(`${nextPlayer === 'black' ? '黒' : '白'}のパスです`); }
    } else {
      setCurrentPlayer(nextPlayer);
    }
  };

  const makeAIMove = useCallback(() => {
    if (currentPlayer === 'white' && !gameOver) {
      setTimeout(() => {
        const validMoves = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (isValidMove(r, c, 'white')) validMoves.push([r, c]);
          }
        }
        if (validMoves.length > 0) {
          let chosenMove;
          if (difficulty === 'easy') {
            chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else if (difficulty === 'normal') {
            const corners = validMoves.filter(([r, c]) => (r === 0 || r === 7) && (c === 0 || c === 7));
            const edges = validMoves.filter(([r, c]) => r === 0 || r === 7 || c === 0 || c === 7);
            if (corners.length > 0) chosenMove = corners[Math.floor(Math.random() * corners.length)];
            else if (edges.length > 0) chosenMove = edges[Math.floor(Math.random() * edges.length)];
            else chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else if (difficulty === 'hard') {
            let bestMove = validMoves[0];
            let bestScore = -Infinity;
            validMoves.forEach(([r, c]) => {
              const tempBoard = board.map(rowArr => [...rowArr]);
              tempBoard[r][c] = 'white';
              const stonesToFlip = flipStones(r, c, 'white');
              stonesToFlip.forEach(([fr, fc]) => { tempBoard[fr][fc] = 'white'; });
              let scoreVal = stonesToFlip.length;
              if ((r === 0 || r === 7) && (c === 0 || c === 7)) scoreVal += 10;
              else if (r === 0 || r === 7 || c === 0 || c === 7) scoreVal += 3;
              else if (r >= 2 && r <= 5 && c >= 2 && c <= 5) scoreVal += 1;
              if (scoreVal > bestScore) { bestScore = scoreVal; bestMove = [r, c]; }
            });
            chosenMove = bestMove;
          } else if (difficulty === 'extreme') {
            let bestMove = validMoves[0];
            let bestScore = -Infinity;
            validMoves.forEach(([r, c]) => {
              const tempBoard = board.map(rowArr => [...rowArr]);
              tempBoard[r][c] = 'white';
              const stonesToFlip = flipStones(r, c, 'white');
              stonesToFlip.forEach(([fr, fc]) => { tempBoard[fr][fc] = 'white'; });
              let scoreVal = stonesToFlip.length;
              if ((r === 0 || r === 7) && (c === 0 || c === 7)) scoreVal += 20;
              else if ((r === 0 && (c === 1 || c === 6)) || (r === 7 && (c === 1 || c === 6)) || (c === 0 && (r === 1 || r === 6)) || (c === 7 && (r === 1 || r === 6))) scoreVal -= 5;
              else if (r === 0 || r === 7 || c === 0 || c === 7) scoreVal += 5;
              else if (r >= 2 && r <= 5 && c >= 2 && c <= 5) scoreVal += 2;
              const opponentMoves = [];
              for (let or = 0; or < 8; or++) {
                for (let oc = 0; oc < 8; oc++) { if (isValidMove(or, oc, 'black')) opponentMoves.push([or, oc]); }
              }
              if (opponentMoves.length < 3) scoreVal += 3;
              if (scoreVal > bestScore) { bestScore = scoreVal; bestMove = [r, c]; }
            });
            chosenMove = bestMove;
          }
          makeMove(chosenMove[0], chosenMove[1]);
        }
      }, 500);
    }
  }, [currentPlayer, gameOver, difficulty, board, isValidMove]);

  useEffect(() => { makeAIMove(); }, [makeAIMove]);

  const resetGame = () => {
    setGameStarted(false);
    setBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
    setCurrentPlayer('black');
    setGameOver(false);
    setScore({ black: 0, white: 0 });
  };

  const startGame = () => { setGameStarted(true); };

  const styles = {
    page: { padding: 16, background: '#f7f7f7', minHeight: '100vh', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' },
    container: { maxWidth: 960, margin: '0 auto' },
    headingWrap: { textAlign: 'center', marginBottom: 24 },
    h1: { fontSize: 32, fontWeight: 800, margin: 0 },
    sub: { color: '#555', marginTop: 8 },
    card: { background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 16, marginBottom: 16 },
    center: { textAlign: 'center' },
    label: { display: 'block', fontWeight: 700, marginBottom: 8 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 },
    diffBtn: (active) => ({ padding: 12, borderRadius: 10, border: '1px solid #ddd', background: active ? '#16a34a' : '#f2f2f2', color: active ? '#fff' : '#333', fontWeight: 700, cursor: 'pointer' }),
    startBtn: { padding: '12px 20px', borderRadius: 10, background: '#0ea5e9', color: '#fff', fontWeight: 800, cursor: 'pointer', border: 'none' },
    infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    scoreCol: { textAlign: 'center' },
    scoreLabel: { color: '#666', fontWeight: 600 },
    scoreNum: { fontSize: 22, fontWeight: 800, color: '#222' },
    winner: { textAlign: 'center', padding: 12, background: '#fff7d6', borderRadius: 10, marginTop: 8, fontWeight: 700 },
    boardGrid: { display: 'grid', gridTemplateColumns: 'repeat(8, 44px)', gap: 6, justifyContent: 'center' },
    cell: (enabled, filled) => ({ width: 44, height: 44, borderRadius: 8, border: '2px solid ' + (filled ? '#d4a373' : '#cbd5e1'), background: filled ? '#ffe8b6' : enabled ? '#d1fae5' : '#eef2f7', cursor: enabled ? 'pointer' : 'not-allowed', position: 'relative', padding: 0, outline: 'none' }),
    stoneOuter: (color) => ({ position: 'absolute', width: 36, height: 36, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: color === 'black' ? '#111' : '#f5f5f5', boxShadow: 'inset 0 6px 10px rgba(255,255,255,0.2), inset 0 -6px 10px rgba(0,0,0,0.15)', display: 'block' }),
    resetBtn: { padding: '10px 16px', borderRadius: 10, background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headingWrap}>
          <h1 style={styles.h1}>オセロゲーム</h1>
          <div style={styles.sub}>シンプルUI（Tailwind不要）</div>
        </div>
      
      {!gameStarted ? (
          <div style={{ ...styles.card, ...styles.center }}>
            <h2 style={{ margin: 0, marginBottom: 16 }}>ゲーム設定</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>難易度を選択してください</label>
              <div style={styles.grid}>
                {[
                  { value: 'easy', label: '弱', emoji: '😊' },
                  { value: 'normal', label: '普通', emoji: '😐' },
                  { value: 'hard', label: '強', emoji: '😤' },
                  { value: 'extreme', label: '激強', emoji: '🔥' }
                ].map(({ value, label, emoji }) => (
                  <button key={value} onClick={() => setDifficulty(value)} style={styles.diffBtn(difficulty === value)}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{emoji}</div>
                    <div>{label}</div>
              </button>
            ))}
          </div>
            </div>

            <button onClick={startGame} style={styles.startBtn}>🎮 ゲーム開始</button>
        </div>
      ) : (
        <>
            <div style={styles.card}>
              <div style={styles.infoRow}>
                <div style={styles.center}>
                  <div style={{ fontWeight: 800 }}>現在のプレイヤー</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: currentPlayer === 'black' ? '#111' : '#999' }}>
                    {currentPlayer === 'black' ? '⚫ 黒' : '⚪ 白'}
            </div>
          </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={styles.scoreCol}>
                    <div style={styles.scoreLabel}>黒</div>
                    <div style={styles.scoreNum}>{score.black}</div>
                  </div>
                  <div style={styles.scoreCol}>
                    <div style={styles.scoreLabel}>白</div>
                    <div style={{ ...styles.scoreNum, color: '#666' }}>{score.white}</div>
                  </div>
                </div>
              </div>
              {gameOver && (
                <div style={styles.winner}>Winner {score.black > score.white ? '黒' : '白'}</div>
              )}
          </div>

            <div style={styles.card}>
              <div style={styles.boardGrid}>
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const enabled = !gameOver && cell === null && isValidMove(rowIndex, colIndex, currentPlayer);
                    const filled = cell !== null;
                    return (
                      <button key={`${rowIndex}-${colIndex}`} onClick={() => makeMove(rowIndex, colIndex)} disabled={!enabled} style={styles.cell(enabled, filled)}>
                        {cell && <div style={styles.stoneOuter(cell)} />}
              </button>
                    );
                  })
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button onClick={resetGame} style={styles.resetBtn}>🔄 リセット</button>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default Osero;


