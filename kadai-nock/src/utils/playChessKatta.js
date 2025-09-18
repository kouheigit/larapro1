// playChessKatta.js
let _ctx;

/** 再生前に1回だけ呼ぶ（iOS対策：ユーザー操作後のタイミングで） */
export function unlockChessAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  _ctx = _ctx || new Ctx();
  if (_ctx.state === 'suspended') _ctx.resume();
}

/** チェスの「カタッ」音を再生 */
export function playChessKatta(opts = {}) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = _ctx || (_ctx = new Ctx());
  if (ctx.state === 'suspended') ctx.resume();

  const {
    volume = 0.9,     // 全体音量
    woodiness = 0.7,  // 木のカチッ成分（高域の短いクリック）
    felt = 0.15       // 盤面の"フェルト感"＝高域のマイルドさ（大きいほど柔らかい）
  } = opts;

  const t0 = ctx.currentTime;

  // マスター
  const master = ctx.createGain();
  master.gain.value = volume * 0.8;
  master.connect(ctx.destination);

  // 瞬間ノイズ（高域の「カチッ」）
  const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(2500 + Math.random() * 800, t0); // 木のクリック帯
  bp.Q.setValueAtTime(8 + Math.random() * 4, t0);

  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0, t0);
  g1.gain.linearRampToValueAtTime(1, t0 + 0.001);
  g1.gain.exponentialRampToValueAtTime(1e-3, t0 + 0.03 + Math.random() * 0.015);

  noise.connect(bp);
  bp.connect(g1);
  g1.connect(master);

  // 低めの"コツ"（胴鳴り）
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  const f0 = 190 + Math.random() * 40;                // 低めの基本音
  osc.frequency.setValueAtTime(f0, t0);
  osc.frequency.exponentialRampToValueAtTime(f0 * 0.6, t0 + 0.08); // 短いピッチダウン

  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0, t0);
  g2.gain.linearRampToValueAtTime(1, t0 + 0.002);
  g2.gain.exponentialRampToValueAtTime(1e-3, t0 + 0.12);

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(1500 + (1 - felt) * 3000, t0); // felt↑で高域を丸める

  osc.connect(g2);
  g2.connect(lp);
  lp.connect(master);

  // 追加の「木のチッ」（超短い三角波＋ハイパス）
  if (woodiness > 0) {
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    const f1 = 1200 + Math.random() * 1200;
    osc2.frequency.setValueAtTime(f1, t0);

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(800, t0);

    const g3 = ctx.createGain();
    g3.gain.setValueAtTime(0, t0);
    g3.gain.linearRampToValueAtTime(0.8 * woodiness, t0 + 0.001);
    g3.gain.exponentialRampToValueAtTime(1e-3, t0 + 0.02);

    osc2.connect(hp);
    hp.connect(g3);
    g3.connect(master);

    osc2.start(t0);
    osc2.stop(t0 + 0.04);
  }

  noise.start(t0);
  noise.stop(t0 + 0.06);

  osc.start(t0);
  osc.stop(t0 + 0.14);
}
