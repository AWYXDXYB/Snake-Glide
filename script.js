// 游戏配置
const config = {
    gridSize: 20,
    speedLevels: {
        easy: { initialSpeed: 200, speedIncrement: 3, maxSpeed: 80 },
        normal: { initialSpeed: 150, speedIncrement: 5, maxSpeed: 50 },
        hard: { initialSpeed: 100, speedIncrement: 7, maxSpeed: 30 },
        expert: { initialSpeed: 70, speedIncrement: 10, maxSpeed: 20 }
    }
};

// 游戏状态
let gameState = {
    snake: [],
    food: null,
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    level: 1,
    highScore: localStorage.getItem('snakeHighScore') || 0,
    isPlaying: false,
    isPaused: false,
    gameLoop: null,
    difficulty: 'normal',
    currentSpeed: config.speedLevels.normal.initialSpeed,
    canvas: null,
    ctx: null,
    soundEnabled: localStorage.getItem('snakeSoundEnabled') === 'false' ? false : true,
    gridVisible: localStorage.getItem('snakeGridVisible') === 'false' ? false : true,
    theme: localStorage.getItem('snakeTheme') || 'default'
};

// 初始化游戏
function initGame() {
    // 获取DOM元素
    gameState.canvas = document.getElementById('gameCanvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    
    // 设置canvas响应式大小
    resizeCanvas();
    
    // 更新最高分显示
    document.getElementById('highScore').textContent = gameState.highScore;
    
    // 按钮事件监听
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // 难度选择
    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        difficultySelect.value = gameState.difficulty;
        difficultySelect.addEventListener('change', changeDifficulty);
    }
    
    // 主题选择
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.value = gameState.theme;
        themeSelect.addEventListener('change', changeTheme);
    }
    applyTheme();
    
    // 网格显示开关
    const gridToggle = document.getElementById('showGrid');
    if (gridToggle) {
        gridToggle.checked = gameState.gridVisible;
        gridToggle.addEventListener('change', toggleGrid);
    }
    
    // 音效按钮
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
        // 更新按钮文本以反映当前状态
        updateSoundButtonText(soundBtn);
        // 添加点击事件监听器
        soundBtn.addEventListener('click', toggleSoundButton);
    }
    
    // 键盘控制
    document.addEventListener('keydown', handleKeyPress);
    
    // 移动端控制
    initMobileControls();
    
    // 游戏结束模态框
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            const gameOverModal = document.getElementById('gameOverModal');
            if (gameOverModal) {
                gameOverModal.classList.remove('active');
            }
            startGame();
        });
    }
    
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const gameOverModal = document.getElementById('gameOverModal');
            if (gameOverModal) {
                gameOverModal.classList.remove('active');
            }
        });
    }
    
    // 窗口大小变化
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化界面
    drawInitialScreen();
}

// 调整canvas大小
function resizeCanvas() {
    const containerWidth = document.querySelector('.game-container').offsetWidth;
    const size = Math.min(containerWidth, 400);
    gameState.canvas.width = size;
    gameState.canvas.height = size;
}

// 改变难度
function changeDifficulty(e) {
    gameState.difficulty = e.target.value;
    gameState.currentSpeed = config.speedLevels[gameState.difficulty].initialSpeed;
    
    if (gameState.isPlaying && !gameState.isPaused) {
        clearInterval(gameState.gameLoop);
        gameState.gameLoop = setInterval(gameUpdate, gameState.currentSpeed);
    }
}

// 切换主题
function changeTheme(e) {
    gameState.theme = e.target.value;
    localStorage.setItem('snakeTheme', gameState.theme);
    applyTheme();
    
    if (gameState.isPlaying) {
        drawGame();
    } else {
        drawInitialScreen();
    }
}

// 应用主题
function applyTheme() {
    document.body.className = '';
    if (gameState.theme !== 'default') {
        document.body.classList.add(`theme-${gameState.theme}`);
    }
}

// 切换网格显示
function toggleGrid(e) {
    gameState.gridVisible = e.target.checked;
    localStorage.setItem('snakeGridVisible', gameState.gridVisible);
    
    if (gameState.isPlaying) {
        drawGame();
    }
}

// 切换音效
function toggleSoundButton() {
    // 切换音效状态
    gameState.soundEnabled = !gameState.soundEnabled;
    localStorage.setItem('snakeSoundEnabled', gameState.soundEnabled);
    
    // 更新按钮文本
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
        updateSoundButtonText(soundBtn);
    }
}

// 更新音效按钮文本
function updateSoundButtonText(button) {
    if (gameState.soundEnabled) {
        button.textContent = '🔊 音效';
    } else {
        button.textContent = '🔇 静音';
    }
}

