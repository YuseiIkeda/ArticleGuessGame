import React, { useEffect, useState } from "react";
import { TextField, Button, Paper } from '@mui/material';

export default function Main() {
    const [input, setInput] = useState("");
    const [wiki, setWiki] = useState([]);
    const [challengeCount, setChallengeCount] = useState(3);
    const [randomWord, setRandomWord] = useState("");

    // 適当に集めた単語だよ
    const data = [
        "富士山", "林真理子", "虹", "北岳", "石鹸",
        "屋根", "ことわざ", "土踏まず", "線分", "意味",
        "琵琶湖", "五月病", "蛙化現象", "バナナ", "ハイドロプレーニング現象",
        "奇跡", "貧乏揺すり", "マラソン", "相槌", "記事",
        "抹茶", "クラゲ", "教授", "餃子", "公園"
    ];

    // 初回レンダリング時に記事を出力するよ
    useEffect(() => {
        getNewWord();
    }, []);

    // randomWordが変更されたら記事の内容が変わるよ
    useEffect(() => {
        if (randomWord) {
            (async () => {
                // urlにrandomWordの記事のurlを代入するよ
                const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(randomWord)}`;
                const response = await fetch(url);
                const data = await response.json();

                data.extract = replaceText(data.extract); // extract内にあるrandomWordを伏字にするよ

                setWiki(data); // 調整済みの記事が完成したよ
            })();
        }
    }, [randomWord]);

    // extract内のrandomWordを伏字に置換する関数だよ
    const replaceText = (originalText) => {
        const IndexOfTarget = originalText.indexOf("は、");
        const replacedText = "〇〇" + originalText.substring(IndexOfTarget);
        return replacedText;
    };

    // 新しい単語を取得する関数だよ
    const getNewWord = () => {
        const word = getRandomWord();
        setRandomWord(word);
    };

    // ランダムな単語を取得する関数だよ
    const getRandomWord = () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    };

    // 入力された文字列をinputに代入する関数だよ(直接書いた方が良い？)
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    // 入力した文字列を提出したときに正誤判定などを行う関数だよ
    const handleSearch = (event) => {
        event.preventDefault(); // 良く分からない魔法の呪文だよ

        setInput(""); // 入力された文字列を空にするよ

        if (input === "") {
            alert("単語を入力してください！"); // 何も入力せずに提出すると怒られるよ
        } else {
            if (input.trim() === randomWord) {
                alert("正解！ おめでとう！");
                setChallengeCount(3); // 挑戦回数をリセットするよ
                getNewWord();
            } else {
                setChallengeCount((prevCount) => prevCount - 1); // 解答を間違えると残り挑戦回数が1減るよ
                if (challengeCount === 1) {
                    alert(`残念！ 正解は「${randomWord}」でした。`);
                    setChallengeCount(3);
                    getNewWord();
                } else {
                    alert("不正解！ まだ諦めるな！");
                }
            }
        }
    };

    return (
        <main>
            <Paper elevation={8} className="paper">
                <p>{wiki.extract ? wiki.extract.split(wiki.title).join("〇〇") : "ページは見つかりませんでした"}</p>
            </Paper>
            <form onSubmit={handleSearch}>
                <TextField
                    id="textField"
                    label="単語を入力"
                    variant="outlined"
                    value={input}
                    onChange={handleInputChange}
                    size="small"
                />
                <Button
                    type="submit"
                    variant="outlined"
                    size="large"
                    style={{ padding: '6px' }}
                >
                    解答する
                </Button>
            </form>
            <p>残り挑戦回数: {challengeCount}回</p>
        </main>
    );
}
