import React, { useState, useEffect, useCallback, useRef } from 'react';

const Packman = () => {
  // ゲームの基本設定
  const CELL_SIZE = 20;
  const MAZE_WIDTH = 19;
  const MAZE_HEIGHT = 21;
  const GAME_WIDTH = MAZE_WIDTH * CELL_SIZE;
  const GAME_HEIGHT = MAZE_HEIGHT * CELL_SIZE;

  // ゲーム状態
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    gameWon: false,
    paused: false,
    powerMode: false,
    powerModeTime: 0,
    dotsEaten: 0,
    totalDots: 240,
    gameStarted: false
  });

  // パックマンの状態
  const [packman, setPackman] = useState({
    x: 9,
    y: 15,
    direction: 'right',
    nextDirection: 'right'
  });

  // ゴーストの状態（食べられた状態を追加）
  const [ghosts, setGhosts] = useState([
    { id: 'blinky', x: 9, y: 9, color: 'red', mode: 'chase', direction: 'left', eaten: false },
    { id: 'pinky', x: 9, y: 9, color: 'pink', mode: 'chase', direction: 'right', eaten: false },
    { id: 'inky', x: 8, y: 9, color: 'cyan', mode: 'chase', direction: 'up', eaten: false },
    { id: 'clyde', x: 10, y: 9, color: 'orange', mode: 'chase', direction: 'down', eaten: false }
  ]);

  // 迷路の状態管理（動的に変更可能にする）
  const [mazeState, setMazeState] = useState([
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,3,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,3,1],
    [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]);

  const gameRef = useRef(null);
  const animationRef = useRef(null);

  // キーボード入力の処理
  const handleKeyPress = useCallback((e) => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.gameWon) return;

    e.preventDefault(); // デフォルトの動作を防ぐ

    switch(e.key) {
      case 'ArrowUp':
        setPackman(prev => ({ ...prev, nextDirection: 'up' }));
        break;
      case 'ArrowDown':
        setPackman(prev => ({ ...prev, nextDirection: 'down' }));
        break;
      case 'ArrowLeft':
        setPackman(prev => ({ ...prev, nextDirection: 'left' }));
        break;
      case 'ArrowRight':
        setPackman(prev => ({ ...prev, nextDirection: 'right' }));
        break;
      case ' ':
        setGameState(prev => ({ ...prev, paused: !prev.paused }));
        break;
    }
  }, [gameState.gameStarted, gameState.gameOver, gameState.gameWon]);

  // 壁の衝突判定
  const canMove = (x, y, direction) => {
    let newX = x;
    let newY = y;

    switch(direction) {
      case 'up':
        newY = y - 1;
        break;
      case 'down':
        newY = y + 1;
        break;
      case 'left':
        newX = x - 1;
        break;
      case 'right':
        newX = x + 1;
        break;
    }

    // ワープトンネルの処理
    if (newX < 0) newX = MAZE_WIDTH - 1;
    if (newX >= MAZE_WIDTH) newX = 0;

    // 壁のチェック
    if (newY < 0 || newY >= MAZE_HEIGHT) return false;
    if (mazeState[newY][newX] === 1) return false;

    return true;
  };

  // パックマンの移動
  const movePackman = useCallback(() => {
    setPackman(prev => {
      const { x, y, direction, nextDirection } = prev;
      
      // 次の方向に移動可能かチェック
      if (canMove(x, y, nextDirection)) {
        let newX = x;
        let newY = y;

        switch(nextDirection) {
          case 'up':
            newY = y - 1;
            break;
          case 'down':
            newY = y + 1;
            break;
          case 'left':
            newX = x - 1;
            break;
          case 'right':
            newX = x + 1;
            break;
        }

        // ワープトンネル
        if (newX < 0) newX = MAZE_WIDTH - 1;
        if (newX >= MAZE_WIDTH) newX = 0;

        return { ...prev, x: newX, y: newY, direction: nextDirection };
      } else if (canMove(x, y, direction)) {
        // 現在の方向で移動継続
        let newX = x;
        let newY = y;

        switch(direction) {
          case 'up':
            newY = y - 1;
            break;
          case 'down':
            newY = y + 1;
            break;
          case 'left':
            newX = x - 1;
            break;
          case 'right':
            newX = x + 1;
            break;
        }

        if (newX < 0) newX = MAZE_WIDTH - 1;
        if (newX >= MAZE_WIDTH) newX = 0;

        return { ...prev, x: newX, y: newY };
      }

      return prev;
    });
  }, []);

  // 音効果の生成
  const playEatSound = useCallback(() => {
    // Web Audio APIを使用してパクっという音を生成
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, []);

  // ドットやパワークッキーの処理
  const handleDotEaten = useCallback((x, y) => {
    if (mazeState[y][x] === 2) {
      // 通常ドット
      playEatSound(); // 音効果
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10,
        dotsEaten: prev.dotsEaten + 1
      }));
      setMazeState(prev => {
        const newMaze = [...prev];
        newMaze[y] = [...newMaze[y]];
        newMaze[y][x] = 0; // ドットを削除
        return newMaze;
      });
    } else if (mazeState[y][x] === 3) {
      // パワークッキー
      console.log('パワークッキーを食べた！パワーモード発動');
      playEatSound(); // 音効果
      setGameState(prev => ({
        ...prev,
        score: prev.score + 50,
        dotsEaten: prev.dotsEaten + 1,
        powerMode: true,
        powerModeTime: 100 // 約10秒（10fps）
      }));
      setMazeState(prev => {
        const newMaze = [...prev];
        newMaze[y] = [...newMaze[y]];
        newMaze[y][x] = 0; // パワークッキーを削除
        return newMaze;
      });
    }
  }, [playEatSound]);

  // ゴーストのAI実装
  const moveGhost = useCallback((ghost) => {
    const { x, y, id, mode } = ghost;
    const packmanX = packman.x;
    const packmanY = packman.y;

    let targetX = packmanX;
    let targetY = packmanY;

    // 各ゴーストの個別AI
    switch(id) {
      case 'blinky': // 赤 - 直接追いかける
        targetX = packmanX;
        targetY = packmanY;
        break;
      
      case 'pinky': // ピンク - 4マス先を狙う
        switch(packman.direction) {
          case 'up':
            targetX = packmanX;
            targetY = packmanY - 4;
            break;
          case 'down':
            targetX = packmanX;
            targetY = packmanY + 4;
            break;
          case 'left':
            targetX = packmanX - 4;
            targetY = packmanY;
            break;
          case 'right':
            targetX = packmanX + 4;
            targetY = packmanY;
            break;
        }
        break;
      
      case 'inky': // 水色 - 赤ゴーストとパックマンの位置を組み合わせ
        const blinkyGhost = ghosts.find(g => g.id === 'blinky');
        targetX = packmanX + (packmanX - blinkyGhost.x);
        targetY = packmanY + (packmanY - blinkyGhost.y);
        break;
      
      case 'clyde': // オレンジ - 近いと逃げる、遠いと追いかける
        const distance = Math.abs(x - packmanX) + Math.abs(y - packmanY);
        if (distance < 8) {
          // 逃げる
          targetX = 0;
          targetY = MAZE_HEIGHT - 1;
        } else {
          // 追いかける
          targetX = packmanX;
          targetY = packmanY;
        }
        break;
    }

    // パワーモード中は逃げる（より確実に逃げるように改善）
    if (gameState.powerMode) {
      // パックマンから遠ざかる方向に移動
      const dx = x - packmanX;
      const dy = y - packmanY;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        targetX = dx > 0 ? x + 5 : x - 5;
        targetY = y;
      } else {
        targetX = x;
        targetY = dy > 0 ? y + 5 : y - 5;
      }
    }

    // 最短経路を計算（簡易版）
    const directions = ['up', 'down', 'left', 'right'];
    let bestDirection = ghost.direction;
    let bestDistance = Infinity;

    directions.forEach(dir => {
      if (canMove(x, y, dir)) {
        let newX = x;
        let newY = y;

        switch(dir) {
          case 'up':
            newY = y - 1;
            break;
          case 'down':
            newY = y + 1;
            break;
          case 'left':
            newX = x - 1;
            break;
          case 'right':
            newX = x + 1;
            break;
        }

        if (newX < 0) newX = MAZE_WIDTH - 1;
        if (newX >= MAZE_WIDTH) newX = 0;

        const distance = Math.abs(newX - targetX) + Math.abs(newY - targetY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestDirection = dir;
        }
      }
    });

    // 移動実行（壁の衝突チェックを追加）
    let newX = x;
    let newY = y;

    switch(bestDirection) {
      case 'up':
        newY = y - 1;
        break;
      case 'down':
        newY = y + 1;
        break;
      case 'left':
        newX = x - 1;
        break;
      case 'right':
        newX = x + 1;
        break;
    }

    // ワープトンネル
    if (newX < 0) newX = MAZE_WIDTH - 1;
    if (newX >= MAZE_WIDTH) newX = 0;

    // 壁の衝突チェック（ゴーストが壁にぶつからないように）
    if (newY < 0 || newY >= MAZE_HEIGHT || mazeState[newY][newX] === 1) {
      // 移動できない場合は現在の位置を維持
      return ghost;
    }

    return { ...ghost, x: newX, y: newY, direction: bestDirection };
  }, [packman, ghosts, gameState.powerMode]);

  // ゲームループ
  const gameLoop = useCallback(() => {
    if (!gameState.gameStarted || gameState.paused || gameState.gameOver || gameState.gameWon) return;

    // パックマンの移動
    movePackman();

    // ドットを食べたかチェック
    handleDotEaten(packman.x, packman.y);

    // ゴーストの移動
    setGhosts(prev => prev.map(ghost => moveGhost(ghost)));

    // パワーモードの時間管理（改善版）
    if (gameState.powerMode) {
      if (gameState.powerModeTime > 0) {
        setGameState(prev => ({
          ...prev,
          powerModeTime: prev.powerModeTime - 1
        }));
      } else {
        // パワーモード終了
        console.log('パワーモード終了');
        setGameState(prev => ({
          ...prev,
          powerMode: false,
          powerModeTime: 0
        }));
      }
    }

    // クリア条件チェック（迷路内のドットとパワークッキーがすべて0になったかチェック）
    const remainingDots = mazeState.flat().filter(cell => cell === 2 || cell === 3).length;
    if (remainingDots === 0) {
      setGameState(prev => ({ ...prev, gameWon: true }));
    }

  }, [gameState.gameStarted, gameState.paused, gameState.gameOver, gameState.gameWon, gameState.powerMode, gameState.powerModeTime, packman.x, packman.y, mazeState, movePackman, handleDotEaten, moveGhost]);

  // ゴーストとの衝突判定（完全に修正版 - 確実に動作）
  const checkGhostCollision = useCallback(() => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.gameWon) return;

    // 現在のパックマンとゴーストの位置を取得
    const currentPackmanX = packman.x;
    const currentPackmanY = packman.y;
    
    // 各ゴーストとの衝突をチェック（食べられた状態を考慮）
    ghosts.forEach(ghost => {
      // 食べられていないゴーストのみチェック
      if (!ghost.eaten && ghost.x === currentPackmanX && ghost.y === currentPackmanY) {
        console.log('ゴーストとの衝突検出:', ghost.id, 'パワーモード:', gameState.powerMode, '残り時間:', gameState.powerModeTime);
        
        if (gameState.powerMode && gameState.powerModeTime > 0) {
          // パワーモード中：ゴーストを食べる
          console.log('ゴーストを食べる！', ghost.id);
          playEatSound(); // 音効果
          
          // スコアを追加
          setGameState(prev => {
            console.log('スコア追加:', prev.score, '->', prev.score + 200);
            return {
              ...prev,
              score: prev.score + 200
            };
          });
          
          // ゴーストを「食べられた」状態にして、ゴーストハウスに戻す
          setGhosts(prev => {
            console.log('ゴーストをリセット:', ghost.id);
            return prev.map(g => 
              g.id === ghost.id ? { ...g, x: 9, y: 9, mode: 'chase', eaten: true } : g
            );
          });
          
          // 3秒後にゴーストを復活させる
          setTimeout(() => {
            setGhosts(prev => prev.map(g => 
              g.id === ghost.id ? { ...g, eaten: false } : g
            ));
          }, 3000);
        } else {
          // パワーモード中でない：ミス
          console.log('ミス！', ghost.id);
          setGameState(prev => ({
            ...prev,
            lives: prev.lives - 1,
            gameOver: prev.lives <= 1
          }));
          // パックマンをリセット
          setPackman(prev => ({ ...prev, x: 9, y: 15 }));
          // ゴーストもリセット
          setGhosts(prev => prev.map(g => ({ ...g, x: 9, y: 9, mode: 'chase', eaten: false })));
        }
      }
    });
  }, [packman.x, packman.y, ghosts, gameState.gameStarted, gameState.gameOver, gameState.gameWon, gameState.powerMode, gameState.powerModeTime, playEatSound]);

  // 衝突判定をゲームループに統合（高頻度版）
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.gameStarted && !gameState.gameOver && !gameState.gameWon) {
        checkGhostCollision();
      }
    }, 16); // 60fpsで衝突判定（最高頻度）

    return () => clearInterval(interval);
  }, [checkGhostCollision, gameState.gameStarted, gameState.gameOver, gameState.gameWon]);

  // ゲーム開始処理
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  }, []);

  // ゲームリセット処理
  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      gameWon: false,
      paused: false,
      powerMode: false,
      powerModeTime: 0,
      dotsEaten: 0,
      totalDots: 240,
      gameStarted: false
    });
    setPackman({ x: 9, y: 15, direction: 'right', nextDirection: 'right' });
    setGhosts([
      { id: 'blinky', x: 9, y: 9, color: 'red', mode: 'chase', direction: 'left', eaten: false },
      { id: 'pinky', x: 9, y: 9, color: 'pink', mode: 'chase', direction: 'right', eaten: false },
      { id: 'inky', x: 8, y: 9, color: 'cyan', mode: 'chase', direction: 'up', eaten: false },
      { id: 'clyde', x: 10, y: 9, color: 'orange', mode: 'chase', direction: 'down', eaten: false }
    ]);
    setMazeState([
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
      [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
      [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
      [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
      [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
      [1,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,1],
      [0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0],
      [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
      [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
      [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
      [1,3,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,3,1],
      [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
      [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
      [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]);
  }, []);

  // ゲームの初期化
  useEffect(() => {
    const interval = setInterval(gameLoop, 100); // 10fps
    return () => clearInterval(interval);
  }, [gameLoop]);

  // キーボードイベントの設定
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyPress(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // 迷路の描画
  const renderMaze = () => {
    return mazeState.map((row, y) =>
      row.map((cell, x) => {
        let cellStyle = {
          position: 'absolute',
          left: x * CELL_SIZE,
          top: y * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: cell === 1 ? '#0000FF' : '#000000',
          border: '1px solid #0000FF'
        };

        if (cell === 2) {
          // ドット
          return (
            <div key={`${x}-${y}`} style={cellStyle}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '4px',
                height: '4px',
                backgroundColor: '#FFFF00',
                borderRadius: '50%'
              }} />
            </div>
          );
        } else if (cell === 3) {
          // パワークッキー
          return (
            <div key={`${x}-${y}`} style={cellStyle}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                backgroundColor: '#FFFF00',
                borderRadius: '50%'
              }} />
            </div>
          );
        }

        return <div key={`${x}-${y}`} style={cellStyle} />;
      })
    );
  };

  // パックマンの描画
  const renderPackman = () => {
    return (
      <div style={{
        position: 'absolute',
        left: packman.x * CELL_SIZE + CELL_SIZE / 2 - 8,
        top: packman.y * CELL_SIZE + CELL_SIZE / 2 - 8,
        width: '16px',
        height: '16px',
        backgroundColor: '#FFFF00',
        borderRadius: '50%',
        transform: `rotate(${
          packman.direction === 'right' ? 0 :
          packman.direction === 'down' ? 90 :
          packman.direction === 'left' ? 180 : 270
        }deg)`,
        transition: 'all 0.1s ease'
      }} />
    );
  };

  // ゴーストの描画（食べられた状態を考慮）
  const renderGhosts = () => {
    return ghosts
      .filter(ghost => !ghost.eaten) // 食べられていないゴーストのみ描画
      .map(ghost => (
        <div key={ghost.id} style={{
          position: 'absolute',
          left: ghost.x * CELL_SIZE + CELL_SIZE / 2 - 8,
          top: ghost.y * CELL_SIZE + CELL_SIZE / 2 - 8,
          width: '16px',
          height: '16px',
          backgroundColor: gameState.powerMode ? '#0000FF' : ghost.color,
          borderRadius: '50% 50% 0 0',
          transition: 'all 0.1s ease',
          opacity: gameState.powerMode ? 0.5 : 1,
          border: gameState.powerMode ? '3px solid #FFFFFF' : 'none',
          boxShadow: gameState.powerMode ? '0 0 12px #FFFFFF, 0 0 24px #00FFFF' : 'none',
          animation: gameState.powerMode ? 'blink 0.3s infinite alternate' : 'none',
          zIndex: gameState.powerMode ? 10 : 1
        }} />
      ));
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <style>
        {`
          @keyframes blink {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <h1>🎮 パックマン</h1>
      
      {/* スタート画面 */}
      {!gameState.gameStarted && !gameState.gameOver && !gameState.gameWon && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#FFFF00', marginBottom: '20px' }}>ゲームスタート</h2>
          <button 
            onClick={startGame}
            style={{
              fontSize: '24px',
              padding: '15px 30px',
              backgroundColor: '#FFFF00',
              color: '#000000',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🎮 スタート
          </button>
          <p style={{ marginTop: '20px', fontSize: '16px' }}>
            全ドットを食べ切ってクリアを目指そう！
          </p>
        </div>
      )}

      {/* ゲーム情報 */}
      {gameState.gameStarted && (
        <div style={{ marginBottom: '20px', fontSize: '18px' }}>
          <span style={{ marginRight: '20px' }}>スコア: {gameState.score}</span>
          <span style={{ marginRight: '20px' }}>ライフ: {'❤️'.repeat(gameState.lives)}</span>
          <span style={{ marginRight: '20px' }}>レベル: {gameState.level}</span>
          {gameState.powerMode && (
            <span style={{ 
              color: '#00FF00', 
              fontWeight: 'bold',
              fontSize: '20px',
              textShadow: '0 0 5px #00FF00'
            }}>
              ⚡ パワーモード! 残り: {Math.ceil(gameState.powerModeTime / 10)}秒 ⚡
            </span>
          )}
        </div>
      )}

      {/* ゲーム画面 */}
      <div style={{
        position: 'relative',
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        margin: '0 auto',
        border: '2px solid #0000FF',
        backgroundColor: '#000000'
      }} ref={gameRef}>
        {renderMaze()}
        {gameState.gameStarted && renderPackman()}
        {gameState.gameStarted && renderGhosts()}
      </div>

      {/* ゲーム状態メッセージ */}
      {gameState.gameOver && (
        <div style={{ marginTop: '20px', fontSize: '24px', color: '#FF0000' }}>
          <h2>ゲームオーバー!</h2>
          <p>最終スコア: {gameState.score}</p>
          <button 
            onClick={resetGame}
            style={{
              fontSize: '18px',
              padding: '10px 20px',
              backgroundColor: '#FF0000',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            もう一度プレイ
          </button>
        </div>
      )}

      {gameState.gameWon && (
        <div style={{ marginTop: '20px', fontSize: '24px', color: '#00FF00' }}>
          <h2>🎉 クリア!</h2>
          <p>スコア: {gameState.score}</p>
          <p>全ドットを食べ切りました！</p>
          <button 
            onClick={resetGame}
            style={{
              fontSize: '18px',
              padding: '10px 20px',
              backgroundColor: '#00FF00',
              color: '#000000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            もう一度プレイ
          </button>
        </div>
      )}

      {/* 操作説明 */}
      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <p>🎮 操作方法:</p>
        <p>矢印キー: 移動 | スペース: 一時停止</p>
        <p>👻 ゴースト: 赤(追跡) ピンク(待ち伏せ) 水色(トリッキー) オレンジ(気まぐれ)</p>
      </div>
    </div>
  );
};

export default Packman;
