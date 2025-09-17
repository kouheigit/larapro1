import React, { useState, useCallback } from 'react';

// 駒の種類を定義
const PIECES = {
  // 先手（下側）
  GYOKU: '王将', // 王将
  HISHA: '飛車', // 飛車
  KAKU: '角行',  // 角行
  KIN: '金将',   // 金将
  GIN: '銀将',   // 銀将
  KEIMA: '桂馬', // 桂馬
  KYOSHA: '香車', // 香車
  FU: '歩兵',    // 歩兵
  
  // 成り駒
  RYU: '龍王',   // 龍王（飛車の成り）
  UMA: '龍馬',   // 龍馬（角行の成り）
  NARIGIN: '成銀', // 成銀
  NARIKEI: '成桂', // 成桂
  NARIKYO: '成香', // 成香
  TOKIN: 'と金',  // と金（歩の成り）
};

// 初期盤面の設定
const createInitialBoard = () => {
  const board = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // 後手の駒配置（上側）
  board[0] = [
    { piece: PIECES.KYOSHA, owner: 'gote' },
    { piece: PIECES.KEIMA, owner: 'gote' },
    { piece: PIECES.GIN, owner: 'gote' },
    { piece: PIECES.KIN, owner: 'gote' },
    { piece: PIECES.GYOKU, owner: 'gote' },
    { piece: PIECES.KIN, owner: 'gote' },
    { piece: PIECES.GIN, owner: 'gote' },
    { piece: PIECES.KEIMA, owner: 'gote' },
    { piece: PIECES.KYOSHA, owner: 'gote' }
  ];
  board[1][1] = { piece: PIECES.KAKU, owner: 'gote' };
  board[1][7] = { piece: PIECES.HISHA, owner: 'gote' };
  for (let i = 0; i < 9; i++) {
    board[2][i] = { piece: PIECES.FU, owner: 'gote' };
  }
  
  // 先手の駒配置（下側）
  for (let i = 0; i < 9; i++) {
    board[6][i] = { piece: PIECES.FU, owner: 'sente' };
  }
  board[7][1] = { piece: PIECES.HISHA, owner: 'sente' };
  board[7][7] = { piece: PIECES.KAKU, owner: 'sente' };
  board[8] = [
    { piece: PIECES.KYOSHA, owner: 'sente' },
    { piece: PIECES.KEIMA, owner: 'sente' },
    { piece: PIECES.GIN, owner: 'sente' },
    { piece: PIECES.KIN, owner: 'sente' },
    { piece: PIECES.GYOKU, owner: 'sente' },
    { piece: PIECES.KIN, owner: 'sente' },
    { piece: PIECES.GIN, owner: 'sente' },
    { piece: PIECES.KEIMA, owner: 'sente' },
    { piece: PIECES.KYOSHA, owner: 'sente' }
  ];
  
  return board;
};

// 難易度設定
const DIFFICULTY_LEVELS = {
  EASY: { name: '弱い', depth: 1, randomness: 0.9, evaluationWeight: 0.3, thinkingTime: 500 },
  MEDIUM: { name: '中級', depth: 2, randomness: 0.6, evaluationWeight: 0.7, thinkingTime: 800 },
  HARD: { name: '強い', depth: 2, randomness: 0.3, evaluationWeight: 1.0, thinkingTime: 1200 },
  MASTER: { name: '棋聖', depth: 3, randomness: 0.05, evaluationWeight: 2.0, thinkingTime: 1500 }
};

// 駒の基本価値
const getPieceValue = (piece) => {
  const pieceValues = {
    [PIECES.FU]: 100, [PIECES.KYOSHA]: 300, [PIECES.KEIMA]: 350, [PIECES.GIN]: 500,
    [PIECES.KIN]: 600, [PIECES.KAKU]: 850, [PIECES.HISHA]: 1000, [PIECES.GYOKU]: 10000,
    [PIECES.TOKIN]: 700, [PIECES.NARIKYO]: 700, [PIECES.NARIKEI]: 700, [PIECES.NARIGIN]: 700,
    [PIECES.UMA]: 1200, [PIECES.RYU]: 1500
  };
  return pieceValues[piece] || 0;
};

// 位置による価値
const getPositionValue = (row, col, owner, piece) => {
  let value = 0;
  
  // 中央制圧の価値
  const centerDistance = Math.abs(row - 4) + Math.abs(col - 4);
  value += (8 - centerDistance) * 5;
  
  // 前進の価値
  if (owner === 'gote') {
    value += (8 - row) * 10; // 下に進むほど良い
  } else {
    value += row * 10; // 上に進むほど良い
  }
  
  // 特定の駒の特別な位置価値
  if (piece === PIECES.FU) {
    // 歩は敵陣に近いほど価値が高い
    if (owner === 'gote' && row >= 6) value += 50;
    if (owner === 'sente' && row <= 2) value += 50;
  }
  
  return value;
};

// 王の位置を探す
const findKing = (board, player) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.owner === player && piece.piece === PIECES.GYOKU) {
        return { row, col };
      }
    }
  }
  return null;
};

