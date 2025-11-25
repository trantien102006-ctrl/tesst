// Game state với giá trị mặc định
let gameState = {
    soQuan: 0,
    ruong: 50,
    dangRen: false,
    thoiGianCon: 0,
    timerInterval: null,
    startTime: null,
    endTime: null,
    
    manhTuong: {
        Takemasa: 0,
        Ren: 0,
        Shinya: 0
    },
    
    vatPham: {
        "Giảm 1 phút rèn luyện": 0,
        "Giảm 5 phút rèn luyện": 0,
        "Giảm 10 phút rèn luyện": 0,
        "Giảm 30 phút rèn luyện": 0
    }
};

// Danh sách vật phẩm có thể nhận từ rương
const bangVatPham = [
    { ten: "Giảm 1 phút rèn luyện", tyLe: 40, loai: "giamtg", giam: 60 },
    { ten: "Giảm 5 phút rèn luyện", tyLe: 30, loai: "giamtg", giam: 300 },
    { ten: "Giảm 10 phút rèn luyện", tyLe: 20, loai: "giamtg", giam: 600 },
    { ten: "Giảm 30 phút rèn luyện", tyLe: 10, loai: "giamtg", giam: 1800 },
    { ten: "Mảnh Takemasa", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 10, loai: "manh" }
];

// Lưu game state vào localStorage
function saveGame() {
    const saveData = {
        ...gameState,
        timerInterval: null // Không lưu interval
    };
    localStorage.setItem('gameRenQuan', JSON.stringify(saveData));
    console.log("Game đã được lưu!");
}

// Tải game state từ localStorage
function loadGame() {
    const saved = localStorage.getItem('gameRenQuan');
    if (saved) {
        const loadedState = JSON.parse(saved);
        
        // Kiểm tra nếu có quá trình rèn quân đang diễn ra
        if (loadedState.dangRen && loadedState.endTime) {
            const now = Date.now();
            const endTime = loadedState.endTime;
            
            if (now < endTime) {
                // Quá trình rèn quân chưa kết thúc
                gameState = { ...loadedState };
                gameState.thoiGianCon = Math.floor((endTime - now) / 1000);
                gameState.dangRen = true;
                startTimer();
                console.log("Tiếp tục rèn quân...");
            } else {
                // Quá trình rèn quân đã kết thúc
                const soQuanRen = loadedState.soQuanRen || 0;
                gameState = { ...loadedState };
                gameState.soQuan += soQuanRen;
                gameState.dangRen = false;
                gameState.thoiGianCon = 0;
                gameState.startTime = null;
                gameState.endTime = null;
                console.log("Rèn quân hoàn thành!");
            }
        } else {
            gameState = { ...loadedState };
            gameState.dangRen = false;
            gameState.thoiGianCon = 0;
        }
        
        console.log("Game đã được tải!");
        return true;
    }
    return false;
}

// Khởi tạo game
function initGame() {
    console.log("🚀 Đang khởi động game...");
    
    // Thử tải game đã lưu
    if (!loadGame()) {
        console.log("Không tìm thấy dữ liệu đã lưu, bắt đầu game mới");
    }
    
    // Gán sự kiện cho các nút
    document.getElementById('btnRen100').addEventListener('click', () => renQuan(100));
    document.getElementById('btnRen1000').addEventListener('click', () => renQuan(1000));
    document.getElementById('btnMo1').addEventListener('click', () => moRuong(1));
    document.getElementById('btnMo10').addEventListener('click', () => moRuong(10));
    
    updateUI();
    console.log("✅ Game đã sẵn sàng!");
}

// Cập nhật giao diện
function updateUI() {
    // Cập nhật thống kê cơ bản
    document.getElementById('soQuan').textContent = gameState.soQuan.toLocaleString();
    document.getElementById('ruong').textContent = gameState.ruong;
    
    // Cập nhật timer
    const minutes = String(Math.floor(gameState.thoiGianCon / 60)).padStart(2, '0');
    const seconds = String(gameState.thoiGianCon % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    
    // Cập nhật mảnh tướng trong túi đồ
    const manhTuongContainer = document.getElementById('manhTuong');
    manhTuongContainer.innerHTML = '';
    
    Object.entries(gameState.manhTuong).forEach(([ten, soLuong]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item manh-tuong';
        itemDiv.innerHTML = `
            <div class="item-name">${ten}</div>
            <div class="item-count">${soLuong}/100</div>
        `;
        manhTuongContainer.appendChild(itemDiv);
    });
    
    // Cập nhật vật phẩm trong túi đồ
    const vatPhamContainer = document.getElementById('vatPham');
    vatPhamContainer.innerHTML = '';
    
    Object.entries(gameState.vatPham).forEach(([ten, soLuong]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item vat-pham';
        itemDiv.innerHTML = `
            <div class="item-name">${ten}</div>
            <div class="item-count">${soLuong}</div>
        `;
        vatPhamContainer.appendChild(itemDiv);
    });
    
    // Cập nhật nút sử dụng vật phẩm
    updateUseItems();
    
    // Kiểm tra điều kiện ghép tướng
    checkGeneralCombination();
    
    // Lưu game
    saveGame();
}

// Cập nhật nút sử dụng vật phẩm
function updateUseItems() {
    const useContainer = document.getElementById('suDungVatPham');
    useContainer.innerHTML = '';
    
    // Chỉ hiển thị nút sử dụng nếu đang rèn quân
    if (gameState.dangRen) {
        Object.entries(gameState.vatPham).forEach(([ten, soLuong]) => {
            if (soLuong > 0) {
                const useButton = document.createElement('button');
                useButton.className = 'use-button';
                useButton.textContent = `Sử dụng ${ten} (${soLuong})`;
                useButton.addEventListener('click', () => suDungVatPham(ten));
                useContainer.appendChild(useButton);
            }
        });
        
        if (useContainer.children.length === 0) {
            useContainer.innerHTML = '<p>Không có vật phẩm để sử dụng</p>';
        }
    } else {
        useContainer.innerHTML = '<p>Không có quân đang rèn</p>';
    }
}

// Bắt đầu đếm ngược
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        if (gameState.thoiGianCon <= 0) {
            clearInterval(gameState.timerInterval);
            gameState.dangRen = false;
            gameState.startTime = null;
            gameState.endTime = null;
            updateUI();
            return;
        }
        gameState.thoiGianCon--;
        updateUI();
    }, 1000);
}