// 播放音效
function playSound(type) {
    if (!gameState.soundEnabled) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        switch (type) {
            case 'eat':
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.3);
                break;
            case 'collision':
                oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.5);
                break;
            case 'levelUp':
                oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
                oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.4);
                break;
        }
    }
}

// 初始化移动端控制
function initMobileControls() {
    // 为每个控制按钮添加存在性检查
    const upBtn = document.getElementById('upBtn');
    if (upBtn) {
        upBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState.direction !== 'down') {
                gameState.nextDirection = 'up';
            }
        });
    }
    
    const downBtn = document.getElementById('downBtn');
    if (downBtn) {
        downBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState.direction !== 'up') {
                gameState.nextDirection = 'down';
            }
        });
    }
    
    const leftBtn = document.getElementById('leftBtn');
    if (leftBtn) {
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState.direction !== 'right') {
                gameState.nextDirection = 'left';
            }
        });
    }
    
    const rightBtn = document.getElementById('rightBtn');
    if (rightBtn) {
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState.direction !== 'left') {
                gameState.nextDirection = 'right';
            }
        });
    }
    
    const mobilePauseBtn = document.getElementById('mobilePauseBtn');
    if (mobilePauseBtn) {
        mobilePauseBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState.isPlaying) {
                togglePause();
            }
        });
    }
}

// 初始化游戏画面
function drawInitialScreen() {
    const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-game').trim() || '#2c3e50';
    gameState.ctx.fillStyle = bgColor;
    gameState.ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    
    // 绘制网格
    if (gameState.gridVisible) {
        drawGrid();
    }
    
    // 绘制初始提示
    gameState.ctx.fillStyle = 'white';
    gameState.ctx.font = '20px Microsoft YaHei';
    gameState.ctx.textAlign = 'center';
    gameState.ctx.fillText('点击开始按钮开始游戏', gameState.canvas.width / 2, gameState.canvas.height / 2);
    
    // 绘制操作说明
    gameState.ctx.font = '14px Microsoft YaHei';
    gameState.ctx.fillText('使用方向键或虚拟按钮控制', gameState.canvas.width / 2, gameState.canvas.height / 2 + 40);
}

// 绘制网格
function drawGrid() {
    const cellSize = gameState.canvas.width / config.gridSize;
    const gridColor = getComputedStyle(document.body).getPropertyValue('--grid-color').trim() || 'rgba(255, 255, 255, 0.1)';
    gameState.ctx.strokeStyle = gridColor;
    gameState.ctx.lineWidth = 1;
    
    // 绘制水平线
    for (let i = 0; i <= config.gridSize; i++) {
        gameState.ctx.beginPath();
        gameState.ctx.moveTo(0, i * cellSize);
        gameState.ctx.lineTo(gameState.canvas.width, i * cellSize);
        gameState.ctx.stroke();
    }
    
    // 绘制垂直线
    for (let i = 0; i <= config.gridSize; i++) {
        gameState.ctx.beginPath();
        gameState.ctx.moveTo(i * cellSize, 0);
        gameState.ctx.lineTo(i * cellSize, gameState.canvas.height);
        gameState.ctx.stroke();
    }
}

// 初始化蛇
function initSnake() {
    const center = Math.floor(config.gridSize / 2);
    gameState.snake = [
        { x: center, y: center },
        { x: center - 1, y: center },
        { x: center - 2, y: center }
    ];
    gameState.direction = 'right';
    gameState.nextDirection = 'right';
    gameState.level = 1;
}

// 生成食物
function generateFood() {
    let x, y;
    let isOnSnake;
    
    do {
        isOnSnake = false;
        x = Math.floor(Math.random() * config.gridSize);
        y = Math.floor(Math.random() * config.gridSize);
        
        // 检查食物是否在蛇身上
        for (const segment of gameState.snake) {
            if (segment.x === x && segment.y === y) {
                isOnSnake = true;
                break;
            }
        }
    } while (isOnSnake);
    
    gameState.food = { x, y };
}

