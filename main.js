// Game state
const gameState = {
    soQuan: 0,
    ruong: 50,
    dangRen: false,
    thoiGianCon: 0,
    timerInterval: null,
    
    manhTuong: {
        Takemasa: 0,
        Ren: 0,
        Shinya: 0
    },
    
    vatPham: {
        "Giảm 1 phút": 0,
        "Giảm 5 phút": 0,
        "Giảm 10 phút": 0,
        "Giảm 30 phút": 0
    }
};

// Item drop rates
const bangVatPham = [
    { ten: "Giảm 1 phút", tyLe: 40, loai: "giamtg" },
    { ten: "Giảm 5 phút", tyLe: 30, loai: "giamtg" },
    { ten: "Giảm 10 phút", tyLe: 20, loai: "giamtg" },
    { ten: "Giảm 30 phút", tyLe: 10, loai: "giamtg" },
    { ten: "Mảnh Takemasa", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 10, loai: "manh" }
];

// Initialize game
function initGame() {
    console.log("Initializing game...");
    
    // Add event listeners to buttons
    document.getElementById('btnRen100').addEventListener('click', () => renQuan(100));
    document.getElementById('btnRen1000').addEventListener('click', () => renQuan(1000));
    document.getElementById('btnMo1').addEventListener('click', () => moRuong(1));
    document.getElementById('btnMo10').addEventListener('click', () => moRuong(10));
    
    updateUI();
    console.log("Game initialized successfully!");
}

// Update UI
function updateUI() {
    // Update basic stats
    document.getElementById('soQuan').textContent = gameState.soQuan.toLocaleString();
    document.getElementById('ruong').textContent = gameState.ruong;
    
    // Update timer
    const minutes = String(Math.floor(gameState.thoiGianCon / 60)).padStart(2, '0');
    const seconds = String(gameState.thoiGianCon % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    
    // Update manh tuong
    const manhTuongContainer = document.getElementById('manhTuong');
    manhTuongContainer.innerHTML = '';
    
    Object.entries(gameState.manhTuong).forEach(([ten, soLuong]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item manh-tuong';
        itemDiv.innerHTML = `
            <div class="item-name">${ten}</div>
            <div class="item-count">${soLuong}/100</div>
        `;
        manhTuongContainer.appendChild(itemDiv);
    });
    
    // Update vat pham
    const vatPhamContainer = document.getElementById('vatPham');
    vatPhamContainer.innerHTML = '';
    
    Object.entries(gameState.vatPham).forEach(([ten, soLuong]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item vat-pham';
        itemDiv.innerHTML = `
            <div class="item-name">${ten}</div>
            <div class="item-count">${soLuong}</div>
        `;
        vatPhamContainer.appendChild(itemDiv);
    });
    
    // Check for general combination
    checkGeneralCombination();
}

// Train troops
function renQuan(so) {
    if (gameState.dangRen) {
        alert("Đang rèn quân rồi đại ca!");
        return;
    }
    
    const phut = so / 10;
    gameState.thoiGianCon = phut * 60;
    gameState.dangRen = true;
    
    startTimer();
    
    setTimeout(() => {
        gameState.soQuan += so;
        gameState.dangRen = false;
        gameState.thoiGianCon = 0;
        clearInterval(gameState.timerInterval);
        updateUI();
        alert(`Rèn thành công ${so.toLocaleString()} lính!`);
    }, gameState.thoiGianCon * 1000);
    
    updateUI();
}

// Start countdown timer
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        if (gameState.thoiGianCon <= 0) {
            clearInterval(gameState.timerInterval);
            gameState.dangRen = false;
            updateUI();
            return;
        }
        gameState.thoiGianCon--;
        updateUI();
    }, 1000);
}

// Open chests
function moRuong(so) {
    if (gameState.ruong < so) {
        alert("Hết rương rồi đại ca ơi!");
        return;
    }
    
    gameState.ruong -= so;
    const resultsContainer = document.getElementById('ketQuaMo');
    resultsContainer.innerHTML = `<h3>Kết quả mở ${so} rương:</h3>`;
    
    const results = [];
    
    for (let i = 0; i < so; i++) {
        const rand = Math.random() * 100;
        let cumulativeRate = 0;
        let selectedItem = bangVatPham[0];
        
        for (const item of bangVatPham) {
            cumulativeRate += item.tyLe;
            if (rand <= cumulativeRate) {
                selectedItem = item;
                break;
            }
        }
        
        // Process the result
        if (selectedItem.loai === "manh") {
            const generalName = selectedItem.ten.replace("Mảnh ", "");
            gameState.manhTuong[generalName]++;
            results.push({
                text: `✦ ${selectedItem.ten} ✦`,
                isRare: true
            });
        } else {
            gameState.vatPham[selectedItem.ten]++;
            results.push({
                text: selectedItem.ten,
                isRare: false
            });
        }
    }
    
    // Display results with animation
    displayResults(results);
    updateUI();
}

// Display results with animation
function displayResults(results) {
    const resultsContainer = document.getElementById('ketQuaMo');
    let index = 0;
    
    function showNextResult() {
        if (index < results.length) {
            const resultDiv = document.createElement('div');
            resultDiv.className = `result-item ${results[index].isRare ? 'rare pulse' : 'common'}`;
            resultDiv.textContent = results[index].text;
            resultsContainer.appendChild(resultDiv);
            
            index++;
            setTimeout(showNextResult, 300);
        }
    }
    
    showNextResult();
}

// Check if player can combine generals
function checkGeneralCombination() {
    const resultsContainer = document.getElementById('ketQuaMo');
    let combineSection = document.querySelector('.combine-section');
    
    if (combineSection) {
        combineSection.remove();
    }
    
    let combineHTML = '';
    let canCombine = false;
    
    if (gameState.manhTuong.Takemasa >= 100) {
        combineHTML += `<button onclick="combineGeneral('Takemasa')">Ghép Tướng Takemasa</button>`;
        canCombine = true;
    }
    if (gameState.manhTuong.Ren >= 100) {
        combineHTML += `<button onclick="combineGeneral('Ren')">Ghép Tướng Ren</button>`;
        canCombine = true;
    }
    if (gameState.manhTuong.Shinya >= 100) {
        combineHTML += `<button onclick="combineGeneral('Shinya')">Ghép Tướng Shinya</button>`;
        canCombine = true;
    }
    
    if (canCombine) {
        combineSection = document.createElement('div');
        combineSection.className = 'combine-section';
        combineSection.innerHTML = `
            <h3>Ghép Tướng</h3>
            <div class="action-group">${combineHTML}</div>
        `;
        resultsContainer.appendChild(combineSection);
    }
}

// Combine general pieces into a general
function combineGeneral(generalName) {
    if (gameState.manhTuong[generalName] >= 100) {
        gameState.manhTuong[generalName] -= 100;
        alert(`Chúc mừng! Bạn đã ghép thành công tướng ${generalName}!`);
        updateUI();
    } else {
        alert(`Không đủ mảnh để ghép tướng ${generalName}!`);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);








