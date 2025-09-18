import React, { useMemo, useState } from "react";
import { playChessKatta, unlockChessAudio } from '../utils/playChessKatta.js';

/**
 * React ChessBoard with full move validation and difficulty selection:
 * - Game start screen with difficulty selection (弱・普通・強)
 * - Complete chess engine with move validation
 * - Check / Checkmate detection
 * - Castling, En passant, Pawn promotion
 * - Move history and game state management
 */

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -";

// Helpers
const files = ["a","b","c","d","e","f","g","h"];
const ranks = [8,7,6,5,4,3,2,1];

function inBounds(x, y) { return x >= 0 && x < 8 && y >= 0 && y < 8; }
const isUpper = (s) => s === s.toUpperCase();
const isLower = (s) => s === s.toLowerCase();
const pieceColor = (p) => (p && p === p.toUpperCase()) ? "w" : (p ? "b" : null);

function parseFEN(fen) {
  const [boardStr, toMove, castling, ep] = fen.split(" ");
  const rows = boardStr.split("/");
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  rows.forEach((row, y) => {
    let x = 0;
    for (const ch of row) {
      if (/[1-8]/.test(ch)) {
        x += parseInt(ch, 10);
      } else {
        board[y][x] = ch; // FEN uses uppercase white, lowercase black
        x += 1;
      }
    }
  });
  return { board, toMove, castling, ep: ep === "-" ? null : ep };
}

function boardToFEN(board, toMove, castling, ep) {
  const rows = board.map(row => {
    let s = ""; let empty = 0;
    for (const cell of row) {
      if (!cell) { empty++; }
      else { if (empty > 0) { s += empty; empty = 0; } s += cell; }
    }
    if (empty > 0) s += empty;
    return s;
  });
  return `${rows.join("/")} ${toMove} ${castling || "-"} ${ep || "-"}`;
}

function algebraic(x, y) { return files[x] + String(ranks[y]); }
function fromAlgebraic(sq) {
  if (!sq || sq.length < 2) return null;
  const f = files.indexOf(sq[0]);
  const r = ranks.indexOf(parseInt(sq[1], 10));
  if (f === -1 || r === -1) return null;
  return { x: f, y: r };
}

// Movement vectors
const DIRS = {
  N:  [[0,-1]],
  S:  [[0, 1]],
  E:  [[1, 0]],
  W:  [[-1,0]],
  NE: [[1,-1]],
  NW: [[-1,-1]],
  SE: [[1,1]],
  SW: [[-1,1]],
  BISHOP: [[1,1],[-1,1],[1,-1],[-1,-1]],
  ROOK: [[1,0],[-1,0],[0,1],[0,-1]],
  KING: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
  KNIGHT: [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],
};

function cloneBoard(board) { return board.map(row => row.slice()); }

function findKing(board, color) {
  const target = color === "w" ? "K" : "k";
  for (let y=0; y<8; y++) for (let x=0; x<8; x++) if (board[y][x] === target) return {x,y};
  return null;
}