// 移动蛇
function moveSnake() {
    const head = { ...gameState.snake[0] };
    gameState.direction = gameState.nextDirection;
    
    // 根据方向移动头部
    switch (gameState.direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 将新头部添加到蛇身
    gameState.snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        // 播放音效
        playSound('eat');
        
        // 吃到食物，增加分数
        gameState.score += 10 * gameState.level;
        document.getElementById('score').textContent = gameState.score;
        
        // 检查升级
        const newLevel = Math.floor(gameState.score / 100) + 1;
        if (newLevel > gameState.level) {
            gameState.level = newLevel;
            document.getElementById('level').textContent = gameState.level;
            playSound('levelUp');
        }
        
        // 更新最高分
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            document.getElementById('highScore').textContent = gameState.highScore;
            localStorage.setItem('snakeHighScore', gameState.highScore);
        }
        
        // 生成新食物
        generateFood();
        
        // 增加速度
        const speedConfig = config.speedLevels[gameState.difficulty];
        const targetSpeed = Math.max(
            speedConfig.maxSpeed,
            speedConfig.initialSpeed - (gameState.level - 1) * speedConfig.speedIncrement
        );
        
        if (gameState.currentSpeed > targetSpeed) {
            gameState.currentSpeed = targetSpeed;
            // 重新设置游戏循环以应用新速度
            clearInterval(gameState.gameLoop);
            gameState.gameLoop = setInterval(gameUpdate, gameState.currentSpeed);
        }
    } else {
        // 没吃到食物，移除尾部
        gameState.snake.pop();
    }
}

