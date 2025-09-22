// ReactとuseStateフックをインポート
// useStateは関数コンポーネントで状態管理を行うためのフック
import React, { useState } from 'react';

function Pokemon4() {
    // useState フックを使って状態を管理
    // [現在の値, 値を更新する関数] = useState(初期値)
    
    // 検索テキストの状態管理
    const [searchTerm, setSearchTerm] = useState('');
    
    // ポケモンデータの状態管理（初期値はnull = データなし）
    const [pokemon, setPokemon] = useState(null);
    
    // ローディング状態の管理（true = 読み込み中, false = 読み込み完了）
    const [loading, setLoading] = useState(false);
    
    // エラーメッセージの状態管理
    const [error, setError] = useState('');

    // ポケモンを検索する非同期関数
    // async = この関数は非同期処理を含むことを宣言
    const searchPokemon = async () => {
        // 入力値のバリデーション（空文字チェック）
        // trim() = 前後の空白を削除
        if (!searchTerm.trim()) {
            setError('ポケモン名を入力してください');
            return; // 処理を終了
        }

        // 検索開始時の状態リセット
        setLoading(true);        // ローディング開始
        setError('');            // エラーメッセージをクリア
        setPokemon(null);        // 前の検索結果をクリア

        // try-catch文でエラーハンドリング
        try {
            // fetch関数でAPIからデータを取得
            // await = 非同期処理の完了を待つ
            // toLowerCase() = 小文字に変換（APIは小文字で検索）
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
            
            // レスポンスが正常でない場合（404エラーなど）
            if (!response.ok) {
                throw new Error('ポケモンが見つかりません');
            }

            // レスポンスをJSON形式に変換
            const pokemonData = await response.json();
            
            // 取得したデータを状態に保存
            setPokemon(pokemonData);

        } catch (err) {
            // エラーが発生した場合の処理
            setError(err.message);
        } finally {
            // 成功・失敗に関わらず最後に実行される処理
            setLoading(false); // ローディング終了
        }
    };

    // キーボードイベントを処理する関数
    const handleKeyPress = (e) => {
        // Enterキーが押された場合
        if (e.key === 'Enter') {
            searchPokemon(); // 検索を実行
        }
    };

    // JSXを返す（コンポーネントの見た目を定義）
    // JSX = JavaScriptの中にHTMLのような記法を書ける構文
    return (
        <div>
            <h1>ポケモン検索</h1>
            
            {/* 検索フォーム */}
            <div>
                {/* 制御されたコンポーネント（Controlled Component） */}
                <input
                    type="text"
                    value={searchTerm}  {/* valueはstateで管理 */}
                    onChange={(e) => setSearchTerm(e.target.value)}  {/* 入力値が変わったらstateを更新 */}
                    onKeyPress={handleKeyPress}  {/* キーが押されたときのイベント */}
                    placeholder="ポケモン名を英語で入力 (例: pikachu)"
                />
                <button 
                    onClick={searchPokemon}  {/* クリック時に検索実行 */}
                    disabled={loading}       {/* ローディング中はボタンを無効化 */}
                >
                    {/* 三項演算子による条件分岐レンダリング */}
                    {loading ? '検索中...' : '検索'}
                </button>
            </div>

            {/* 条件付きレンダリング: エラーがある場合のみ表示 */}
            {/* && 演算子 = 左側がtrueの場合のみ右側を実行 */}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {/* 条件付きレンダリング: ポケモンデータがある場合のみ表示 */}
            {pokemon && (
                <div>
                    {/* JSX内でJavaScriptの変数を表示するには {} を使用 */}
                    <h2>{pokemon.name} (#{pokemon.id})</h2>
                    
                    {/* 画像の表示 */}
                    <img 
                        src={pokemon.sprites.front_default}  {/* APIから取得した画像URL */}
                        alt={pokemon.name}
                        width="150"
                        height="150"
                    />
                    
                    <h3>基本情報</h3>
                    <ul>
                        {/* APIのデータを加工して表示 */}
                        {/* toFixed(1) = 小数点第1位まで表示 */}
                        <li>身長: {(pokemon.height / 10).toFixed(1)} m</li>
                        <li>体重: {(pokemon.weight / 10).toFixed(1)} kg</li>
                        <li>基礎経験値: {pokemon.base_experience}</li>
                    </ul>

                    <h3>タイプ</h3>
                    <ul>
                        {/* 配列をmap関数でリストに変換 */}
                        {/* map = 配列の各要素に対して処理を行い、新しい配列を作成 */}
                        {pokemon.types.map((type, index) => (
                            // key属性は必須（Reactが効率的に再レンダリングするため）
                            <li key={index}>{type.type.name}</li>
                        ))}
                    </ul>

                    <h3>特性</h3>
                    <ul>
                        {/* ネストした配列のレンダリング */}
                        {pokemon.abilities.map((ability, index) => (
                            <li key={index}>
                                {ability.ability.name}
                                {/* 条件付きレンダリング: 隠れ特性の場合のみ表示 */}
                                {ability.is_hidden && ' (隠れ特性)'}
                            </li>
                        ))}
                    </ul>

                    <h3>ステータス</h3>
                    <ul>
                        {/* オブジェクトの配列をレンダリング */}
                        {pokemon.stats.map((stat, index) => (
                            <li key={index}>
                                {stat.stat.name}: {stat.base_stat}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// コンポーネントをエクスポート（他のファイルから使用可能にする）

export default Pokemon4;