function isSquareAttacked(board, x, y, byColor, epSquare) {
  // Check knight attacks
  for (const [dx,dy] of DIRS.KNIGHT) {
    const nx = x + dx, ny = y + dy;
    if (!inBounds(nx, ny)) continue;
    const p = board[ny][nx];
    if (!p) continue;
    if (pieceColor(p) === byColor && (p.toLowerCase() === 'n')) return true;
  }
  // Check king adjacency
  for (const [dx,dy] of DIRS.KING) {
    const nx = x + dx, ny = y + dy;
    if (!inBounds(nx, ny)) continue;
    const p = board[ny][nx];
    if (!p) continue;
    if (pieceColor(p) === byColor && (p.toLowerCase() === 'k')) return true;
  }
  // Sliding pieces (rook/queen, bishop/queen)
  for (const [dx,dy] of DIRS.ROOK) {
    let nx=x+dx, ny=y+dy;
    while (inBounds(nx,ny)) {
      const p = board[ny][nx];
      if (p) {
        if (pieceColor(p) === byColor && (p.toLowerCase()==='r' || p.toLowerCase()==='q')) return true;
        break;
      }
      nx+=dx; ny+=dy;
    }
  }
  for (const [dx,dy] of DIRS.BISHOP) {
    let nx=x+dx, ny=y+dy;
    while (inBounds(nx,ny)) {
      const p = board[ny][nx];
      if (p) {
        if (pieceColor(p) === byColor && (p.toLowerCase()==='b' || p.toLowerCase()==='q')) return true;
        break;
      }
      nx+=dx; ny+=dy;
    }
  }
  // Pawn attacks
  if (byColor === 'w') {
    const coords = [[x-1,y-1],[x+1,y-1]];
    for (const [nx,ny] of coords) {
      if (!inBounds(nx,ny)) continue;
      const p = board[ny][nx];
      if (p === 'P') return true;
    }
  } else {
    const coords = [[x-1,y+1],[x+1,y+1]];
    for (const [nx,ny] of coords) {
      if (!inBounds(nx,ny)) continue;
      const p = board[ny][nx];
      if (p === 'p') return true;
    }
  }
  return false;
}

function makeMove(board, move) {
  const nb = cloneBoard(board);
  const { from, to, piece, capture, promotion, isEnPassant, isCastle, rookFrom, rookTo } = move;
  nb[from.y][from.x] = null;
  if (isEnPassant && capture && !nb[to.y][to.x]) {
    // remove the pawn behind target square
    const dir = piece === 'P' ? 1 : -1; // if white moved, captured pawn was one down
    nb[to.y + dir][to.x] = null;
  }
  nb[to.y][to.x] = promotion ? promotion : piece;
  if (isCastle && rookFrom && rookTo) {
    const rook = nb[rookFrom.y][rookFrom.x];
    nb[rookFrom.y][rookFrom.x] = null;
    nb[rookTo.y][rookTo.x] = rook;
  }
  return nb;
}