// 王手をチェック
const isInCheck = (board, player, currentCapturedPieces = capturedPieces) => {
  const kingPos = findKing(board, player);
  if (!kingPos) return false;
  
  const opponent = player === 'sente' ? 'gote' : 'sente';
  
  // 相手のすべての駒が王を攻撃できるかチェック
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.owner === opponent) {
        if (isValidMove(row, col, kingPos.row, kingPos.col, piece, board)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// 詰みをチェック
const isCheckmate = (board, player, currentCapturedPieces = capturedPieces) => {
  if (!isInCheck(board, player, currentCapturedPieces)) {
    return false; // 王手でなければ詰みではない
  }
  
  // 指定された持ち駒状態での可能な手を取得
  const possibleMoves = getAllPossibleMovesWithCaptured(board, player, currentCapturedPieces);
  
  // すべての可能な手を試して、王手を逃れられるかチェック
  for (const move of possibleMoves) {
    const simResult = simulateMove(board, move, currentCapturedPieces);
    if (!isInCheck(simResult.board, player, simResult.capturedPieces)) {
      return false; // 王手を逃れられる手がある
    }
  }
  
  return true; // すべての手で王手が続く = 詰み
};

// 攻撃的な手を評価
const evaluateAggressiveMoves = (move, board, player, weight) => {
  let score = 0;
  const opponent = player === 'sente' ? 'gote' : 'sente';
  
  // 手を実行後、相手が王手になるかチェック
  const simResult = simulateMove(board, move, capturedPieces);
  if (isInCheck(simResult.board, opponent, simResult.capturedPieces)) {
    score += 200 * weight; // 王手は非常に価値が高い
    
    // 詰みならさらに高いスコア
    if (isCheckmate(simResult.board, opponent, simResult.capturedPieces)) {
      score += 10000 * weight;
    }
  }
  
  return score;
};

// 守備的な手を評価
const evaluateDefensiveMoves = (move, board, player, weight) => {
  let score = 0;
  
  // 現在王手になっている場合、王手を逃れられる手は高評価
  if (isInCheck(board, player)) {
    const simResult = simulateMove(board, move, capturedPieces);
    if (!isInCheck(simResult.board, player, simResult.capturedPieces)) {
      score += 300 * weight; // 王手を逃れる手は非常に重要
    }
  }
  
  return score;
};

// 王の安全性評価
const evaluateKingSafety = (board, kingPos, owner) => {
  let safety = 0;
  const { row, col } = kingPos;
  
  // 王の周囲の守り駒をチェック
  const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
      const piece = board[newRow][newCol];
      if (piece && piece.owner === owner) {
        safety += 20; // 味方の駒が近くにいると安全
      }
    }
  }
  
  // 端に近いほど安全（将棋の一般的な戦略）
  if (col <= 2 || col >= 6) safety += 10;
  if (owner === 'gote' && row <= 2) safety += 15;
  if (owner === 'sente' && row >= 6) safety += 15;
  
  return safety;
};

