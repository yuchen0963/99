/* style.css */

/* 基礎樣式重置 */
body {
    margin: 0;
    overflow: hidden; /* 防止滾動條 */
    background-color: #333; /* 頁面背景色 */
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    min-height: 100vh; /* 確保內容至少佔據視窗高度 */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #fff;
}

/* 遊戲容器 */
#game-container {
    position: relative;
    width: 800px; /* 遊戲畫布寬度 */
    height: 600px; /* 遊戲畫布高度 */
    overflow: hidden; /* 隱藏超出容器的內容 */
    border: 3px solid #000; /* 遊戲邊框 */
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.7); /* 輕微發光效果 */
    background-color: #555; /* 遊戲背景色，會被 Canvas 內容覆蓋 */
}

/* 遊戲 Canvas */
#game-canvas {
    display: block; /* 移除 Canvas 底部可能出現的空白 */
    background-color: transparent; /* Canvas 默認為透明，讓其下方的 #game-container 背景可見 */
}

/* HUD (抬頭顯示器) */
#hud {
    position: absolute;
    top: 15px;
    left: 15px;
    color: #FFF;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* 文字陰影 */
    z-index: 10; /* 確保在 Canvas 上方 */
}

#hud span {
    color: #00FF00; /* 分數和生命值的顏色 */
    font-weight: bold;
}

/* 遊戲結束/開始畫面 (隱藏，直到遊戲邏輯控制顯示) */
.game-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 3em;
    text-align: center;
    z-index: 20;
    opacity: 0; /* 默認隱藏 */
    visibility: hidden;
    transition: opacity 0.5s ease;
}

.game-overlay.active {
    opacity: 1;
    visibility: visible;
}

.game-overlay h2 {
    margin-bottom: 20px;
    color: #FFD700;
}

.game-overlay p {
    font-size: 0.6em;
    margin-bottom: 30px;
}

.game-button {
    background-color: #4CAF50; /* 綠色 */
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2em;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.game-button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
}

.game-button:active {
    transform: translateY(0);
}
