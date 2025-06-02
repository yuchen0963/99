// game.js

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

// 遊戲狀態
let score = 0;
let lives = 3;
let gameOver = false;
let gameStarted = false; // 新增遊戲開始狀態

let player = {}; // 玩家物件，在 resetGame 中初始化
let enemies = [];
let playerBullets = [];
let enemyBullets = [];

// 圖片資源 (需要您自己準備)
const playerImg = new Image();
playerImg.src = 'assets/images/player.png';
const enemyImg = new Image();
enemyImg.src = 'assets/images/enemy.png';
const playerBulletImg = new Image();
playerBulletImg.src = 'assets/images/player_bullet.png';
const enemyBulletImg = new Image();
enemyBulletImg.src = 'assets/images/enemy_bullet.png';
const backgroundImg = new Image(); // 新增背景圖片
backgroundImg.src = 'assets/images/background.png';

// 背景捲軸變量
let backgroundY1 = 0;
let backgroundY2 = -GAME_HEIGHT;
const backgroundSpeed = 0.5; // 背景捲軸速度

// 玩家射擊間隔
let lastShotTime = 0;
const shotDelay = 200; // 射擊間隔，毫秒

// 敵機生成變量
let lastEnemySpawnTime = 0;
let enemySpawnDelay = 1000; // 初始每秒生成一個敵人

// --- 遊戲邏輯函數 ---

function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    gameStarted = true;

    player = {
        x: GAME_WIDTH / 2 - 25,
        y: GAME_HEIGHT - 70,
        width: 50,
        height: 50,
        speed: 5
    };
    playerBullets = [];
    enemies = [];
    enemyBullets = [];

    backgroundY1 = 0;
    backgroundY2 = -GAME_HEIGHT;

    lastShotTime = 0;
    lastEnemySpawnTime = 0;
    enemySpawnDelay = 1000; // 重置敵機生成速度

    updateHUD();
    gameOverScreen.classList.remove('active'); // 隱藏遊戲結束畫面
    startScreen.classList.remove('active'); // 隱藏開始畫面
    gameLoop(); // 重新開始遊戲迴圈
}


function updateHUD() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
}

// 玩家移動輸入處理
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function handlePlayerMovement() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < GAME_WIDTH - player.width) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < GAME_HEIGHT - player.height) {
        player.y += player.speed;
    }
}

// 玩家射擊
function playerShoot() {
    const currentTime = Date.now();
    if (keys[' '] && currentTime - lastShotTime > shotDelay) { // 空格鍵射擊
        playerBullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            speed: 7
        });
        lastShotTime = currentTime;
        // 播放射擊音效 (需要您自己加入 audio.play())
    }
}

// 敵機生成
function spawnEnemy() {
    const currentTime = Date.now();
    if (currentTime - lastEnemySpawnTime > enemySpawnDelay) {
        enemies.push({
            x: Math.random() * (GAME_WIDTH - 50),
            y: -50, // 從上方進入
            width: 50,
            height: 50,
            speed: 1 + Math.random() * 2, // 敵人速度
            lives: 1 // 敵人生命值
        });
        lastEnemySpawnTime = currentTime;
    }
}

// 敵機射擊 (簡化)
function enemyShoot(enemy) {
    if (Math.random() < 0.008) { // 隨機射擊機率
        enemyBullets.push({
            x: enemy.x + enemy.width / 2 - 3,
            y: enemy.y + enemy.height,
            width: 6,
            height: 12,
            speed: 3
        });
    }
}