function Shogi1() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('EASY'); // デフォルトは弱い
  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState('sente'); // sente: 先手, gote: 後手
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ sente: [], gote: [] });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [promotionDialog, setPromotionDialog] = useState(null);
  const [selectedCapturedPiece, setSelectedCapturedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  // 音効果を再生する関数
  const playPachi = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // ノイズを作る
    const bufferSize = ctx.sampleRate * 0.05; // 50ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // ホワイトノイズ生成
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // 徐々に減衰
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    noise.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  };

  // 駒が成れるかどうかを判定
  const canPromote = (piece, fromRow, toRow, owner) => {
    // 成れない駒
    if ([PIECES.GYOKU, PIECES.KIN, PIECES.RYU, PIECES.UMA, PIECES.NARIGIN, PIECES.NARIKEI, PIECES.NARIKYO, PIECES.TOKIN].includes(piece)) {
      return false;
    }
    
    // 相手陣地（敵陣）に入ったかどうか
    if (owner === 'sente') {
      // 先手の場合、上3段（0-2行）が敵陣
      return fromRow >= 3 && toRow <= 2 || fromRow <= 2;
    } else {
      // 後手の場合、下3段（6-8行）が敵陣
      return fromRow <= 5 && toRow >= 6 || fromRow >= 6;
    }
  };

  // 駒を成る
  const getPromotedPiece = (piece) => {
    const promotionMap = {
      [PIECES.HISHA]: PIECES.RYU,   // 飛車 → 龍王
      [PIECES.KAKU]: PIECES.UMA,    // 角行 → 龍馬
      [PIECES.GIN]: PIECES.NARIGIN, // 銀将 → 成銀
      [PIECES.KEIMA]: PIECES.NARIKEI, // 桂馬 → 成桂
      [PIECES.KYOSHA]: PIECES.NARIKYO, // 香車 → 成香
      [PIECES.FU]: PIECES.TOKIN     // 歩兵 → と金
    };
    return promotionMap[piece] || piece;
  };

  // ゲーム開始
  const startGame = () => {
    setGameStarted(true);
    setBoard(createInitialBoard());
    setCurrentPlayer('sente');
    setSelectedSquare(null);
    setCapturedPieces({ sente: [], gote: [] });
    setGameOver(false);
    setWinner(null);
    setIsAiThinking(false);
    setPromotionDialog(null);
    setSelectedCapturedPiece(null);
    setPossibleMoves([]);
  };

  // AI の手を実行
  const makeAiMove = useCallback((currentBoard) => {
    if (gameOver) return;
    
    setIsAiThinking(true);
    
    // AIの可能な手をすべて取得（盤上の駒の移動 + 持ち駒の打ち手）
    const possibleMoves = getAllPossibleMoves(currentBoard, 'gote');
    
    if (possibleMoves.length === 0) {
      setGameOver(true);
      setWinner('sente');
      setIsAiThinking(false);
      return;
    }
    
    // 難易度に応じたAIの手選択
    const selectedMove = selectBestMove(possibleMoves, currentBoard, difficulty);
    
    const newBoard = [...currentBoard];
    let newCapturedPieces = { ...capturedPieces };
    
    if (selectedMove.type === 'move') {
      // 盤上の駒を移動
      const { fromRow, fromCol, toRow, toCol } = selectedMove;
      const piece = newBoard[fromRow][fromCol];
      const targetPiece = newBoard[toRow][toCol];
      
      // 相手の駒を取る場合
      if (targetPiece && targetPiece.owner !== 'gote') {
        // 成り駒は元の駒に戻す
        let capturedPieceType = targetPiece.piece;
        const revertMap = {
          [PIECES.RYU]: PIECES.HISHA,     // 龍王 → 飛車
          [PIECES.UMA]: PIECES.KAKU,      // 龍馬 → 角行
          [PIECES.NARIGIN]: PIECES.GIN,   // 成銀 → 銀将
          [PIECES.NARIKEI]: PIECES.KEIMA, // 成桂 → 桂馬
          [PIECES.NARIKYO]: PIECES.KYOSHA,// 成香 → 香車
          [PIECES.TOKIN]: PIECES.FU       // と金 → 歩兵
        };
        if (revertMap[capturedPieceType]) {
          capturedPieceType = revertMap[capturedPieceType];
        }
        
        const capturedPiece = { 
          piece: capturedPieceType, 
          owner: 'gote' 
        };
        newCapturedPieces.gote = [...newCapturedPieces.gote, capturedPiece];
      }
      
      // 駒を移動
      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = null;
      
      // AIの成り判定（自動的に成る）
      if (canPromote(piece.piece, fromRow, toRow, 'gote')) {
        newBoard[toRow][toCol] = {
          ...piece,
          piece: getPromotedPiece(piece.piece)
        };
      }
    } else if (selectedMove.type === 'drop') {
      // 持ち駒を打つ
      const { pieceIndex, piece, toRow, toCol } = selectedMove;
      
      // 持ち駒を盤上に配置
      newBoard[toRow][toCol] = {
        piece: piece,
        owner: 'gote'
      };
      
      // 持ち駒から削除
      newCapturedPieces.gote = newCapturedPieces.gote.filter((_, index) => index !== pieceIndex);
    }
    
    setBoard(newBoard);
    setCapturedPieces(newCapturedPieces);
    playPachi();
    setIsAiThinking(false);
    
    // 勝利判定
    if (checkWinCondition(newBoard, 'gote')) {
      setGameOver(true);
      setWinner('gote');
    } else {
      setCurrentPlayer('sente');
    }
  }, [gameOver, difficulty, canPromote, getPromotedPiece, capturedPieces]);

  // 難易度に応じた最適手の選択
  const selectBestMove = (moves, board, difficultyLevel) => {
    const difficultyConfig = DIFFICULTY_LEVELS[difficultyLevel];
    
    // ランダム性の高い難易度（弱い）の場合は、ほぼランダムに選択
    if (Math.random() < difficultyConfig.randomness) {
      return moves[Math.floor(Math.random() * moves.length)];
    }
    
    // ミニマックス法で最適手を探索
    if (difficultyConfig.depth >= 2) {
      return minimaxSearch(board, difficultyConfig.depth, 'gote', moves, difficultyConfig, capturedPieces);
    }
    
    // 浅い探索の場合は単純な評価
    const evaluatedMoves = moves.map(move => ({
      ...move,
      score: evaluateMove(move, board, difficultyConfig)
    }));
    
    // スコア順にソート（降順）
    evaluatedMoves.sort((a, b) => b.score - a.score);
    
    // 上位の手から選択（難易度が高いほど最善手を選ぶ確率が高い）
    const topMovesCount = Math.max(1, Math.floor(evaluatedMoves.length * (1 - difficultyConfig.randomness + 0.2)));
    const topMoves = evaluatedMoves.slice(0, topMovesCount);
    return topMoves[Math.floor(Math.random() * topMoves.length)];
  };
  
  // ミニマックス法による探索（軽量版）
  const minimaxSearch = (board, depth, player, availableMoves, config, currentCapturedPieces = capturedPieces) => {
    let bestMove = null;
    let bestScore = player === 'gote' ? -Infinity : Infinity;
    
    // 手数を大幅に制限
    const maxMovesToSearch = Math.min(availableMoves.length, 10);
    const movesToSearch = availableMoves.slice(0, maxMovesToSearch);
    
    for (const move of movesToSearch) {
      const simResult = simulateMove(board, move, currentCapturedPieces);
      const score = minimax(simResult.board, depth - 1, player === 'gote' ? 'sente' : 'gote', -Infinity, Infinity, config, simResult.capturedPieces);
      
      if (player === 'gote' && score > bestScore) {
        bestScore = score;
        bestMove = move;
      } else if (player === 'sente' && score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return bestMove || availableMoves[0];
  };
  
  // ミニマックス法（簡略化版 - 無限ループ防止）
  const minimax = (board, depth, player, alpha, beta, config, currentCapturedPieces = capturedPieces) => {
    if (depth === 0) {
      return evaluateBoard(board, config, currentCapturedPieces);
    }
    
    const moves = getAllPossibleMovesWithCaptured(board, player, currentCapturedPieces);
    
    if (moves.length === 0) {
      return player === 'gote' ? -10000 : 10000;
    }
    
    // 手数を大幅に制限して計算量を削減
    const maxMoves = Math.min(moves.length, depth >= 3 ? 8 : 15);
    const movesToExplore = moves.slice(0, maxMoves);
    
    if (player === 'gote') {
      let maxScore = -Infinity;
      for (const move of movesToExplore) {
        const simResult = simulateMove(board, move, currentCapturedPieces);
        const score = minimax(simResult.board, depth - 1, 'sente', alpha, beta, config, simResult.capturedPieces);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // アルファベータ枝刈り
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of movesToExplore) {
        const simResult = simulateMove(board, move, currentCapturedPieces);
        const score = minimax(simResult.board, depth - 1, 'gote', alpha, beta, config, simResult.capturedPieces);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // アルファベータ枝刈り
      }
      return minScore;
    }
  };
  
  // 手をシミュレート（盤面のコピーを作成して移動を適用）
  const simulateMove = (board, move, currentCapturedPieces = capturedPieces) => {
    const newBoard = board.map(row => [...row]);
    let newCapturedPieces = {
      sente: [...currentCapturedPieces.sente],
      gote: [...currentCapturedPieces.gote]
    };
    
    if (move.type === 'move') {
      const { fromRow, fromCol, toRow, toCol } = move;
      const piece = newBoard[fromRow][fromCol];
      const targetPiece = newBoard[toRow][toCol];
      
      // 相手の駒を取る場合
      if (targetPiece && targetPiece.owner !== piece.owner) {
        let capturedPieceType = targetPiece.piece;
        const revertMap = {
          [PIECES.RYU]: PIECES.HISHA,
          [PIECES.UMA]: PIECES.KAKU,
          [PIECES.NARIGIN]: PIECES.GIN,
          [PIECES.NARIKEI]: PIECES.KEIMA,
          [PIECES.NARIKYO]: PIECES.KYOSHA,
          [PIECES.TOKIN]: PIECES.FU
        };
        if (revertMap[capturedPieceType]) {
          capturedPieceType = revertMap[capturedPieceType];
        }
        
        const capturedPiece = { 
          piece: capturedPieceType, 
          owner: piece.owner 
        };
        newCapturedPieces[piece.owner].push(capturedPiece);
      }
      
      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = null;
      
      // 成り判定（自動的に成る）
      if (piece && canPromote(piece.piece, fromRow, toRow, piece.owner)) {
        newBoard[toRow][toCol] = {
          ...piece,
          piece: getPromotedPiece(piece.piece)
        };
      }
    } else if (move.type === 'drop') {
      const { pieceIndex, piece, toRow, toCol } = move;
      const owner = move.owner || 'gote'; // デフォルトはAI
      
      // 持ち駒を盤上に配置
      newBoard[toRow][toCol] = {
        piece: piece,
        owner: owner
      };
      
      // 持ち駒から削除
      newCapturedPieces[owner] = newCapturedPieces[owner].filter((_, index) => index !== pieceIndex);
    }
    
    return { board: newBoard, capturedPieces: newCapturedPieces };
  };
  
  // 盤面全体の評価（軽量版）
  const evaluateBoard = (board, config, currentCapturedPieces = capturedPieces) => {
    let score = 0;
    const weight = config.evaluationWeight;
    
    // 各駒の価値を計算
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = board[row][col];
        if (piece) {
          const pieceValue = getPieceValue(piece.piece);
          const positionValue = getPositionValue(row, col, piece.owner, piece.piece);
          const totalValue = (pieceValue + positionValue * 0.1) * weight;
          
          if (piece.owner === 'gote') {
            score += totalValue;
          } else {
            score -= totalValue;
          }
        }
      }
    }
    
    // 持ち駒の価値を評価
    if (currentCapturedPieces.gote) {
      for (const capturedPiece of currentCapturedPieces.gote) {
        score += getPieceValue(capturedPiece.piece) * 0.8 * weight;
      }
    }
    if (currentCapturedPieces.sente) {
      for (const capturedPiece of currentCapturedPieces.sente) {
        score -= getPieceValue(capturedPiece.piece) * 0.8 * weight;
      }
    }
    
    return score;
  };
  
  
  // 中央制圧の評価
  const evaluateCentralControl = (board, weight) => {
    let score = 0;
    const centralSquares = [[3,3], [3,4], [3,5], [4,3], [4,4], [4,5], [5,3], [5,4], [5,5]];
    
    for (const [row, col] of centralSquares) {
      const piece = board[row][col];
      if (piece) {
        const bonus = 15 * weight;
        if (piece.owner === 'gote') {
          score += bonus;
        } else {
          score -= bonus;
        }
      }
    }
    
    return score;
  };
  
  // 攻撃性の評価（敵陣への進出）
  const evaluateAggression = (board, weight) => {
    let score = 0;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = board[row][col];
        if (piece) {
          if (piece.owner === 'gote' && row >= 6) {
            // 後手が敵陣（下3段）に進出している
            score += 25 * weight;
          } else if (piece.owner === 'sente' && row <= 2) {
            // 先手が敵陣（上3段）に進出している
            score -= 25 * weight;
          }
        }
      }
    }
    
    return score;
  };
  
  // 単純な手の評価関数（軽量版）
  const evaluateMove = (move, board, config) => {
    let score = 0;
    const weight = config.evaluationWeight;
    
    if (move.type === 'move') {
      const { fromRow, fromCol, toRow, toCol } = move;
      const piece = board[fromRow][fromCol];
      const targetPiece = board[toRow][toCol];
      
      // 相手の駒を取る場合のスコア
      if (targetPiece && targetPiece.owner !== 'gote') {
        score += getPieceValue(targetPiece.piece) * weight;
      }
      
      // 前進のスコア（後手なので下に進むほど良い）
      if (toRow > fromRow) {
        score += (toRow - fromRow) * 20 * weight;
      }
      
      // 成りの価値
      if (canPromote(piece.piece, fromRow, toRow, 'gote')) {
        const promotedValue = getPieceValue(getPromotedPiece(piece.piece));
        const originalValue = getPieceValue(piece.piece);
        score += (promotedValue - originalValue) * weight;
      }
    } else if (move.type === 'drop') {
      const { piece, toRow } = move;
      
      // 持ち駒を打つ価値
      score += getPieceValue(piece) * 0.6 * weight;
      
      // 敵陣への打ち込みボーナス
      if (toRow >= 6) {
        score += 30 * weight;
      }
    }
    
    return score;
  };
  
  // 王将の位置を探す
  const findKing = (board, player) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = board[row][col];
        if (piece && piece.owner === player && piece.piece === PIECES.GYOKU) {
          return { row, col };
        }
      }
    }
    return null;
  };

  // すべての可能な手を取得（盤上の駒の移動 + 持ち駒の打ち手）
  const getAllPossibleMoves = (board, player) => {
    return getAllPossibleMovesWithCaptured(board, player, capturedPieces);
  };

  // 指定された持ち駒状態でのすべての可能な手を取得
  const getAllPossibleMovesWithCaptured = (board, player, currentCapturedPieces) => {
    const moves = [];
    
    // 盤上の駒の移動
    for (let fromRow = 0; fromRow < 9; fromRow++) {
      for (let fromCol = 0; fromCol < 9; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && piece.owner === player) {
          for (let toRow = 0; toRow < 9; toRow++) {
            for (let toCol = 0; toCol < 9; toCol++) {
              if (isValidMove(fromRow, fromCol, toRow, toCol, piece, board)) {
                moves.push({ type: 'move', fromRow, fromCol, toRow, toCol });
              }
            }
          }
        }
      }
    }
    
    // 持ち駒の打ち手
    const playerCapturedPieces = currentCapturedPieces[player] || [];
    for (let pieceIndex = 0; pieceIndex < playerCapturedPieces.length; pieceIndex++) {
      const capturedPiece = playerCapturedPieces[pieceIndex];
      for (let toRow = 0; toRow < 9; toRow++) {
        for (let toCol = 0; toCol < 9; toCol++) {
          if (canDropPiece(capturedPiece.piece, toRow, toCol, board, player)) {
            moves.push({ type: 'drop', pieceIndex, piece: capturedPiece.piece, toRow, toCol });
          }
        }
      }
    }
    
    return moves;
  };

  // 特定の駒の移動可能な位置を計算
  const calculatePossibleMoves = (fromRow, fromCol, piece, board) => {
    const moves = [];
    
    for (let toRow = 0; toRow < 9; toRow++) {
      for (let toCol = 0; toCol < 9; toCol++) {
        if (isValidMove(fromRow, fromCol, toRow, toCol, piece, board)) {
          moves.push([toRow, toCol]);
        }
      }
    }
    
    return moves;
  };

  // 持ち駒をクリックした時の処理
  const handleCapturedPieceClick = (pieceIndex, event) => {
    if (!gameStarted || gameOver || currentPlayer === 'gote' || isAiThinking) return;
    
    event.stopPropagation(); // イベントの伝播を停止
    console.log('持ち駒がクリックされました:', pieceIndex, capturedPieces[currentPlayer][pieceIndex]);
    setSelectedSquare(null);
    setSelectedCapturedPiece(pieceIndex);
    console.log('selectedCapturedPiece を設定:', pieceIndex);
  };

  // 持ち駒を打つことができるかチェック
  const canDropPiece = (piece, row, col, board, player = currentPlayer) => {
    // 空いているマスかチェック
    if (board[row][col] !== null) return false;
    
    // 歩の制限：同じ列に歩がないかチェック
    if (piece === PIECES.FU) {
      for (let r = 0; r < 9; r++) {
        const boardPiece = board[r][col];
        if (boardPiece && boardPiece.owner === player && boardPiece.piece === PIECES.FU) {
          return false; // 二歩の禁止
        }
      }
      
      // 最前列に歩を打つことはできない
      if ((player === 'sente' && row === 0) || (player === 'gote' && row === 8)) {
        return false;
      }
    }
    
    // 桂馬の制限：最前列から2段目には打てない
    if (piece === PIECES.KEIMA) {
      if ((player === 'sente' && row <= 1) || (player === 'gote' && row >= 7)) {
        return false;
      }
    }
    
    // 香車の制限：最前列には打てない
    if (piece === PIECES.KYOSHA) {
      if ((player === 'sente' && row === 0) || (player === 'gote' && row === 8)) {
        return false;
      }
    }
    
    return true;
  };

  // マスをクリックした時の処理
  const handleSquareClick = useCallback((row, col) => {
    console.log('盤面がクリックされました:', row, col, 'selectedCapturedPiece:', selectedCapturedPiece);
    if (!gameStarted || gameOver || currentPlayer === 'gote' || isAiThinking) return;

    // 持ち駒を打つ場合
    if (selectedCapturedPiece !== null) {
      const capturedPiece = capturedPieces[currentPlayer][selectedCapturedPiece];
      console.log('持ち駒を打とうとしています:', capturedPiece, 'at', row, col);
      
      if (canDropPiece(capturedPiece.piece, row, col, board)) {
        console.log('持ち駒を打てます');
        const newBoard = [...board];
        
        // 持ち駒を盤上に配置
        newBoard[row][col] = {
          piece: capturedPiece.piece,
          owner: currentPlayer
        };
        
        // 持ち駒から削除
        const newCapturedPieces = { ...capturedPieces };
        newCapturedPieces[currentPlayer].splice(selectedCapturedPiece, 1);
        setCapturedPieces(newCapturedPieces);
        
        setBoard(newBoard);
        playPachi();
        setSelectedCapturedPiece(null);
        setPossibleMoves([]);
        
        // 勝利判定
        if (checkWinCondition(newBoard, currentPlayer)) {
          setGameOver(true);
          setWinner(currentPlayer);
        } else {
          // ターン交代
          const nextPlayer = currentPlayer === 'sente' ? 'gote' : 'sente';
          setCurrentPlayer(nextPlayer);
          
          // AIのターンの場合
          if (nextPlayer === 'gote') {
            // 難易度に応じて思考時間を調整
            const thinkingTime = DIFFICULTY_LEVELS[difficulty].depth * 800 + 500;
            setTimeout(() => {
              makeAiMove(newBoard);
            }, thinkingTime);
          }
        }
      } else {
        console.log('持ち駒を打てません');
        setSelectedCapturedPiece(null);
      }
      return;
    }

    if (selectedSquare) {
      // 駒が選択されている場合、移動を試みる
      const [fromRow, fromCol] = selectedSquare;
      const piece = board[fromRow][fromCol];
      
      if (piece && piece.owner === currentPlayer) {
        // 移動可能かチェック（簡易版）
        if (isValidMove(fromRow, fromCol, row, col, piece, board)) {
          const newBoard = [...board];
          const targetPiece = newBoard[row][col];
          
          // 相手の駒を取る場合
          if (targetPiece && targetPiece.owner !== currentPlayer) {
            // 成り駒は元の駒に戻す
            let capturedPieceType = targetPiece.piece;
            const revertMap = {
              [PIECES.RYU]: PIECES.HISHA,     // 龍王 → 飛車
              [PIECES.UMA]: PIECES.KAKU,      // 龍馬 → 角行
              [PIECES.NARIGIN]: PIECES.GIN,   // 成銀 → 銀将
              [PIECES.NARIKEI]: PIECES.KEIMA, // 成桂 → 桂馬
              [PIECES.NARIKYO]: PIECES.KYOSHA,// 成香 → 香車
              [PIECES.TOKIN]: PIECES.FU       // と金 → 歩兵
            };
            if (revertMap[capturedPieceType]) {
              capturedPieceType = revertMap[capturedPieceType];
            }
            
            const capturedPiece = { 
              piece: capturedPieceType, 
              owner: currentPlayer 
            };
            setCapturedPieces(prev => ({
              ...prev,
              [currentPlayer]: [...prev[currentPlayer], capturedPiece]
            }));
          }
          
          // 駒を移動
          newBoard[row][col] = piece;
          newBoard[fromRow][fromCol] = null;
          
          // 成り判定
          if (canPromote(piece.piece, fromRow, row, currentPlayer)) {
            setPromotionDialog({
              board: newBoard,
              row: row,
              col: col,
              piece: piece,
              fromRow: fromRow,
              fromCol: fromCol
            });
            return; // 成り選択ダイアログを表示するため、ここで処理を停止
          }
          
          setBoard(newBoard);
          playPachi();
          
          // ハイライトをリセット
          setPossibleMoves([]);
          
          // 勝利判定
          if (checkWinCondition(newBoard, currentPlayer)) {
            setGameOver(true);
            setWinner(currentPlayer);
          } else {
            // ターン交代
            const nextPlayer = currentPlayer === 'sente' ? 'gote' : 'sente';
            setCurrentPlayer(nextPlayer);
            
            // AIのターンの場合
            if (nextPlayer === 'gote') {
              // 難易度に応じて思考時間を調整
              const thinkingTime = DIFFICULTY_LEVELS[difficulty].depth * 800 + 500;
              setTimeout(() => {
                makeAiMove(newBoard);
              }, thinkingTime);
            }
          }
        }
      }
      setSelectedSquare(null);
      setSelectedCapturedPiece(null);
      setPossibleMoves([]);
    } else {
      // 駒を選択
      const piece = board[row][col];
      if (piece && piece.owner === currentPlayer) {
        setSelectedSquare([row, col]);
        setSelectedCapturedPiece(null);
        
        // 移動可能な位置を計算
        const moves = calculatePossibleMoves(row, col, piece, board);
        setPossibleMoves(moves);
      } else {
        // 何もない場所をクリックした場合は選択解除
        setSelectedSquare(null);
        setSelectedCapturedPiece(null);
        setPossibleMoves([]);
      }
    }
  }, [gameStarted, gameOver, selectedSquare, selectedCapturedPiece, board, currentPlayer, capturedPieces, isAiThinking]);

  // 成り選択の処理
  const handlePromotionChoice = (promote) => {
    if (!promotionDialog) return;
    
    const { board: newBoard, row, col, piece } = promotionDialog;
    
    if (promote) {
      // 成る場合
      newBoard[row][col] = {
        ...piece,
        piece: getPromotedPiece(piece.piece)
      };
    }
    
    setBoard(newBoard);
    playPachi();
    setPromotionDialog(null);
    setPossibleMoves([]);
    
    // 勝利判定
    if (checkWinCondition(newBoard, currentPlayer)) {
      setGameOver(true);
      setWinner(currentPlayer);
    } else {
      // ターン交代
      const nextPlayer = currentPlayer === 'sente' ? 'gote' : 'sente';
      setCurrentPlayer(nextPlayer);
      
      // AIのターンの場合
      if (nextPlayer === 'gote') {
        // 難易度に応じて思考時間を調整
        const thinkingTime = DIFFICULTY_LEVELS[difficulty].depth * 800 + 500;
        setTimeout(() => {
          makeAiMove(newBoard);
        }, thinkingTime);
      }
    }
  };

  // 駒の移動パターンを定義
  const getMovePatterns = (piece, owner) => {
    const direction = owner === 'sente' ? -1 : 1; // 先手は上(-1)、後手は下(1)
    
    switch (piece) {
      case PIECES.GYOKU: // 王将 - 8方向1マス
        return {
          type: 'single',
          moves: [[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]]
        };
      
      case PIECES.KIN: // 金将 - 6方向1マス
        return {
          type: 'single',
          moves: [[-1,1],[0,1],[1,1],[-1,0],[1,0],[0,-1]].map(([r,c]) => [r*direction, c])
        };
      
      case PIECES.GIN: // 銀将 - 5方向1マス
        return {
          type: 'single',
          moves: [[-1,1],[0,1],[1,1],[-1,-1],[1,-1]].map(([r,c]) => [r*direction, c])
        };
      
      case PIECES.KEIMA: // 桂馬 - 前2マス+左右1マス
        return {
          type: 'single',
          moves: [[2*direction, -1], [2*direction, 1]]
        };
      
      case PIECES.KYOSHA: // 香車 - 前方向にスライド
        return {
          type: 'slide',
          directions: [[direction, 0]]
        };
      
      case PIECES.FU: // 歩兵 - 前1マス
        return {
          type: 'single',
          moves: [[direction, 0]]
        };
      
      case PIECES.HISHA: // 飛車 - 縦横スライド
        return {
          type: 'slide',
          directions: [[0,1],[1,0],[0,-1],[-1,0]]
        };
      
      case PIECES.KAKU: // 角行 - 斜めスライド
        return {
          type: 'slide',
          directions: [[1,1],[1,-1],[-1,1],[-1,-1]]
        };
      
      // 成り駒
      case PIECES.NARIGIN: // 成銀 = 金と同じ
      case PIECES.NARIKEI: // 成桂 = 金と同じ
      case PIECES.NARIKYO: // 成香 = 金と同じ
      case PIECES.TOKIN:   // と金 = 金と同じ
        return {
          type: 'single',
          moves: [[-1,1],[0,1],[1,1],[-1,0],[1,0],[0,-1]].map(([r,c]) => [r*direction, c])
        };
      
      case PIECES.RYU: // 龍王 - 飛車+斜め1マス
        return {
          type: 'combined',
          slide: [[0,1],[1,0],[0,-1],[-1,0]],
          single: [[-1,1],[1,1],[-1,-1],[1,-1]]
        };
      
      case PIECES.UMA: // 龍馬 - 角+縦横1マス
        return {
          type: 'combined',
          slide: [[1,1],[1,-1],[-1,1],[-1,-1]],
          single: [[0,1],[1,0],[0,-1],[-1,0]]
        };
      
      default:
        return { type: 'single', moves: [] };
    }
  };

  // 移動可能判定
  const isValidMove = (fromRow, fromCol, toRow, toCol, piece, board) => {
    // 同じ場所への移動は無効
    if (fromRow === toRow && fromCol === toCol) return false;
    
    // 盤面外への移動は無効
    if (toRow < 0 || toRow >= 9 || toCol < 0 || toCol >= 9) return false;
    
    // 自分の駒がある場所への移動は無効
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.owner === piece.owner) return false;
    
    const pattern = getMovePatterns(piece.piece, piece.owner);
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    switch (pattern.type) {
      case 'single':
        return pattern.moves.some(([r, c]) => r === rowDiff && c === colDiff);
      
      case 'slide':
        return pattern.directions.some(([dr, dc]) => {
          if (dr === 0 && dc === 0) return false;
          
          // 方向が合っているかチェック
          if (dr === 0 && rowDiff !== 0) return false;
          if (dc === 0 && colDiff !== 0) return false;
          if (dr !== 0 && dc !== 0) {
            if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
            if (Math.sign(rowDiff) !== Math.sign(dr) || Math.sign(colDiff) !== Math.sign(dc)) return false;
          } else {
            if (dr !== 0 && Math.sign(rowDiff) !== Math.sign(dr)) return false;
            if (dc !== 0 && Math.sign(colDiff) !== Math.sign(dc)) return false;
          }
          
          // 経路上に駒がないかチェック
          const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
          const stepR = rowDiff === 0 ? 0 : rowDiff / steps;
          const stepC = colDiff === 0 ? 0 : colDiff / steps;
          
          for (let i = 1; i < steps; i++) {
            const checkRow = fromRow + stepR * i;
            const checkCol = fromCol + stepC * i;
            if (board[checkRow][checkCol] !== null) return false;
          }
          
          return true;
        });
      
      case 'combined':
        // スライド移動をチェック
        const slideValid = pattern.slide.some(([dr, dc]) => {
          if (dr === 0 && dc === 0) return false;
          
          if (dr === 0 && rowDiff !== 0) return false;
          if (dc === 0 && colDiff !== 0) return false;
          if (dr !== 0 && dc !== 0) {
            if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
            if (Math.sign(rowDiff) !== Math.sign(dr) || Math.sign(colDiff) !== Math.sign(dc)) return false;
          } else {
            if (dr !== 0 && Math.sign(rowDiff) !== Math.sign(dr)) return false;
            if (dc !== 0 && Math.sign(colDiff) !== Math.sign(dc)) return false;
          }
          
          const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
          const stepR = rowDiff === 0 ? 0 : rowDiff / steps;
          const stepC = colDiff === 0 ? 0 : colDiff / steps;
          
          for (let i = 1; i < steps; i++) {
            const checkRow = fromRow + stepR * i;
            const checkCol = fromCol + stepC * i;
            if (board[checkRow][checkCol] !== null) return false;
          }
          
          return true;
        });
        
        // 1マス移動をチェック
        const singleValid = pattern.single.some(([r, c]) => r === rowDiff && c === colDiff);
        
        return slideValid || singleValid;
      
      default:
        return false;
    }
  };

  // 勝利判定（簡易版）
  const checkWinCondition = (board, player) => {
    // 相手の玉将が取られているかチェック
    const opponent = player === 'sente' ? 'gote' : 'sente';
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = board[row][col];
        if (piece && piece.owner === opponent && piece.piece === PIECES.GYOKU) {
          return false; // 相手の玉将がまだ盤上にある
        }
      }
    }
    return true; // 相手の玉将が見つからない = 勝利
  };

  // 盤面の描画
  const renderBoard = () => {
    return (
      <div className="shogi-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((square, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`board-square ${
                  selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex
                    ? 'selected'
                    : ''
                } ${
                  possibleMoves.some(([r, c]) => r === rowIndex && c === colIndex)
                    ? 'possible-move'
                    : ''
                }`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {square && (
                  <div className={`piece ${square.owner}`}>
                    <div className={`piece-shape ${
                      [PIECES.RYU, PIECES.UMA, PIECES.NARIGIN, PIECES.NARIKEI, PIECES.NARIKYO, PIECES.TOKIN].includes(square.piece) 
                        ? 'promoted' 
                        : ''
                    }`}>
                      <div className="piece-text">
                        {square.piece}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="shogi-game">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/earlyaccess/kinryu.css" rel="stylesheet" />
      <h1>将棋ゲーム</h1>
      
      {!gameStarted ? (
        <div className="game-start">
          <div className="difficulty-selection">
            <h2>難易度を選択してください</h2>
            <div className="difficulty-buttons">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
                <button
                  key={key}
                  className={`difficulty-button ${difficulty === key ? 'selected' : ''}`}
                  onClick={() => setDifficulty(key)}
                >
                  {config.name}
                  {key === 'MASTER' && <div className="master-label">(最強レベル - 持ち駒完全活用)</div>}
                </button>
              ))}
            </div>
            <div className="selected-difficulty">
              選択中: <strong>{DIFFICULTY_LEVELS[difficulty].name}</strong>
            </div>
          </div>
          <button onClick={startGame} className="start-button">
            スタート
          </button>
        </div>
      ) : (
        <div className="game-area">
          {gameOver ? (
            <div className="game-over">
              <h2>{winner === 'sente' ? '先手（あなた）' : '後手（AI）'}の勝利！</h2>
              <button onClick={startGame} className="restart-button">
                もう一度プレイ
              </button>
            </div>
          ) : (
            <div className="game-status">
              <p>現在のターン: {currentPlayer === 'sente' ? '先手（あなた）' : '後手（AI）'}</p>
              {isAiThinking && <p className="ai-thinking">AI が考え中...</p>}
            </div>
          )}
          
          {renderBoard()}
          
          {promotionDialog && (
            <div className="promotion-dialog-overlay">
              <div className="promotion-dialog">
                <h3>駒を成りますか？</h3>
                <div className="promotion-options">
                  <div className="promotion-option">
                    <div className="piece-preview">
                      <div className="piece sente">
                        <div className="piece-shape">
                          <div className="piece-text">
                            {promotionDialog.piece.piece}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handlePromotionChoice(false)}
                      className="promotion-button"
                    >
                      成らない
                    </button>
                  </div>
                  <div className="promotion-option">
                    <div className="piece-preview">
                      <div className="piece sente">
                        <div className="piece-shape promoted">
                          <div className="piece-text">
                            {getPromotedPiece(promotionDialog.piece.piece)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handlePromotionChoice(true)}
                      className="promotion-button promote"
                    >
                      成る
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="captured-pieces">
            <div className="sente-captured">
              <h3>先手の持ち駒 ({capturedPieces.sente.length}個)</h3>
              <div className="captured-pieces-grid">
                {capturedPieces.sente.map((piece, index) => (
                  <div 
                    key={index} 
                    className={`captured-piece ${
                      selectedCapturedPiece === index && currentPlayer === 'sente' ? 'selected' : ''
                    } ${currentPlayer === 'sente' ? 'clickable' : ''}`}
                    onClick={(e) => currentPlayer === 'sente' && handleCapturedPieceClick(index, e)}
                  >
                    <div className="piece sente">
                      <div className="piece-shape">
                        <div className="piece-text">
                          {piece.piece}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="gote-captured">
              <h3>後手の持ち駒 ({capturedPieces.gote.length}個)</h3>
              <div className="captured-pieces-grid">
                {capturedPieces.gote.map((piece, index) => (
                  <div 
                    key={index} 
                    className="captured-piece"
                  >
                    <div className="piece gote">
                      <div className="piece-shape">
                        <div className="piece-text">
                          {piece.piece}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .shogi-game {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .game-start {
          text-align: center;
          padding: 20px;
        }
        
        .difficulty-selection {
          margin-bottom: 30px;
        }
        
        .difficulty-selection h2 {
          color: #333;
          margin-bottom: 20px;
        }
        
        .difficulty-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        
        .difficulty-button {
          background-color: #f8f9fa;
          color: #333;
          border: 2px solid #dee2e6;
          padding: 15px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s ease;
          position: relative;
          min-width: 120px;
        }
        
        .difficulty-button:hover {
          background-color: #e9ecef;
          border-color: #adb5bd;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .difficulty-button.selected {
          background-color: #4CAF50;
          color: white;
          border-color: #45a049;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        
        .master-label {
          font-size: 12px;
          color: #ff4444;
          font-weight: normal;
          margin-top: 4px;
        }
        
        .difficulty-button.selected .master-label {
          color: #ffcccc;
        }
        
        .selected-difficulty {
          font-size: 18px;
          color: #333;
          margin-top: 15px;
        }
        
        .start-button, .restart-button {
          background-color: #4CAF50;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 18px;
          margin: 4px 2px;
          cursor: pointer;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .start-button:hover, .restart-button:hover {
          background-color: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        
        .shogi-board {
          display: inline-block;
          border: 3px solid #8B4513;
          margin: 20px 0;
          background: linear-gradient(45deg, #deb887 25%, #f5deb3 25%, #f5deb3 50%, #deb887 50%, #deb887 75%, #f5deb3 75%);
          background-size: 4px 4px;
          padding: 2px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .board-row {
          display: flex;
        }
        
        .board-square {
          width: 50px;
          height: 56px;
          border: 0.5px solid #8B4513;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: linear-gradient(145deg, #f5deb3, #deb887);
          position: relative;
          transition: all 0.2s ease;
        }
        
        .board-square::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(90deg, rgba(139,69,19,0.1) 1px, transparent 1px),
            linear-gradient(rgba(139,69,19,0.1) 1px, transparent 1px);
          background-size: 10px 10px;
          pointer-events: none;
        }
        
        .board-square:hover {
          background: linear-gradient(145deg, #f0e68c, #daa520);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .board-square.selected {
          background: linear-gradient(145deg, #ffd700, #ffa500);
          box-shadow: 
            0 0 10px rgba(255,215,0,0.6),
            inset 0 0 5px rgba(255,165,0,0.4);
        }
        
        .board-square.possible-move {
          background: linear-gradient(145deg, #E6FFE6, #CCFFCC);
        }
        
        .piece {
          font-size: 18px;
          font-weight: bold;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .piece-shape {
          width: 36px;
          height: 44px;
          background: linear-gradient(145deg, #deb887, #cd853f);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #000;
          box-shadow: 
            inset 1px 1px 3px rgba(255,255,255,0.15),
            0 3px 6px rgba(0,0,0,0.3),
            0 1px 2px rgba(0,0,0,0.2);
          clip-path: polygon(10% 92%, 90% 92%, 82% 20%, 50% 3%, 18% 20%);
          transition: all 0.2s ease;
          transform-style: preserve-3d;
        }
        
        .piece-shape::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: rgba(255,255,255,0.15);
          clip-path: polygon(16% 88%, 84% 88%, 77% 23%, 50% 7%, 23% 23%);
          z-index: -1;
        }
        
        .piece-shape:hover {
          transform: translateY(-1px) rotateX(5deg);
          box-shadow: 
            inset 1px 1px 4px rgba(255,255,255,0.9),
            inset -1px -1px 4px rgba(139,69,19,0.5),
            0 4px 8px rgba(0,0,0,0.4),
            0 2px 4px rgba(0,0,0,0.3);
        }
        
        .piece-shape.promoted {
          background: linear-gradient(145deg, #e6c27a, #d4af37);
          border-color: #5b3a1d;
          box-shadow: 
            inset 1px 1px 3px rgba(255,255,255,0.2),
            0 3px 6px rgba(0,0,0,0.4),
            0 1px 2px rgba(0,0,0,0.3);
        }
        
        .piece-shape.promoted::before {
          background: rgba(255,255,255,0.2);
          clip-path: polygon(16% 88%, 84% 88%, 77% 23%, 50% 7%, 23% 23%);
        }
        
        .piece-shape.promoted .piece-text {
          color: #8b4513;
          text-shadow: 
            1px 1px 2px rgba(255,255,255,0.4),
            -1px -1px 1px rgba(0,0,0,0.6);
        }
        
        .piece-text {
          font-family: '金龍', 'KinRyu', 'Hiragino Mincho ProN', 'Yu Mincho', 'YuMincho', 'MS PMincho', serif;
          font-size: 12px;
          font-weight: 900;
          color: #1a1208;
          text-shadow: 
            1px 1px 2px rgba(255,255,255,0.4),
            -1px -1px 2px rgba(0,0,0,0.3);
          margin-top: 0px;
          line-height: 0.85;
          letter-spacing: -0.2px;
          writing-mode: vertical-rl;
          text-orientation: upright;
          text-align: center;
          font-style: normal;
          font-stretch: condensed;
        }
        
        .piece.sente {
          color: #000;
        }
        
        .piece.gote {
          color: #000;
          transform: rotate(180deg);
        }
        
        .piece.gote .piece-text {
          transform: rotate(0deg);
        }
        
        .game-status {
          margin: 20px 0;
          font-size: 18px;
          font-weight: bold;
        }
        
        .captured-pieces {
          display: flex;
          gap: 40px;
          margin-top: 20px;
        }
        
        .sente-captured, .gote-captured {
          border: 2px solid #8B4513;
          padding: 15px;
          border-radius: 8px;
          min-height: 120px;
          background: linear-gradient(145deg, #f5deb3, #deb887);
          box-shadow: inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(139,69,19,0.2);
        }
        
        .captured-pieces-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        
        .captured-piece {
          width: 46px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(245, 222, 179, 0.8);
          border: 1px solid #8B4513;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .captured-piece.clickable:hover {
          background: rgba(255, 235, 205, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .captured-piece.selected {
          background: #FFD700;
          border-color: #FFA500;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
        }
        
        .game-over {
          text-align: center;
          margin: 20px 0;
        }
        
        .game-over h2 {
          color: #4CAF50;
          font-size: 24px;
        }
        
        .ai-thinking {
          color: #ff6b35;
          font-style: italic;
          animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }
        
        .promotion-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .promotion-dialog {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          text-align: center;
          min-width: 300px;
        }
        
        .promotion-dialog h3 {
          margin-bottom: 20px;
          color: #333;
          font-size: 20px;
        }
        
        .promotion-options {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        
        .promotion-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .piece-preview {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5deb3;
          border: 1px solid #8b4513;
          border-radius: 5px;
        }
        
        .promotion-button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .promotion-button:hover {
          background-color: #5a6268;
        }
        
        .promotion-button.promote {
          background-color: #28a745;
        }
        
        .promotion-button.promote:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
}

export default Shogi1;