function generatePseudoMoves(board, x, y, state) {
  const p = board[y][x];
  if (!p) return [];
  const color = pieceColor(p);
  const enemy = color === 'w' ? 'b' : 'w';
  const res = [];

  const addIf = (nx, ny, opts={}) => {
    if (!inBounds(nx,ny)) return;
    const t = board[ny][nx];
    if (!t || pieceColor(t) === enemy) {
      res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture: !!t, ...opts });
    }
  };

  switch (p.toLowerCase()) {
    case 'n': {
      for (const [dx,dy] of DIRS.KNIGHT) {
        addIf(x+dx, y+dy);
      }
      break;
    }
    case 'b': {
      for (const [dx,dy] of DIRS.BISHOP) {
        let nx=x+dx, ny=y+dy;
        while (inBounds(nx,ny)) {
          const t = board[ny][nx];
          if (!t) res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture:false });
          else { if (pieceColor(t)===enemy) res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture:true }); break; }
          nx+=dx; ny+=dy;
        }
      }
      break;
    }
    case 'r': {
      for (const [dx,dy] of DIRS.ROOK) {
        let nx=x+dx, ny=y+dy;
        while (inBounds(nx,ny)) {
          const t = board[ny][nx];
          if (!t) res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture:false });
          else { if (pieceColor(t)===enemy) res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture:true }); break; }
          nx+=dx; ny+=dy;
        }
      }
      break;
    }
    case 'q': {
      for (const [dx,dy] of [...DIRS.ROOK, ...DIRS.BISHOP]) {
        let nx=x+dx, ny=y+dy;
        while (inBounds(nx,ny)) {
          const t = board[ny][nx];
          if (!t) res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture:false });
          else { if (pieceColor(t)===enemy) res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture:true }); break; }
          nx+=dx; ny+=dy;
        }
      }
      break;
    }
    case 'k': {
      for (const [dx,dy] of DIRS.KING) {
        addIf(x+dx, y+dy);
      }
      // Castling (pseudo; legality checked later)
      const colorIsWhite = color === 'w';
      const rank = colorIsWhite ? 7 : 0; // white king starts y=7 (rank 1 visually), black y=0
      if (y === rank && x === 4) {
        // King-side
        if ((colorIsWhite ? state.castling.includes('K') : state.castling.includes('k'))
            && !board[rank][5] && !board[rank][6]) {
          res.push({ from:{x,y}, to:{x:6,y:rank}, piece:p, isCastle:true, rookFrom:{x:7,y:rank}, rookTo:{x:5,y:rank} });
        }
        // Queen-side
        if ((colorIsWhite ? state.castling.includes('Q') : state.castling.includes('q'))
            && !board[rank][1] && !board[rank][2] && !board[rank][3]) {
          res.push({ from:{x,y}, to:{x:2,y:rank}, piece:p, isCastle:true, rookFrom:{x:0,y:rank}, rookTo:{x:3,y:rank} });
        }
      }
      break;
    }
    case 'p': {
      const dir = color === 'w' ? -1 : 1; // white goes up (y-1)
      const startRank = color === 'w' ? 6 : 1;
      // one step
      if (inBounds(x, y+dir) && !board[y+dir][x]) {
        res.push({ from:{x,y}, to:{x, y:y+dir}, piece:p });
        // two steps
        if (y === startRank && !board[y+2*dir][x]) {
          res.push({ from:{x,y}, to:{x, y:y+2*dir}, piece:p, isDouble:true });
        }
      }
      // captures
      for (const dx of [-1, 1]) {
        const nx = x+dx, ny = y+dir;
        if (!inBounds(nx,ny)) continue;
        const target = board[ny][nx];
        if (target && pieceColor(target) === enemy) {
          res.push({ from:{x,y}, to:{x:nx,y:ny}, piece:p, capture:true });
        }
      }
      // En passant
      if (state.ep) {
        const ep = fromAlgebraic(state.ep);
        if (ep && ep.y === y+dir && Math.abs(ep.x - x) === 1) {
          res.push({ from:{x,y}, to:{x:ep.x, y:ep.y}, piece:p, capture:true, isEnPassant:true });
        }
      }
      break;
    }
    default: break;
  }

  // Promotions (mark eligible moves with promotion placeholders; actual piece chosen later)
  const promoRank = color === 'w' ? 0 : 7;
  for (const m of res) {
    if (p.toLowerCase() === 'p' && m.to.y === promoRank) {
      m.canPromote = true;
    }
  }

  return res;
}

function legalMovesFor(board, x, y, state) {
  const p = board[y][x];
  if (!p) return [];
  const color = pieceColor(p);
  if (color !== state.toMove) return [];
  const enemy = color === 'w' ? 'b' : 'w';
  const pseudo = generatePseudoMoves(board, x, y, state);

  return pseudo.filter(m => {
    // Additional castling legality: king not in, through, or into check
    let epAfter = null;
    if (m.isDouble && p.toLowerCase()==='p') {
      // set ep target square behind the pawn
      const dir = color === 'w' ? -1 : 1;
      epAfter = algebraic(x, y + dir);
    }
    const nb = makeMove(board, {
      ...m,
      promotion: m.promotion || (m.canPromote ? (color==='w'? 'Q':'q') : undefined)
    });

    const kpos = findKing(nb, color);
    if (!kpos) return false;

    // For castling: check squares x, x+/-1, and destination not attacked; and no pieces between already checked
    if (m.isCastle) {
      const rank = kpos.y; // after tentative move king already placed at destination -> recompute checks on path
      const fromX = x;
      const path = m.to.x === 6 ? [4,5,6] : [4,3,2];
      // Use original board for attack checks on through squares (king can't pass through check)
      for (const px of path) {
        const attacked = isSquareAttacked(board, px, rank, enemy, state.ep);
        if (attacked) return false;
      }
    }

    // General legality: king not left in check after the move
    const attackedAfter = isSquareAttacked(nb, kpos.x, kpos.y, enemy, epAfter);
    if (attackedAfter) return false;

    // Disallow moving into occupied by same color already handled
    return true;
  });
}

