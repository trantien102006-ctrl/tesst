// Game state - đảm bảo biến toàn cục
window.gameState = {
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
window.bangVatPham = [
    { ten: "Giảm 1 phút", tyLe: 40, loai: "giamtg" },
    { ten: "Giảm 5 phút", tyLe: 30, loai: "giamtg" },
    { ten: "Giảm 10 phút", tyLe: 20, loai: "giamtg" },
    { ten: "Giảm 30 phút", tyLe: 10, loai: "giamtg" },
    { ten: "Mảnh Takemasa", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 10, loai: "manh" }
];

// Initialize game - đảm bảo hàm toàn cục
window.initGame = function() {
    console.log("🚀 Initializing game on Glitch...");
    
    // Gán sự kiện cho các nút
    const btnRen100 = document.getElementById('btnRen100');
    const btnRen1000 = document.getElementById('btnRen1000');
    const btnMo1 = document.getElementById('btnMo1');
    const btnMo10 = document.getElementById('btnMo10');
    
    if (btnRen100) {
        btnRen100.addEventListener('click', function() {
            console.log("Clicked: Rèn 100 quân");
            renQuan(100);
        });
    } else {
        console.error("❌ Không tìm thấy nút btnRen100");
    }
    
    if (btnRen1000) {
        btnRen1000.addEventListener('click', function() {
            console.log("Clicked: Rèn 1000 quân");
            renQuan(1000);
        });
    } else {
        console.error("❌ Không tìm thấy nút btnRen1000");
    }
    
    if (btnMo1) {
        btnMo1.addEventListener('click', function() {
            console.log("Clicked: Mở 1 rương");
            moRuong(1);
        });
    } else {
        console.error("❌ Không tìm thấy nút btnMo1");
    }
    
    if (btnMo10) {
        btnMo10.addEventListener('click', function() {
            console.log("Clicked: Mở 10 rương");
            moRuong(10);
        });
    } else {
        console.error("❌ Không tìm thấy nút btnMo10");
    }
    
    updateUI();
    console.log("✅ Game initialized successfully!");
};

// Update UI
window.updateUI = function() {
    // Update basic stats
    document.getElementById('soQuan').textContent = window.gameState.soQuan.toLocaleString();
    document.getElementById('ruong').textContent = window.gameState.ruong;
    
    // Update timer
    const minutes = String(Math.floor(window.gameState.thoiGianCon / 60)).padStart(2, '0');
    const seconds = String(window.gameState.thoiGianCon % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    
    // Update manh tuong
    const manhTuongContainer = document.getElementById('manhTuong');
    if (manhTuongContainer) {
        manhTuongContainer.innerHTML = '';
        
        Object.entries(window.gameState.manhTuong).forEach(([ten, soLuong]) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item manh-tuong';
            itemDiv.innerHTML = `
                <div class="item-name">${ten}</div>
                <div class="item-count">${soLuong}/100</div>
            `;
            manhTuongContainer.appendChild(itemDiv);
        });
    }
    
    // Update vat pham
    const vatPhamContainer = document.getElementById('vatPham');
    if (vatPhamContainer) {
        vatPhamContainer.innerHTML = '';
        
        Object.entries(window.gameState.vatPham).forEach(([ten, soLuong]) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item vat-pham';
            itemDiv.innerHTML = `
                <div class="item-name">${ten}</div>
                <div class="item-count">${soLuong}</div>
            `;
            vatPhamContainer.appendChild(itemDiv);
        });
    }
    
    // Check for general combination
    checkGeneralCombination();
};

// Train troops
window.renQuan = function(so) {
    if (window.gameState.dangRen) {
        alert("Đang rèn quân rồi đại ca!");
        return;
    }
    
    const phut = so / 10;
    window.gameState.thoiGianCon = phut * 60;
    window.gameState.dangRen = true;
    
    startTimer();
    
    setTimeout(() => {
        window.gameState.soQuan += so;
        window.gameState.dangRen = false;
        window.gameState.thoiGianCon = 0;
        clearInterval(window.gameState.timerInterval);
        updateUI();
        alert(`🎉 Rèn thành công ${so.toLocaleString()} lính!`);
    }, window.gameState.thoiGianCon * 1000);
    
    updateUI();
};

