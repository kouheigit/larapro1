import { useEffect, useMemo, useState } from "react";

export default function Pokemon3() {
	const [inputNameJa, setInputNameJa] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [result, setResult] = useState(null);

	// 日本語→英語スラッグを引くために、全ポケモン種一覧をキャッシュ
	const [speciesIndex, setSpeciesIndex] = useState([]);
	const hasSpeciesIndex = useMemo(() => speciesIndex && speciesIndex.length > 0, [speciesIndex]);

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
		<div style={{ padding: 16 }}>
			<h2>ポケモン検索（日本語名）</h2>
			<form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
				<input
					type="text"
					value={inputNameJa}
					onChange={(e) => setInputNameJa(e.target.value)}
					placeholder="例：ピカチュウ、フシギダネ"
					aria-label="ポケモン名（日本語）"
					style={{ padding: 8, width: 260 }}
				/>
				<button type="submit" style={{ marginLeft: 8, padding: "8px 12px" }} disabled={isLoading}>
					検索
				</button>
			</form>

			{isLoading && <div>検索中...</div>}
			{errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

			{result && (
				<div style={{ marginTop: 16 }}>
					<h3>
						{result.nameJa}（図鑑番号: {result.id}）
					</h3>
					{result.imageUrl && (
						<div style={{ margin: "12px 0" }}>
							<img src={result.imageUrl} alt={`${result.nameJa}の画像`} width={240} height={240} />
						</div>
					)}
					<div style={{ margin: "8px 0" }}>
						<strong>タイプ:</strong> {result.typesJa.join(" / ")}
					</div>
					<div style={{ margin: "8px 0" }}>
						<strong>説明:</strong> {result.headline}
					</div>
					{result.cryUrl ? (
						<div style={{ marginTop: 12 }}>
							<strong>鳴き声:</strong>
							<div>
								<audio controls src={result.cryUrl}>
									お使いのブラウザは audio タグに対応していません。
								</audio>
							</div>
						</div>
					) : (
						<div style={{ marginTop: 12 }}>
							鳴き声のデータが見つかりませんでした。
						</div>
					)}
				</div>
			)}
		</div>
	);
}