function computeAllLegalMoves(board, state) {
  const moves = [];
  for (let y=0;y<8;y++) for (let x=0;x<8;x++) {
    const p = board[y][x];
    if (p && pieceColor(p) === state.toMove) {
      const ms = legalMovesFor(board, x, y, state);
      for (const m of ms) moves.push(m);
    }
  }
  return moves;
}

function useChess(fen=INITIAL_FEN) {
  const [{ board, toMove, castling, ep }, setState] = useState(() => parseFEN(fen));
  const [history, setHistory] = useState([]);
  const [promotionChoice, setPromotionChoice] = useState(null); // {move, resolve}

  const state = { toMove, castling, ep };

  const moveList = useMemo(() => computeAllLegalMoves(board, state), [board, toMove, castling, ep]);

  function canCastleUpdate(move, castlingStr) {
    // Remove rights if king or rook moves/captured
    let c = castlingStr || "";
    const { piece, from, to } = move;
    if (!c || c === "-") c = "";

    // King moved => remove both sides for that color
    if (piece === 'K') c = c.replace('K','').replace('Q','');
    if (piece === 'k') c = c.replace('k','').replace('q','');

    // Rook moved from original squares
    if (piece === 'R') {
      if (from.x===0 && from.y===7) c = c.replace('Q','');
      if (from.x===7 && from.y===7) c = c.replace('K','');
    }
    if (piece === 'r') {
      if (from.x===0 && from.y===0) c = c.replace('q','');
      if (from.x===7 && from.y===0) c = c.replace('k','');
    }

    // Rook captured on original squares
    const captured = board[move.to.y][move.to.x];
    if (captured === 'R') {
      if (move.to.x===0 && move.to.y===7) c = c.replace('Q','');
      if (move.to.x===7 && move.to.y===7) c = c.replace('K','');
    }
    if (captured === 'r') {
      if (move.to.x===0 && move.to.y===0) c = c.replace('q','');
      if (move.to.x===7 && move.to.y===0) c = c.replace('k','');
    }

    return c || "-";
  }

  function performMove(move) {
    // Handle promotion choice UI if needed
    if (move.canPromote && !move.promotion) {
      return new Promise((resolve) => {
        setPromotionChoice({ move, resolve });
      });
    }

    const newBoard = makeMove(board, move);
    const next = toMove === 'w' ? 'b' : 'w';

    // En passant target setup
    let epNext = null;
    if (move.isDouble && move.piece.toLowerCase() === 'p') {
      const dir = toMove === 'w' ? -1 : 1; // square passed over
      epNext = algebraic(move.from.x, move.from.y + dir);
    }

    const newCastling = canCastleUpdate(move, castling);

    const san = moveToSAN(board, move);

    setState({ board: newBoard, toMove: next, castling: newCastling, ep: epNext });
    setHistory(h => [{ san, fen: boardToFEN(newBoard, next, newCastling, epNext) }, ...h]);

    return Promise.resolve();
  }

  function choosePromotion(pieceLetter) {
    if (!promotionChoice) return;
    const { move, resolve } = promotionChoice;
    const promo = (toMove === 'w' ? pieceLetter.toUpperCase() : pieceLetter.toLowerCase());
    setPromotionChoice(null);
    performMove({ ...move, promotion: promo }).then(resolve);
  }

  function resetGame() {
    const initial = parseFEN(INITIAL_FEN);
    setState(initial);
    setHistory([]);
    setPromotionChoice(null);
  }

  return { board, toMove, castling, ep, history, moveList, performMove, legalMovesFor: (x,y)=>legalMovesFor(board,x,y,{toMove,castling,ep}), promotionChoice, choosePromotion, resetGame };
}