// Start countdown timer
window.startTimer = function() {
    if (window.gameState.timerInterval) {
        clearInterval(window.gameState.timerInterval);
    }
    
    window.gameState.timerInterval = setInterval(() => {
        if (window.gameState.thoiGianCon <= 0) {
            clearInterval(window.gameState.timerInterval);
            window.gameState.dangRen = false;
            updateUI();
            return;
        }
        window.gameState.thoiGianCon--;
        updateUI();
    }, 1000);
};

// Open chests
window.moRuong = function(so) {
    if (window.gameState.ruong < so) {
        alert("Hết rương rồi đại ca ơi!");
        return;
    }
    
    window.gameState.ruong -= so;
    const resultsContainer = document.getElementById('ketQuaMo');
    if (!resultsContainer) {
        console.error("❌ Không tìm thấy container kết quả");
        return;
    }
    
    resultsContainer.innerHTML = `<h3>🎁 Kết quả mở ${so} rương:</h3>`;
    
    const results = [];
    
    for (let i = 0; i < so; i++) {
        const rand = Math.random() * 100;
        let cumulativeRate = 0;
        let selectedItem = window.bangVatPham[0];
        
        for (const item of window.bangVatPham) {
            cumulativeRate += item.tyLe;
            if (rand <= cumulativeRate) {
                selectedItem = item;
                break;
            }
        }
        
        // Process the result
        if (selectedItem.loai === "manh") {
            const generalName = selectedItem.ten.replace("Mảnh ", "");
            window.gameState.manhTuong[generalName]++;
            results.push({
                text: `✨ ${selectedItem.ten} ✨`,
                isRare: true
            });
        } else {
            window.gameState.vatPham[selectedItem.ten]++;
            results.push({
                text: selectedItem.ten,
                isRare: false
            });
        }
    }
    
    // Display results with animation
    displayResults(results);
    updateUI();
};

// Display results with animation
window.displayResults = function(results) {
    const resultsContainer = document.getElementById('ketQuaMo');
    let index = 0;
    
    function showNextResult() {
        if (index < results.length) {
            const resultDiv = document.createElement('div');
            resultDiv.className = `result-item ${results[index].isRare ? 'rare pulse' : 'common'}`;
            resultDiv.textContent = results[index].text;
            resultsContainer.appendChild(resultDiv);
            
            index++;
            setTimeout(showNextResult, 400);
        }
    }
    
    showNextResult();
};

// Check if player can combine generals
window.checkGeneralCombination = function() {
    const resultsContainer = document.getElementById('ketQuaMo');
    if (!resultsContainer) return;
    
    let combineSection = document.querySelector('.combine-section');
    
    if (combineSection) {
        combineSection.remove();
    }
    
    let combineHTML = '';
    let canCombine = false;
    
    if (window.gameState.manhTuong.Takemasa >= 100) {
        combineHTML += `<button onclick="window.combineGeneral('Takemasa')">⚔️ Ghép Tướng Takemasa</button>`;
        canCombine = true;
    }
    if (window.gameState.manhTuong.Ren >= 100) {
        combineHTML += `<button onclick="window.combineGeneral('Ren')">⚔️ Ghép Tướng Ren</button>`;
        canCombine = true;
    }
    if (window.gameState.manhTuong.Shinya >= 100) {
        combineHTML += `<button onclick="window.combineGeneral('Shinya')">⚔️ Ghép Tướng Shinya</button>`;
        canCombine = true;
    }
    
    if (canCombine) {
        combineSection = document.createElement('div');
        combineSection.className = 'combine-section';
        combineSection.innerHTML = `
            <h3>🌟 Ghép Tướng 🌟</h3>
            <div class="action-group">${combineHTML}</div>
        `;
        resultsContainer.appendChild(combineSection);
    }
};

// Combine general pieces into a general
window.combineGeneral = function(generalName) {
    if (window.gameState.manhTuong[generalName] >= 100) {
        window.gameState.manhTuong[generalName] -= 100;
        alert(`🎉 Chúc mừng! Bạn đã ghép thành công tướng ${generalName}!`);
        updateUI();
    } else {
        alert(`❌ Không đủ mảnh để ghép tướng ${generalName}!`);
    }
};

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM fully loaded");
    setTimeout(initGame, 100); // Thêm delay nhỏ để đảm bảo mọi thứ đã sẵn sàng
});

// Fallback: Nếu vẫn có vấn đề, thử khởi tạo sau 2 giây
setTimeout(function() {
    if (typeof window.initGame === 'function' && !window.gameInitialized) {
        window.initGame();
        window.gameInitialized = true;
    }
}, 2000);









