import { useEffect, useMemo, useState } from "react";

// タイプ別の色定義
const typeColors = {
	ノーマル: "#A8A878",
	ほのお: "#F08030",
	みず: "#6890F0",
	でんき: "#F8D030",
	くさ: "#78C850",
	こおり: "#98D8D8",
	かくとう: "#C03028",
	どく: "#A040A0",
	じめん: "#E0C068",
	ひこう: "#A890F0",
	エスパー: "#F85888",
	むし: "#A8B820",
	いわ: "#B8A038",
	ゴースト: "#705898",
	ドラゴン: "#7038F8",
	あく: "#705848",
	はがね: "#B8B8D0",
	フェアリー: "#EE99AC"
};

// タイプバッジのスタイル
const getTypeBadgeStyle = (type) => ({
	backgroundColor: typeColors[type] || "#A8A878",
	color: "white",
	padding: "4px 12px",
	borderRadius: "20px",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "2px",
	display: "inline-block",
	textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
	boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
});

export default function Pokemon3() {
	const [inputNameJa, setInputNameJa] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [result, setResult] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	// 日本語→英語スラッグを引くために、全ポケモン種一覧をキャッシュ
	const [speciesIndex, setSpeciesIndex] = useState([]);
	const hasSpeciesIndex = useMemo(() => speciesIndex && speciesIndex.length > 0, [speciesIndex]);

	// 効果音を再生する関数
	const playSound = () => {
		try {
			// Web Audio APIを使用してパカッという音を生成
			const audioContext = new (window.AudioContext || window.webkitAudioContext)();
			
			// パカッという音を作成
			const createPakaSound = () => {
				// 「パ」の音 - 短く強い破裂音
				const osc1 = audioContext.createOscillator();
				const gain1 = audioContext.createGain();
				
				osc1.connect(gain1);
				gain1.connect(audioContext.destination);
				
				// パの部分：高い周波数から急激に下がる
				osc1.frequency.setValueAtTime(600, audioContext.currentTime);
				osc1.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.03);
				
				gain1.gain.setValueAtTime(0.6, audioContext.currentTime);
				gain1.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.03);
				
				osc1.type = 'square'; // 硬い破裂音
				osc1.start(audioContext.currentTime);
				osc1.stop(audioContext.currentTime + 0.03);
				
				// 「カッ」の音 - 木材がぶつかる音
				const osc2 = audioContext.createOscillator();
				const gain2 = audioContext.createGain();
				
				osc2.connect(gain2);
				gain2.connect(audioContext.destination);
				
				// カッの部分：中間の周波数
				osc2.frequency.setValueAtTime(400, audioContext.currentTime + 0.04);
				osc2.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.08);
				
				gain2.gain.setValueAtTime(0.4, audioContext.currentTime + 0.04);
				gain2.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
				
				osc2.type = 'sawtooth'; // 木材の硬い音
				osc2.start(audioContext.currentTime + 0.04);
				osc2.stop(audioContext.currentTime + 0.08);
				
				// ノイズ成分（木材の質感）
				const bufferSize = audioContext.sampleRate * 0.1;
				const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
				const output = noiseBuffer.getChannelData(0);
				
				for (let i = 0; i < bufferSize; i++) {
					output[i] = Math.random() * 2 - 1;
				}
				
				const noiseSource = audioContext.createBufferSource();
				const noiseGain = audioContext.createGain();
				const noiseFilter = audioContext.createBiquadFilter();
				
				noiseSource.buffer = noiseBuffer;
				noiseSource.connect(noiseFilter);
				noiseFilter.connect(noiseGain);
				noiseGain.connect(audioContext.destination);
				
				// 高周波をカットしてこもった音に
				noiseFilter.type = 'lowpass';
				noiseFilter.frequency.setValueAtTime(800, audioContext.currentTime);
				
				noiseGain.gain.setValueAtTime(0.15, audioContext.currentTime);
				noiseGain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
				
				noiseSource.start(audioContext.currentTime);
				noiseSource.stop(audioContext.currentTime + 0.1);
			};
			
			createPakaSound();
		} catch (error) {
			// Web Audio APIが使用できない場合は無音
			console.log('Audio not supported');
		}
	};

	const handleOpen = () => {
		playSound();
		setIsOpen(true);
	};

	const handleClose = () => {
		playSound();
		setIsOpen(false);
	};

	useEffect(() => {
		let aborted = false;
		(async () => {
			try {
				// すべてのポケモン種を取得（日本語名は個別詳細で取る必要がある）
				const res = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=20000");
				if (!res.ok) throw new Error("ポケモン一覧の取得に失敗しました");
				const data = await res.json();
				if (!aborted) setSpeciesIndex(data.results || []);
			} catch (e) {
				// インデックスがなくても個別検索時に再挑戦するのでここでは致命的にしない
				console.error(e);
			}
		})();
		return () => {
			aborted = true;
		};
	}, []);

	async function findSlugByJapaneseName(nameJa) {
		// 前後空白を除去、全角半角の差はそのまま（ユーザー入力を尊重）
		const target = nameJa.trim();
		if (!target) return null;

		// インデックスがない場合はその場で取得
		let indexList = speciesIndex;
		if (!hasSpeciesIndex) {
			try {
				const res = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=20000");
				if (!res.ok) throw new Error("ポケモン一覧の取得に失敗しました");
				const data = await res.json();
				indexList = data.results || [];
				setSpeciesIndex(indexList);
			} catch (e) {
				console.error(e);
				return null;
			}
		}

		// 候補を小分けで並列フェッチして日本語名一致を探す
		const chunkSize = 50;
		for (let i = 0; i < indexList.length; i += chunkSize) {
			const chunk = indexList.slice(i, i + chunkSize);
			try {
				const details = await Promise.all(
					chunk.map(async (s) => {
						const r = await fetch(s.url);
						if (!r.ok) return null;
						return r.json();
					})
				);
				for (const sp of details) {
					if (!sp || !sp.names) continue;
					const ja = sp.names.find(
						(n) => n.language?.name === "ja" || n.language?.name === "ja-Hrkt"
					);
					if (ja && ja.name === target) {
						return sp.name; // 英語スラッグ
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
		return null;
	}

	async function fetchTypeJaNames(typeSlugs) {
		try {
			const types = await Promise.all(
				typeSlugs.map(async (slug) => {
					const r = await fetch(`https://pokeapi.co/api/v2/type/${slug}`);
					if (!r.ok) return slug;
					const d = await r.json();
					const jaEntry = (d.names || []).find(
						(n) => n.language?.name === "ja" || n.language?.name === "ja-Hrkt"
					);
					return jaEntry?.name || slug;
				})
			);
			return types;
		} catch {
			return typeSlugs;
		}
	}

	async function handleSearch(e) {
		e && e.preventDefault();
		setErrorMessage("");
		setResult(null);
		if (!inputNameJa.trim()) {
			setErrorMessage("ポケモン名（日本語）を入力してください。");
			return;
		}
		setIsLoading(true);
		try {
			const slug = await findSlugByJapaneseName(inputNameJa);
			if (!slug) {
				setErrorMessage("該当するポケモンが見つかりませんでした。");
				setIsLoading(false);
				return;
			}

			const [pokemonRes, speciesRes] = await Promise.all([
				fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`),
				fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug}`)
			]);
			if (!pokemonRes.ok || !speciesRes.ok) throw new Error("ポケモン情報の取得に失敗しました");
			const [pokemonData, speciesData] = await Promise.all([pokemonRes.json(), speciesRes.json()]);

			const typesEn = (pokemonData.types || []).map((t) => t.type?.name).filter(Boolean);
			const typesJa = await fetchTypeJaNames(typesEn);

			const nameJa = (speciesData.names || []).find(
				(n) => n.language?.name === "ja" || n.language?.name === "ja-Hrkt"
			)?.name;
			const flavorJa = (speciesData.flavor_text_entries || []).find(
				(f) => f.language?.name === "ja" || f.language?.name === "ja-Hrkt"
			)?.flavor_text?.replace(/\f/g, " ").replace(/\n/g, " ");

			const img =
				pokemonData.sprites?.other?.["official-artwork"]?.front_default ||
				pokemonData.sprites?.front_default ||
				"";
			const cryUrl = pokemonData.cries?.latest || pokemonData.cries?.legacy || "";

			setResult({
				id: pokemonData.id,
				slug,
				nameJa: nameJa || inputNameJa,
				imageUrl: img,
				cryUrl,
				headline: flavorJa || "説明文が見つかりません。",
				typesJa
			});
		} catch (e) {
			console.error(e);
			setErrorMessage("取得中にエラーが発生しました。時間をおいて再度お試しください。");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div style={{ 
			padding: "20px", 
			background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
			minHeight: "100vh",
			fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		}}>
			{!isOpen ? (
				/* 閉じた状態のポケモン図鑑 */
				<div style={{
					position: "relative",
					width: "320px",
					height: "450px",
					background: "linear-gradient(145deg, #dc3545, #c82333)",
					borderRadius: "15px",
					boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(255,255,255,0.2)",
					border: "3px solid #495057",
					cursor: "pointer",
					transition: "all 0.3s ease",
					transform: "perspective(1000px) rotateY(-8deg)",
					overflow: "hidden"
				}}
				onClick={handleOpen}
				onMouseEnter={(e) => {
					e.target.style.transform = "perspective(1000px) rotateY(-3deg) scale(1.05)";
				}}
				onMouseLeave={(e) => {
					e.target.style.transform = "perspective(1000px) rotateY(-8deg) scale(1)";
				}}>
					{/* 図鑑の表面 */}
					<div style={{
						position: "absolute",
						top: "15px",
						left: "15px",
						right: "15px",
						bottom: "15px",
						background: "linear-gradient(145deg, #dc3545, #b02a37)",
						borderRadius: "12px",
						padding: "25px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-between"
					}}>
						{/* 上部のポケモンボール */}
						<div style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginTop: "20px"
						}}>
							{/* 大きなポケモンボール */}
							<div style={{
								width: "120px",
								height: "120px",
								background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
								borderRadius: "50%",
								border: "6px solid #212529",
								position: "relative",
								boxShadow: "0 8px 20px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.5)",
								cursor: "pointer"
							}}>
								{/* 上半分（白） */}
								<div style={{
									position: "absolute",
									top: "0",
									left: "0",
									right: "0",
									height: "50%",
									background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
									borderRadius: "120px 120px 0 0"
								}} />
								
								{/* 下半分（赤） */}
								<div style={{
									position: "absolute",
									bottom: "0",
									left: "0",
									right: "0",
									height: "50%",
									background: "linear-gradient(145deg, #dc3545, #c82333)",
									borderRadius: "0 0 120px 120px"
								}} />
								
								{/* 中央の黒いライン */}
								<div style={{
									position: "absolute",
									top: "50%",
									left: "0",
									right: "0",
									height: "6px",
									background: "#212529",
									transform: "translateY(-50%)"
								}} />
								
								{/* 中央のボタン */}
								<div style={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									width: "30px",
									height: "30px",
									background: "linear-gradient(145deg, #ffffff, #e9ecef)",
									borderRadius: "50%",
									border: "4px solid #212529",
									boxShadow: "0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.8)"
								}} />
							</div>
						</div>

						{/* 下部のボタン群 */}
						<div style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "15px",
							marginBottom: "20px"
						}}>
							{/* 青いボタン */}
							<div style={{
								width: "50px",
								height: "20px",
								background: "linear-gradient(145deg, #007bff, #0056b3)",
								borderRadius: "10px",
								border: "2px solid #212529",
								boxShadow: "0 4px 8px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)"
							}} />
							
							{/* 黒い丸ボタン */}
							<div style={{
								width: "25px",
								height: "25px",
								background: "linear-gradient(145deg, #343a40, #212529)",
								borderRadius: "50%",
								border: "2px solid #495057",
								boxShadow: "0 4px 8px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.1)"
							}} />
						</div>

						{/* 開くボタン */}
						<div style={{
							background: "linear-gradient(45deg, #28a745, #20c997)",
							color: "white",
							padding: "12px 25px",
							borderRadius: "20px",
							fontSize: "16px",
							fontWeight: "bold",
							boxShadow: "0 6px 12px rgba(40, 167, 69, 0.3)",
							transition: "all 0.3s ease",
							cursor: "pointer",
							border: "2px solid rgba(255,255,255,0.2)"
						}}
						onMouseEnter={(e) => {
							e.target.style.transform = "scale(1.1)";
							e.target.style.boxShadow = "0 8px 16px rgba(40, 167, 69, 0.4)";
						}}
						onMouseLeave={(e) => {
							e.target.style.transform = "scale(1)";
							e.target.style.boxShadow = "0 6px 12px rgba(40, 167, 69, 0.3)";
						}}>
							OPEN
						</div>
					</div>
				</div>
			) : (
				/* 開いた状態のポケモン図鑑 */
				<div style={{
					width: "100%",
					maxWidth: "800px",
					background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
					borderRadius: "20px",
					boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
					border: "4px solid #2c3e50",
					overflow: "hidden",
					animation: "slideIn 0.5s ease-out"
				}}>
					{/* ヘッダー */}
					<div style={{
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
						padding: "20px",
						textAlign: "center",
						color: "white",
						position: "relative"
					}}>
						<button
							onClick={handleClose}
							style={{
								position: "absolute",
								top: "15px",
								right: "20px",
								background: "rgba(255,255,255,0.2)",
								border: "none",
								color: "white",
								padding: "8px 12px",
								borderRadius: "20px",
								cursor: "pointer",
								fontSize: "14px",
								fontWeight: "bold",
								backdropFilter: "blur(10px)",
								transition: "all 0.3s ease"
							}}
							onMouseEnter={(e) => {
								e.target.style.background = "rgba(255,255,255,0.3)";
							}}
							onMouseLeave={(e) => {
								e.target.style.background = "rgba(255,255,255,0.2)";
							}}
						>
							✕ 閉じる
						</button>
						
						<h1 style={{
							fontSize: "2.5rem",
							margin: "0",
							textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
							fontWeight: "bold"
						}}>
							📖 ポケモン図鑑
						</h1>
						<p style={{
							fontSize: "1.1rem",
							margin: "10px 0 0 0",
							opacity: 0.9
						}}>
							日本語名でポケモンを検索
						</p>
					</div>

					{/* コンテンツエリア */}
					<div style={{ padding: "30px" }}>
						{/* 検索フォーム */}
						<div style={{
							display: "flex",
							justifyContent: "center",
							marginBottom: "30px"
						}}>
							<form onSubmit={handleSearch} style={{
								display: "flex",
								gap: "10px",
								alignItems: "center",
								background: "rgba(255,255,255,0.95)",
								padding: "15px 20px",
								borderRadius: "25px",
								boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
								backdropFilter: "blur(10px)",
								border: "2px solid #e9ecef"
							}}>
				<input
					type="text"
					value={inputNameJa}
					onChange={(e) => setInputNameJa(e.target.value)}
					placeholder="例：ピカチュウ、フシギダネ"
					aria-label="ポケモン名（日本語）"
									style={{
										padding: "12px 16px",
										width: "280px",
										border: "none",
										borderRadius: "20px",
										fontSize: "16px",
										outline: "none",
										background: "transparent"
									}}
								/>
								<button 
									type="submit" 
									disabled={isLoading}
									style={{
										padding: "12px 24px",
										background: isLoading ? "#ccc" : "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
										color: "white",
										border: "none",
										borderRadius: "20px",
										fontSize: "16px",
										fontWeight: "bold",
										cursor: isLoading ? "not-allowed" : "pointer",
										boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
										transition: "all 0.3s ease"
									}}
								>
									{isLoading ? "検索中..." : "🔍 検索"}
				</button>
			</form>
						</div>

						{/* エラーメッセージ */}
						{errorMessage && (
							<div style={{
								textAlign: "center",
								color: "#ff4757",
								background: "rgba(255,255,255,0.9)",
								padding: "15px",
								borderRadius: "10px",
								margin: "0 auto 20px auto",
								maxWidth: "500px",
								fontWeight: "bold",
								border: "2px solid #ff4757"
							}}>
								{errorMessage}
							</div>
						)}

						{/* ポケモンカード */}
			{result && (
							<div style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "20px"
							}}>
								<div style={{
									background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
									borderRadius: "20px",
									padding: "30px",
									boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
									maxWidth: "500px",
									width: "100%",
									border: "3px solid #ddd",
									position: "relative",
									overflow: "hidden"
								}}>
									{/* 図鑑番号 */}
									<div style={{
										position: "absolute",
										top: "15px",
										right: "20px",
										background: "linear-gradient(45deg, #667eea, #764ba2)",
										color: "white",
										padding: "8px 15px",
										borderRadius: "15px",
										fontSize: "14px",
										fontWeight: "bold",
										boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
									}}>
										#{String(result.id).padStart(3, '0')}
									</div>

									{/* ポケモン名 */}
									<h2 style={{
										fontSize: "2rem",
										margin: "0 0 20px 0",
										color: "#333",
										textAlign: "center",
										fontWeight: "bold",
										textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
									}}>
										{result.nameJa}
									</h2>

									{/* ポケモン画像 */}
					{result.imageUrl && (
										<div style={{
											textAlign: "center",
											margin: "20px 0",
											background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(240,240,240,0.5) 100%)",
											borderRadius: "15px",
											padding: "20px"
										}}>
											<img 
												src={result.imageUrl} 
												alt={`${result.nameJa}の画像`} 
												style={{
													width: "200px",
													height: "200px",
													objectFit: "contain",
													filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))"
												}}
											/>
						</div>
					)}

									{/* タイプ */}
									<div style={{ margin: "20px 0", textAlign: "center" }}>
										<div style={{
											fontSize: "16px",
											fontWeight: "bold",
											marginBottom: "10px",
											color: "#555"
										}}>
											タイプ
										</div>
										<div>
											{result.typesJa.map((type, index) => (
												<span key={index} style={getTypeBadgeStyle(type)}>
													{type}
												</span>
											))}
										</div>
									</div>

									{/* 説明文 */}
									<div style={{
										background: "rgba(240,240,240,0.7)",
										padding: "15px",
										borderRadius: "10px",
										margin: "20px 0",
										borderLeft: "4px solid #667eea"
									}}>
										<div style={{
											fontSize: "14px",
											fontWeight: "bold",
											marginBottom: "8px",
											color: "#555"
										}}>
											説明
										</div>
										<div style={{
											fontSize: "15px",
											lineHeight: "1.5",
											color: "#333"
										}}>
											{result.headline}
					</div>
					</div>

									{/* 鳴き声 */}
					{result.cryUrl ? (
										<div style={{
											textAlign: "center",
											marginTop: "20px",
											padding: "15px",
											background: "rgba(240,240,240,0.7)",
											borderRadius: "10px"
										}}>
											<div style={{
												fontSize: "14px",
												fontWeight: "bold",
												marginBottom: "10px",
												color: "#555"
											}}>
												🔊 鳴き声
											</div>
											<audio 
												controls 
												src={result.cryUrl}
												style={{
													width: "100%",
													maxWidth: "300px"
												}}
											>
									お使いのブラウザは audio タグに対応していません。
								</audio>
						</div>
					) : (
										<div style={{
											textAlign: "center",
											marginTop: "20px",
											color: "#999",
											fontSize: "14px"
										}}>
							鳴き声のデータが見つかりませんでした。
						</div>
					)}
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* CSS アニメーション */}
			<style>
				{`
					@keyframes slideIn {
						from {
							opacity: 0;
							transform: scale(0.8) translateY(50px);
						}
						to {
							opacity: 1;
							transform: scale(1) translateY(0);
						}
					}
				`}
			</style>
		</div>
	);
}