// 物體更新
function update() {
    if (gameOver || !gameStarted) return; // 如果遊戲結束或未開始，則不更新

    handlePlayerMovement();
    playerShoot();
    spawnEnemy();

    // 更新背景捲軸
    backgroundY1 += backgroundSpeed;
    backgroundY2 += backgroundSpeed;
    if (backgroundY1 >= GAME_HEIGHT) {
        backgroundY1 = -GAME_HEIGHT + backgroundY2 - GAME_HEIGHT; // 調整使其緊密銜接
        backgroundY1 = backgroundY2 - GAME_HEIGHT;
    }
    if (backgroundY2 >= GAME_HEIGHT) {
        backgroundY2 = backgroundY1 - GAME_HEIGHT;
    }


    // 更新玩家子彈位置
    playerBullets = playerBullets.filter(bullet => {
        bullet.y -= bullet.speed;
        return bullet.y > 0; // 移除螢幕外的子彈
    });

    // 更新敵機位置和敵機射擊
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
        enemyShoot(enemy);
    });
    // 移除螢幕外的敵人
    enemies = enemies.filter(enemy => enemy.y < GAME_HEIGHT + enemy.height);

    // 更新敵機子彈位置
    enemyBullets.forEach(bullet => {
        bullet.y += bullet.speed;
    });
    // 移除螢幕外的敵機子彈
    enemyBullets = enemyBullets.filter(bullet => bullet.y < GAME_HEIGHT + bullet.height);


    // 碰撞檢測 (非常簡化的矩形碰撞)

    // 玩家子彈與敵人
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const pBullet = playerBullets[i];
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (pBullet.x < enemy.x + enemy.width &&
                pBullet.x + pBullet.width > enemy.x &&
                pBullet.y < enemy.y + enemy.height &&
                pBullet.y + pBullet.height > enemy.y) {
                // 碰撞發生
                playerBullets.splice(i, 1); // 移除子彈
                enemy.lives--;
                if (enemy.lives <= 0) {
                    enemies.splice(j, 1); // 移除敵人
                    score += 100;
                    updateHUD();
                    // 播放爆炸音效 (需要您自己加入 audio.play())
                }
                break; // 子彈擊中一個敵人後就消失
            }
        }
    }

    // 玩家與敵人 (碰撞直接扣生命)
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            // 玩家被撞
            enemies.splice(i, 1); // 移除敵人
            lives--;
            updateHUD();
            if (lives <= 0) {
                endGame();
            }
        }
    }

    // 玩家與敵機子彈
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eBullet = enemyBullets[i];
        if (player.x < eBullet.x + eBullet.width &&
            player.x + player.width > eBullet.x &&
            player.y < eBullet.y + eBullet.height &&
            player.y + player.height > eBullet.y) {
            // 玩家被擊中
            enemyBullets.splice(i, 1); // 移除子彈
            lives--;
            updateHUD();
            if (lives <= 0) {
                endGame();
            }
        }
    }
}

// 繪製所有物體
function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // 清空畫布

    // 繪製背景 (捲軸)
    if (backgroundImg.complete && backgroundImg.naturalWidth !== 0) {
        ctx.drawImage(backgroundImg, 0, backgroundY1, GAME_WIDTH, GAME_HEIGHT);
        ctx.drawImage(backgroundImg, 0, backgroundY2, GAME_WIDTH, GAME_HEIGHT);
    } else {
        ctx.fillStyle = '#ADD8E6'; // 天空藍
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }


    // 繪製玩家
    if (playerImg.complete && playerImg.naturalWidth !== 0) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // 繪製玩家子彈
    playerBullets.forEach(bullet => {
        if (playerBulletImg.complete && playerBulletImg.naturalWidth !== 0) {
            ctx.drawImage(playerBulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
        } else {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    });

    // 繪製敵人
    enemies.forEach(enemy => {
        if (enemyImg.complete && enemyImg.naturalWidth !== 0) {
            ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });

    // 繪製敵機子彈
    enemyBullets.forEach(bullet => {
        if (enemyBulletImg.complete && enemyBulletImg.naturalWidth !== 0) {
             ctx.drawImage(enemyBulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
        } else {
            ctx.fillStyle = 'orange';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    });
}

// 遊戲結束邏輯
function endGame() {
    gameOver = true;
    gameStarted = false; // 遊戲結束，不再是 "進行中"
    finalScoreDisplay.textContent = score;
    gameOverScreen.classList.add('active'); // 顯示遊戲結束畫面
}


// 圖片載入完成的計數器
let imagesLoaded = 0;
const totalImages = 5; // 玩家、敵人、玩家子彈、敵機子彈、背景

function imageLoadHandler() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // 所有圖片載入完成後，顯示開始畫面
        startScreen.classList.add('active');
        // 不立即啟動 gameLoop，等待玩家點擊開始
    }
}

playerImg.onload = imageLoadHandler;
enemyImg.onload = imageLoadHandler;
playerBulletImg.onload = imageLoadHandler;
enemyBulletImg.onload = imageLoadHandler;
backgroundImg.onload = imageLoadHandler; // 背景圖片載入

// 錯誤處理 (如果圖片載入失敗，仍然啟動遊戲，只是顯示顏色方塊)
playerImg.onerror = enemyImg.onerror = playerBulletImg.onerror = enemyBulletImg.onerror = backgroundImg.onerror = (e) => {
    console.warn(`Image failed to load: ${e.target.src}. Using fallback color.`);
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startScreen.classList.add('active');
    }
};

// 遊戲迴圈
function gameLoop() {
    if (!gameOver && gameStarted) { // 只有在遊戲未結束且已開始時才更新和繪製
        update(); // 更新遊戲狀態
        draw();   // 繪製遊戲畫面
        requestAnimationFrame(gameLoop); // 請求下一幀動畫
    }
}

// 按鈕事件監聽
startButton.addEventListener('click', () => {
    resetGame(); // 點擊開始遊戲按鈕時，重置並啟動遊戲
});

restartButton.addEventListener('click', () => {
    resetGame(); // 點擊重新開始按鈕時，重置並啟動遊戲
});

// 初始化時不立即啟動遊戲迴圈，等待圖片載入和玩家點擊開始
// initial call to load images
// This will trigger imageLoadHandler when all images are done
// The gameLoop will be called inside resetGame() when startButton is clicked