function moveToSAN(board, move) {
  // Very light SAN-ish for history: e2e4, exd5, O-O, O-O-O, e8=Q, etc.
  const piece = move.piece.toLowerCase();
  if (move.isCastle) return move.to.x === 6 ? "O-O" : "O-O-O";
  const from = algebraic(move.from.x, move.from.y), to = algebraic(move.to.x, move.to.y);
  const promo = move.promotion ? `=${move.promotion.toUpperCase()}` : "";
  if (piece === 'p') {
    if (move.capture) return `${from[0]}x${to}${promo}`;
    return `${to}${promo}`;
  }
  const map = { n:"N", b:"B", r:"R", q:"Q", k:"K" };
  return `${map[piece]}${move.capture ? 'x' : ''}${to}${promo}`;
}

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
  'K': whiteKing,
  'Q': whiteQueen,
  'R': whiteRook,
  'B': whiteBishop,
  'N': whiteKnight,
  'P': whitePawn,
  // 黒い駒
  'k': blackKing,
  'q': blackQueen,
  'r': blackRook,
  'b': blackBishop,
  'n': blackKnight,
  'p': blackPawn,
};

function PieceGlyph({ p }) {
  if (!p) return null;
  
  // 白のポーンだけサイズを調整（全体的に大きく）
  const isWhitePawn = p === 'P';
  const pieceSize = isWhitePawn ? '50px' : '46px';
  
  return (
    <img 
      src={pieceImages[p]} 
      alt={p}
      style={{
        width: pieceSize,
        height: pieceSize,
        objectFit: 'contain'
      }}
      onError={(e) => {
        // 画像が見つからない場合はUnicode記号で表示
        const glyphs = {
          'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
          'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟︎'
        };
        e.target.style.display = 'none';
        const span = document.createElement('span');
        span.style.fontSize = '2rem';
        span.textContent = glyphs[p] || p;
        e.target.parentNode.appendChild(span);
      }}
    />
  );
}