// Rèn quân
function renQuan(so) {
    if (gameState.dangRen) {
        alert("Đang rèn quân rồi đại ca!");
        return;
    }
    
    const phut = so / 10;
    gameState.thoiGianCon = phut * 60;
    gameState.dangRen = true;
    gameState.startTime = Date.now();
    gameState.endTime = gameState.startTime + (gameState.thoiGianCon * 1000);
    gameState.soQuanRen = so; // Lưu số quân đang rèn
    
    startTimer();
    
    setTimeout(() => {
        gameState.soQuan += so;
        gameState.dangRen = false;
        gameState.thoiGianCon = 0;
        gameState.startTime = null;
        gameState.endTime = null;
        clearInterval(gameState.timerInterval);
        updateUI();
        alert(`🎉 Rèn thành công ${so.toLocaleString()} lính!`);
    }, gameState.thoiGianCon * 1000);
    
    updateUI();
}

// Mở rương
function moRuong(so) {
    if (gameState.ruong < so) {
        alert("Hết rương rồi đại ca ơi!");
        return;
    }
    
    gameState.ruong -= so;
    const resultsContainer = document.getElementById('ketQuaMo');
    resultsContainer.innerHTML = `<h3>🎁 Kết quả mở ${so} rương:</h3>`;
    
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
        
        // Xử lý kết quả
        if (selectedItem.loai === "manh") {
            const generalName = selectedItem.ten.replace("Mảnh ", "");
            gameState.manhTuong[generalName]++;
            results.push({
                text: `✨ ${selectedItem.ten} ✨`,
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
    
    // Hiển thị kết quả với hiệu ứng
    displayResults(results);
    updateUI();
}

// Hiển thị kết quả với hiệu ứng
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
            setTimeout(showNextResult, 400);
        }
    }
    
    showNextResult();
}

// Kiểm tra điều kiện ghép tướng
function checkGeneralCombination() {
    const resultsContainer = document.getElementById('ketQuaMo');
    let combineSection = document.querySelector('.combine-section');
    
    if (combineSection) {
        combineSection.remove();
    }
    
    let combineHTML = '';
    let canCombine = false;
    
    if (gameState.manhTuong.Takemasa >= 100) {
        combineHTML += `<button onclick="combineGeneral('Takemasa')">⚔️ Ghép Tướng Takemasa</button>`;
        canCombine = true;
    }
    if (gameState.manhTuong.Ren >= 100) {
        combineHTML += `<button onclick="combineGeneral('Ren')">⚔️ Ghép Tướng Ren</button>`;
        canCombine = true;
    }
    if (gameState.manhTuong.Shinya >= 100) {
        combineHTML += `<button onclick="combineGeneral('Shinya')">⚔️ Ghép Tướng Shinya</button>`;
        canCombine = true;
    }
    
    if (canCombine) {
        combineSection = document.createElement('div');
        combineSection.className = 'combine-section';
        combineSection.innerHTML = `
            <h3>🌟 Ghép Tướng 🌟</h3>
            <div class="use-items">${combineHTML}</div>
        `;
        resultsContainer.appendChild(combineSection);
    }
}

// Ghép tướng
function combineGeneral(generalName) {
    if (gameState.manhTuong[generalName] >= 100) {
        gameState.manhTuong[generalName] -= 100;
        alert(`🎉 Chúc mừng! Bạn đã ghép thành công tướng ${generalName}!`);
        updateUI();
    } else {
        alert(`❌ Không đủ mảnh để ghép tướng ${generalName}!`);
    }
}

// Sử dụng vật phẩm giảm thời gian
function suDungVatPham(tenVatPham) {
    if (gameState.vatPham[tenVatPham] <= 0) {
        alert(`Bạn không có ${tenVatPham}!`);
        return;
    }
    
    if (!gameState.dangRen) {
        alert("Không có quân nào đang được rèn!");
        return;
    }
    
    // Tìm vật phẩm trong danh sách để lấy số giây giảm
    const vatPham = bangVatPham.find(item => item.ten === tenVatPham);
    if (!vatPham) {
        alert("Vật phẩm không tồn tại!");
        return;
    }
    
    const giamGiay = vatPham.giam;
    gameState.thoiGianCon = Math.max(0, gameState.thoiGianCon - giamGiay);
    
    // Cập nhật thời gian kết thúc
    if (gameState.endTime) {
        gameState.endTime -= (giamGiay * 1000);
    }
    
    gameState.vatPham[tenVatPham]--;
    
    alert(`Đã sử dụng ${tenVatPham}, giảm ${giamGiay/60} phút!`);
    updateUI();
}

// Khởi động game khi trang load
document.addEventListener('DOMContentLoaded', initGame);