// 检查碰撞
function checkCollision() {
    const head = gameState.snake[0];
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= config.gridSize || 
        head.y < 0 || head.y >= config.gridSize) {
        return true;
    }
    
    // 检查是否撞到自己
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 绘制游戏
function drawGame() {
    const cellSize = gameState.canvas.width / config.gridSize;
    const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-game').trim() || '#2c3e50';
    
    // 清空画布
    gameState.ctx.fillStyle = bgColor;
    gameState.ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    
    // 绘制网格
    if (gameState.gridVisible) {
        drawGrid();
    }
    
    // 绘制食物
    const foodColor = getComputedStyle(document.body).getPropertyValue('--food-color').trim() || '#e74c3c';
    gameState.ctx.fillStyle = foodColor;
    
    // 食物闪烁动画
    const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 1;
    const radius = (cellSize / 3) * pulse;
    
    gameState.ctx.beginPath();
    gameState.ctx.arc(
        gameState.food.x * cellSize + cellSize / 2,
        gameState.food.y * cellSize + cellSize / 2,
        radius,
        0,
        Math.PI * 2
    );
    gameState.ctx.fill();
    
    // 绘制食物高光
    gameState.ctx.fillStyle = 'white';
    gameState.ctx.beginPath();
    gameState.ctx.arc(
        gameState.food.x * cellSize + cellSize / 3,
        gameState.food.y * cellSize + cellSize / 3,
        radius / 4,
        0,
        Math.PI * 2
    );
    gameState.ctx.fill();
    
    // 绘制蛇
    const headColor = getComputedStyle(document.body).getPropertyValue('--snake-head').trim() || '#2ecc71';
    const bodyColor1 = getComputedStyle(document.body).getPropertyValue('--snake-body1').trim() || '#27ae60';
    const bodyColor2 = getComputedStyle(document.body).getPropertyValue('--snake-body2').trim() || '#2ecc71';
    
    for (let i = 0; i < gameState.snake.length; i++) {
        const segment = gameState.snake[i];
        
        if (i === 0) {
            // 绘制蛇头
            gameState.ctx.fillStyle = headColor;
            gameState.ctx.fillRect(
                segment.x * cellSize + 1,
                segment.y * cellSize + 1,
                cellSize - 2,
                cellSize - 2
            );
            
            // 绘制眼睛
            gameState.ctx.fillStyle = 'white';
            const eyeSize = cellSize / 8;
            
            switch (gameState.direction) {
                case 'up':
                    gameState.ctx.beginPath();
                    gameState.ctx.arc(
                        segment.x * cellSize + cellSize / 3,
                        segment.y * cellSize + cellSize / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.arc(
                        segment.x * cellSize + (cellSize * 2) / 3,
                        segment.y * cellSize + cellSize / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.fill();
                    break;
                case 'down':
                    gameState.ctx.beginPath();
                    gameState.ctx.arc(
                        segment.x * cellSize + cellSize / 3,
                        segment.y * cellSize + (cellSize * 2) / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.arc(
                        segment.x * cellSize + (cellSize * 2) / 3,
                        segment.y * cellSize + (cellSize * 2) / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.fill();
                    break;
                case 'left':
                    gameState.ctx.beginPath();
                    gameState.ctx.arc(
                        segment.x * cellSize + cellSize / 3,
                        segment.y * cellSize + cellSize / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.arc(
                        segment.x * cellSize + cellSize / 3,
                        segment.y * cellSize + (cellSize * 2) / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.fill();
                    break;
                case 'right':
                    gameState.ctx.beginPath();
                    gameState.ctx.arc(
                        segment.x * cellSize + (cellSize * 2) / 3,
                        segment.y * cellSize + cellSize / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.arc(
                        segment.x * cellSize + (cellSize * 2) / 3,
                        segment.y * cellSize + (cellSize * 2) / 3,
                        eyeSize,
                        0,
                        Math.PI * 2
                    );
                    gameState.ctx.fill();
                    break;
            }
        } else {
            // 绘制蛇身
            // 交替颜色使蛇身有条纹效果
            const color = i % 2 === 0 ? bodyColor1 : bodyColor2;
            gameState.ctx.fillStyle = color;
            gameState.ctx.fillRect(
                segment.x * cellSize + 1,
                segment.y * cellSize + 1,
                cellSize - 2,
                cellSize - 2
            );
        }
    }
    
    // 如果暂停，显示暂停文本
    if (gameState.isPaused) {
        gameState.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        gameState.ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
        gameState.ctx.fillStyle = 'white';
        gameState.ctx.font = '30px Microsoft YaHei';
        gameState.ctx.textAlign = 'center';
        gameState.ctx.fillText('游戏暂停', gameState.canvas.width / 2, gameState.canvas.height / 2);
    }
}

// 游戏更新循环
function gameUpdate() {
    if (!gameState.isPaused) {
        moveSnake();
        
        if (checkCollision()) {
            playSound('collision');
            gameOver();
            return;
        }
    }
    
    drawGame();
}

// 开始游戏
function startGame() {
    if (!gameState.isPlaying) {
        // 重置游戏状态
        gameState.score = 0;
        gameState.level = 1;
        gameState.currentSpeed = config.speedLevels[gameState.difficulty].initialSpeed;
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('level').textContent = gameState.level;
        
        initSnake();
        generateFood();
        
        // 开始游戏循环
        gameState.isPlaying = true;
        gameState.isPaused = false;
        gameState.gameLoop = setInterval(gameUpdate, gameState.currentSpeed);
        
        // 更新按钮状态
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
    }
}

// 暂停/恢复游戏
function togglePause() {
    if (gameState.isPlaying) {
        gameState.isPaused = !gameState.isPaused;
        document.getElementById('pauseBtn').textContent = gameState.isPaused ? '继续' : '暂停';
    }
}

// 重置游戏
function resetGame() {
    // 停止游戏循环
    clearInterval(gameState.gameLoop);
    
    // 重置游戏状态
    gameState.isPlaying = false;
    gameState.isPaused = false;
    
    // 更新按钮状态
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('pauseBtn').textContent = '暂停';
    
    // 隐藏模态框
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.classList.remove('active');
    }
    
    // 绘制初始界面
    drawInitialScreen();
}

// 游戏结束
function gameOver() {
    // 停止游戏循环
    clearInterval(gameState.gameLoop);
    gameState.isPlaying = false;
    
    // 更新按钮状态
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resetBtn').disabled = false;
    
    // 显示游戏结束模态框
    const finalScore = document.getElementById('finalScore');
    if (finalScore) {
        finalScore.textContent = gameState.score;
    }
    const finalHighScore = document.getElementById('finalHighScore');
    if (finalHighScore) {
        finalHighScore.textContent = gameState.highScore;
    }
    const finalLevel = document.getElementById('finalLevel');
    if (finalLevel) {
        finalLevel.textContent = gameState.level;
    }
    
    setTimeout(() => {
        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal) {
            gameOverModal.classList.add('active');
        }
    }, 100);
}

// 处理键盘输入
function handleKeyPress(e) {
    // 防止页面滚动
    if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
        e.preventDefault();
    }
    
    // 方向键控制
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (gameState.direction !== 'down') {
                gameState.nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (gameState.direction !== 'up') {
                gameState.nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (gameState.direction !== 'right') {
                gameState.nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (gameState.direction !== 'left') {
                gameState.nextDirection = 'right';
            }
            break;
        case ' ': // 空格键暂停/继续
            if (gameState.isPlaying) {
                togglePause();
            }
            break;
        case 'Enter': // 回车键开始/重置
            if (!gameState.isPlaying) {
                startGame();
            }
            break;
    }
}

// 为了防止iOS设备上的橡皮筋效果影响游戏体验
document.addEventListener('touchmove', function(e) {
    if (e.target === gameState.canvas || 
        e.target.closest('.mobile-controls') || 
        e.target.closest('.game-actions')) {
        e.preventDefault();
    }
}, { passive: false });

// 页面加载完成后初始化游戏
window.addEventListener('load', initGame);