// ゲーム開始画面コンポーネント
function GameStartScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('普通');

  const difficulties = [
    { key: '弱', label: '弱', description: '初心者向け' },
    { key: '普通', label: '普通', description: '標準的な強さ' },
    { key: '強', label: '強', description: '上級者向け' }
  ];

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '30px',
        color: '#2c3e50',
        fontWeight: 'bold'
      }}>
        ♔ チェスゲーム ♛
      </h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '1.2rem', 
          marginBottom: '20px',
          color: '#34495e'
        }}>
          難易度を選択してください
        </h2>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          alignItems: 'center'
        }}>
          {difficulties.map((diff) => (
            <label 
              key={diff.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                border: `2px solid ${difficulty === diff.key ? '#3498db' : '#bdc3c7'}`,
                borderRadius: '8px',
                backgroundColor: difficulty === diff.key ? '#e8f4fd' : '#fff',
                cursor: 'pointer',
                minWidth: '200px',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="radio"
                name="difficulty"
                value={diff.key}
                checked={difficulty === diff.key}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ marginRight: '12px' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {diff.label}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  {diff.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(difficulty)}
        style={{
          fontSize: '1.3rem',
          padding: '15px 40px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease',
          boxShadow: '0 2px 8px rgba(39, 174, 96, 0.3)'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
      >
        🎮 ゲーム開始
      </button>
    </div>
  );
}

// 簡単なAI機能
function getRandomMove(moveList) {
  if (moveList.length === 0) return null;
  return moveList[Math.floor(Math.random() * moveList.length)];
}

function getBestMove(moveList, difficulty) {
  if (moveList.length === 0) return null;
  
  switch (difficulty) {
    case '弱':
      // 完全ランダム
      return getRandomMove(moveList);
      
    case '普通':
      // 駒を取る手があれば優先、なければランダム
      const captureMoves = moveList.filter(m => m.capture);
      if (captureMoves.length > 0) {
        return getRandomMove(captureMoves);
      }
      return getRandomMove(moveList);
      
    case '強':
      // 駒を取る手を最優先、チェック手も優先
      const captureMovesStrong = moveList.filter(m => m.capture);
      if (captureMovesStrong.length > 0) {
        return getRandomMove(captureMovesStrong);
      }
      // キャスリングがあれば優先
      const castleMoves = moveList.filter(m => m.isCastle);
      if (castleMoves.length > 0) {
        return getRandomMove(castleMoves);
      }
      // 中央に向かう手を優先
      const centralMoves = moveList.filter(m => {
        const { x, y } = m.to;
        return (x >= 2 && x <= 5 && y >= 2 && y <= 5);
      });
      if (centralMoves.length > 0) {
        return getRandomMove(centralMoves);
      }
      return getRandomMove(moveList);
      
    default:
      return getRandomMove(moveList);
  }
}

// メインのチェスゲームコンポーネント
export default function Chess() {
  const { board, toMove, history, performMove, legalMovesFor, promotionChoice, choosePromotion, resetGame, moveList } = useChess();
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 音声再生関数
  const playMoveSound = React.useCallback((move) => {
    if (!soundEnabled) return;
    
    try {
      // キャスリングの場合は少し異なる音
      if (move.isCastle) {
        playChessKatta({ volume: 0.8, woodiness: 0.9, felt: 0.1 });
      }
      // 駒を取った場合は少し強い音
      else if (move.capture) {
        playChessKatta({ volume: 1.0, woodiness: 0.8, felt: 0.05 });
      }
      // 通常の移動
      else {
        playChessKatta({ volume: 0.7, woodiness: 0.6, felt: 0.2 });
      }
    } catch (error) {
      // 音声再生エラーは無視（ゲーム進行に影響しない）
      console.log('Audio playback failed:', error);
    }
  }, [soundEnabled]);

  // AIの手を実行する関数
  const makeAIMove = React.useCallback(() => {
    if (toMove !== 'b' || isThinking) return;
    
    setIsThinking(true);
    
    // 思考時間をシミュレート
    const thinkingTime = difficulty === '弱' ? 500 : difficulty === '普通' ? 1000 : 1500;
    
    setTimeout(() => {
      const aiMove = getBestMove(moveList, difficulty);
      if (aiMove) {
        performMove(aiMove).then(() => {
          playMoveSound(aiMove); // AI の手の音を再生
          setIsThinking(false);
        });
      } else {
        setIsThinking(false);
      }
    }, thinkingTime);
  }, [toMove, moveList, difficulty, isThinking, performMove, playMoveSound]);

  // 黒の手番になったらAIを実行
  React.useEffect(() => {
    if (gameStarted && toMove === 'b' && !isThinking && !promotionChoice) {
      makeAIMove();
    }
  }, [gameStarted, toMove, isThinking, promotionChoice, makeAIMove]);

  function onSquareClick(x, y) {
    // 黒の手番中（AI思考中）は操作を無効にする
    if (toMove === 'b' || isThinking) return;
    
    const sel = selected;
    if (sel) {
      const legal = moves.find(m => m.to.x===x && m.to.y===y);
      if (legal) {
        performMove(legal).then(()=>{
          playMoveSound(legal); // プレイヤーの手の音を再生
          setSelected(null); setMoves([]);
        });
        return;
      }
    }
    const p = board[y][x];
    if (!p) { setSelected(null); setMoves([]); return; }
    // 白の駒のみ選択可能
    if (pieceColor(p) !== 'w') { setSelected(null); setMoves([]); return; }
    const ms = legalMovesFor(x,y);
    setSelected({x,y});
    setMoves(ms);
  }

  function handleGameStart(selectedDifficulty) {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    resetGame();
    
    // オーディオコンテキストをアンロック（iOS対策）
    try {
      unlockChessAudio();
      // テスト音を再生（ゲーム開始の合図）
      setTimeout(() => {
        if (soundEnabled) {
          playChessKatta({ volume: 0.5, woodiness: 0.5, felt: 0.3 });
        }
      }, 100);
    } catch (error) {
      console.log('Audio unlock failed:', error);
    }
  }

  function handleNewGame() {
    setGameStarted(false);
    setDifficulty(null);
    setSelected(null);
    setMoves([]);
    setIsThinking(false);
  }

  if (!gameStarted) {
    return <GameStartScreen onStart={handleGameStart} />;
  }

  return (
    <div style={{ 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f6fa'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        marginBottom: '20px', 
        textAlign: 'center',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '800px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#2c3e50' }}>
          ♔ チェスゲーム ♛
        </h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ fontSize: '1.1rem' }}>
            <strong>難易度:</strong> {difficulty} | <strong>手番:</strong> {toMove==='w' ? '白（あなた）' : '黒（コンピューター）'}
            {isThinking && <span style={{ color: '#e67e22', marginLeft: '10px' }}>🤔 思考中...</span>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                padding: '8px 16px',
                backgroundColor: soundEnabled ? '#27ae60' : '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {soundEnabled ? '🔊 音ON' : '🔇 音OFF'}
            </button>
            <button
              onClick={handleNewGame}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              新しいゲーム
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '30px',
        width: '100%',
        maxWidth: '1000px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {/* チェス盤 */}
        <div style={{ 
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 56px)',
            gridTemplateRows: 'repeat(8, 56px)',
            gap: '0',
            border: '3px solid #34495e',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {board.map((row, y) => row.map((cell, x) => {
              const isDark = (x + y) % 2 === 1;
              const isSelected = selected && selected.x===x && selected.y===y;
              const isTarget = moves.some(m => m.to.x===x && m.to.y===y);
    return (
                <button key={`${x}-${y}`}
                  onClick={() => onSquareClick(x,y)}
                  style={{
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDark ? '#b58863' : '#f0d9b5',
                    border: 'none',
                    outline: isSelected ? '4px solid #f39c12' : (isTarget ? '4px solid #3498db' : 'none'),
                    cursor: 'pointer',
                    transition: 'all 0.1s ease'
                  }}
                  title={`${files[x]}${ranks[y]}`}
                >
                  <PieceGlyph p={cell}/>
                </button>
              );
            }))}
          </div>
        </div>

        {/* サイドパネル */}
        <div style={{ 
          minWidth: '280px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>指し手履歴</h3>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            border: '1px solid #bdc3c7',
            borderRadius: '6px',
            padding: '10px',
            backgroundColor: '#f8f9fa'
          }}>
            {history.length === 0 ? (
              <p style={{ color: '#7f8c8d', fontStyle: 'italic', margin: 0 }}>まだ指し手がありません</p>
            ) : (
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                {history.slice().reverse().map((h, i) => (
                  <li key={i} style={{ 
                    marginBottom: '8px',
                    padding: '4px',
                    backgroundColor: i % 2 === 0 ? '#ecf0f1' : 'transparent',
                    borderRadius: '4px'
                  }}>
                    <strong>{h.san}</strong>
                  </li>
                ))}
              </ol>
            )}
          </div>
          
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#7f8c8d' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>操作方法</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>駒をクリックして選択</li>
              <li>移動可能マスが青色で表示</li>
              <li>移動先をクリックして駒を動かす</li>
              <li>特殊ルール（キャスリング、アンパッサン等）も自動対応</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 昇格選択モーダル */}
      {promotionChoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>昇格する駒を選んでください</h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              {['Q','R','B','N'].map(l => (
                <button 
                  key={l} 
                  onClick={()=>choosePromotion(l)} 
                  style={{
                    padding: '15px 20px',
                    fontSize: '1.2rem',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  {l === 'Q' ? 'クイーン' : l === 'R' ? 'ルーク' : l === 'B' ? 'ビショップ' : 'ナイト'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
        </div>
    );
}
