// Game state mới - RESET HOÀN TOÀN
let gameState = {
    // Lính
    linh: {
        bo: 0,
        ky: 0,
        cung: 0
    },
    
    // Rương (đền bù 100 rương bạc)
    ruong: {
        bac: 100,
        vang: 0,
        kimCuong: 0
    },
    
    // Tướng (ban đầu chưa có, sẽ được chọn)
    tuong: {
        Takemasa: false,
        Ren: false,
        Shinya: false
    },
    
    // Mảnh tướng
    manhTuong: {
        Takemasa: 0,
        Ren: 0,
        Shinya: 0
    },
    
    // Vật phẩm
    vatPham: {
        "Giảm 1 phút rèn luyện": 0,
        "Giảm 5 phút rèn luyện": 0,
        "Giảm 10 phút rèn luyện": 0,
        "Giảm 30 phút rèn luyện": 0
    },
    
    // Trạng thái rèn
    dangRen: false,
    thoiGianCon: 0,
    loaiLinhDangRen: null,
    soLinhDangRen: 0,
    timerInterval: null,
    
    // Chiến trường
    aiHienTai: 1
};

// Danh sách vật phẩm cho từng loại rương
const bangVatPhamBac = [
    { ten: "Giảm 1 phút rèn luyện", tyLe: 40, loai: "giamtg", giam: 60 },
    { ten: "Giảm 5 phút rèn luyện", tyLe: 30, loai: "giamtg", giam: 300 },
    { ten: "Giảm 10 phút rèn luyện", tyLe: 20, loai: "giamtg", giam: 600 },
    { ten: "Giảm 30 phút rèn luyện", tyLe: 10, loai: "giamtg", giam: 1800 },
    { ten: "Mảnh Takemasa", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 10, loai: "manh" }
];

const bangVatPhamVang = [
    { ten: "Giảm 1 phút rèn luyện", tyLe: 35, loai: "giamtg", giam: 60 },
    { ten: "Giảm 5 phút rèn luyện", tyLe: 25, loai: "giamtg", giam: 300 },
    { ten: "Giảm 10 phút rèn luyện", tyLe: 15, loai: "giamtg", giam: 600 },
    { ten: "Giảm 30 phút rèn luyện", tyLe: 8, loai: "giamtg", giam: 1800 },
    { ten: "Mảnh Takemasa", tyLe: 15, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 15, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 11, loai: "manh" }
];

const bangVatPhamKimCuong = [
    { ten: "Giảm 1 phút rèn luyện", tyLe: 30, loai: "giamtg", giam: 60 },
    { ten: "Giảm 5 phút rèn luyện", tyLe: 20, loai: "giamtg", giam: 300 },
    { ten: "Giảm 10 phút rèn luyện", tyLe: 12, loai: "giamtg", giam: 600 },
    { ten: "Giảm 30 phút rèn luyện", tyLe: 6, loai: "giamtg", giam: 1800 },
    { ten: "Mảnh Takemasa", tyLe: 25, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 25, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 14, loai: "manh" },
    { ten: "Tướng Takemasa", tyLe: 0.1, loai: "tuong" },
    { ten: "Tướng Ren", tyLe: 0.1, loai: "tuong" },
    { ten: "Tướng Shinya", tyLe: 0.1, loai: "tuong" }
];

// Lưu game state
function saveGame() {
    const saveData = {
        ...gameState,
        timerInterval: null
    };
    localStorage.setItem('gameTraiLinh', JSON.stringify(saveData));
}

// Tải game state
function loadGame() {
    const saved = localStorage.getItem('gameTraiLinh');
    if (saved) {
        const loadedState = JSON.parse(saved);
        
        // Kiểm tra nếu có quá trình rèn đang diễn ra
        if (loadedState.dangRen && loadedState.thoiGianCon > 0) {
            gameState = { ...loadedState };
            startTimer();
        } else {
            gameState = { ...loadedState };
        }
        
        console.log("Game đã được tải!");
        return true;
    }
    return false;
}

// Khởi tạo game
function initGame() {
    console.log("🚀 Đang khởi động Trại Lính...");
    
    // Thử tải game đã lưu
    if (!loadGame()) {
        console.log("Không tìm thấy dữ liệu đã lưu, hiện popup chọn tướng");
        showChonTuongPopup();
    } else {
        // Nếu đã có dữ liệu, ẩn popup chọn tướng
        document.getElementById('chonTuongPopup').classList.remove('active');
    }
    
    // Gán sự kiện cho các nút
    document.getElementById('btnRenBo').addEventListener('click', () => renLinh('bo', 100, 600));
    document.getElementById('btnRenKy').addEventListener('click', () => renLinh('ky', 100, 900));
    document.getElementById('btnRenCung').addEventListener('click', () => renLinh('cung', 100, 720));
    
    document.getElementById('btnMoBac').addEventListener('click', () => moRuong('bac'));
    document.getElementById('btnMoVang').addEventListener('click', () => moRuong('vang'));
    document.getElementById('btnMoKimCuong').addEventListener('click', () => moRuong('kimCuong'));
    
    document.getElementById('btnDanhAi').addEventListener('click', danhAi);
    
    // Sự kiện cho túi đồ
    document.getElementById('btnInventory').addEventListener('click', openInventory);
    document.getElementById('btnCloseInventory').addEventListener('click', closeInventory);
    
    // Sự kiện cho tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Sự kiện chọn tướng
    setupChonTuong();
    
    updateUI();
    console.log("✅ Trại Lính đã sẵn sàng!");
}

// Popup chọn tướng
function setupChonTuong() {
    const tuongOptions = document.querySelectorAll('.tuong-option');
    const btnXacNhan = document.getElementById('btnXacNhanTuong');
    let selectedTuong = null;
    
    tuongOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Bỏ chọn tất cả
            tuongOptions.forEach(opt => opt.classList.remove('selected'));
            // Chọn cái này
            this.classList.add('selected');
            selectedTuong = this.getAttribute('data-tuong');
            btnXacNhan.disabled = false;
        });
    });
    
    btnXacNhan.addEventListener('click', function() {
        if (selectedTuong) {
            gameState.tuong[selectedTuong] = true;
            document.getElementById('chonTuongPopup').classList.remove('active');
            updateUI();
            saveGame();
            alert(`🎉 Chào mừng Tướng ${selectedTuong} đến với Trại Lính!`);
        }
    });
}

function showChonTuongPopup() {
    document.getElementById('chonTuongPopup').classList.add('active');
}

// Mở túi đồ
function openInventory() {
    document.getElementById('inventoryPopup').classList.add('active');
    updateInventoryUI();
}

// Đóng túi đồ
function closeInventory() {
    document.getElementById('inventoryPopup').classList.remove('active');
}

// Chuyển tab
function switchTab(tabName) {
    // Ẩn tất cả tab
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Hiện tab được chọn
    const tabId = `tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Cập nhật giao diện chính
function updateUI() {
    // Cập nhật lính
    document.getElementById('linhBo').textContent = gameState.linh.bo.toLocaleString();
    document.getElementById('linhKy').textContent = gameState.linh.ky.toLocaleString();
    document.getElementById('linhCung').textContent = gameState.linh.cung.toLocaleString();
    
    // Cập nhật rương
    document.getElementById('ruongBac').textContent = gameState.ruong.bac;
    document.getElementById('ruongVang').textContent = gameState.ruong.vang;
    document.getElementById('ruongKimCuong').textContent = gameState.ruong.kimCuong;
    
    // Cập nhật ải
    document.getElementById('aiHienTai').textContent = gameState.aiHienTai;
    document.getElementById('aiThuong').textContent = `${gameState.aiHienTai} Rương ${getRandomRuongType()}`;
    
    // Cập nhật timer
    const minutes = String(Math.floor(gameState.thoiGianCon / 60)).padStart(2, '0');
    const seconds = String(gameState.thoiGianCon % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    
    // Vô hiệu hóa nút nếu đang rèn
    const renButtons = document.querySelectorAll('.ren-btn');
    renButtons.forEach(btn => {
        btn.disabled = gameState.dangRen;
    });
    
    // Kiểm tra điều kiện ghép tướng
    checkGeneralCombination();
    
    // Lưu game
    saveGame();
}

// Cập nhật giao diện túi đồ
function updateInventoryUI() {
    // Cập nhật mảnh tướng
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
    
    // Cập nhật vật phẩm
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
    
    // Cập nhật tướng
    const tuongContainer = document.getElementById('tuong');
    tuongContainer.innerHTML = '';
    
    Object.entries(gameState.tuong).forEach(([ten, soHuu]) => {
        if (soHuu) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item tuong-item';
            itemDiv.innerHTML = `
                <div class="item-name">${ten}</div>
                <div class="item-count">✅ Đã sở hữu</div>
            `;
            tuongContainer.appendChild(itemDiv);
        }
    });
    
    // Cập nhật nút sử dụng vật phẩm
    updateUseItems();
}

// Cập nhật nút sử dụng vật phẩm
function updateUseItems() {
    const useContainer = document.getElementById('suDungVatPham');
    useContainer.innerHTML = '';
    
    // Chỉ hiển thị nút sử dụng nếu đang rèn
    if (gameState.dangRen) {
        Object.entries(gameState.vatPham).forEach(([ten, soLuong]) => {
            if (soLuong > 0) {
                const useButton = document.createElement('button');
                useButton.className = 'use-btn';
                useButton.textContent = `Sử dụng ${ten} (${soLuong})`;
                useButton.addEventListener('click', () => suDungVatPham(ten));
                useContainer.appendChild(useButton);
            }
        });
        
        if (useContainer.children.length === 0) {
            useContainer.innerHTML = '<p style="text-align: center; color: #ccc;">Không có vật phẩm để sử dụng</p>';
        }
    } else {
        useContainer.innerHTML = '<p style="text-align: center; color: #ccc;">Không có lính đang rèn</p>';
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
            // Hoàn thành rèn lính
            gameState.linh[gameState.loaiLinhDangRen] += gameState.soLinhDangRen;
            gameState.dangRen = false;
            gameState.thoiGianCon = 0;
            gameState.loaiLinhDangRen = null;
            gameState.soLinhDangRen = 0;
            updateUI();
            alert(`🎉 Rèn thành công ${gameState.soLinhDangRen.toLocaleString()} lính ${getLinhName(gameState.loaiLinhDangRen)}!`);
            return;
        }
        gameState.thoiGianCon--;
        updateUI();
    }, 1000);
}

// Rèn lính
function renLinh(loai, soLinh, thoiGianGiay) {
    if (gameState.dangRen) {
        alert("Đang rèn lính rồi!");
        return;
    }
    
    gameState.dangRen = true;
    gameState.thoiGianCon = thoiGianGiay;
    gameState.loaiLinhDangRen = loai;
    gameState.soLinhDangRen = soLinh;
    
    startTimer();
    updateUI();
}

// Lấy tên loại lính
function getLinhName(loai) {
    const names = {
        'bo': 'Bộ',
        'ky': 'Kỵ',
        'cung': 'Cung'
    };
    return names[loai] || '';
}

// Mở rương
function moRuong(loaiRuong) {
    if (gameState.ruong[loaiRuong] <= 0) {
        alert(`Không đủ rương ${loaiRuong}!`);
        return;
    }
    
    gameState.ruong[loaiRuong]--;
    const resultsContainer = document.getElementById('ketQuaMo');
    resultsContainer.innerHTML = `<h3 style="color: #ffd700; text-align: center; margin-bottom: 15px;">🎁 Mở Rương ${getRuongName(loaiRuong)}:</h3>`;
    
    let bangVatPham;
    switch(loaiRuong) {
        case 'vang':
            bangVatPham = bangVatPhamVang;
            break;
        case 'kimCuong':
            bangVatPham = bangVatPhamKimCuong;
            break;
        default:
            bangVatPham = bangVatPhamBac;
    }
    
    const results = [];
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
    let rarity = 'common';
    if (selectedItem.loai === "manh") {
        const generalName = selectedItem.ten.replace("Mảnh ", "");
        gameState.manhTuong[generalName]++;
        results.push({
            text: `✨ ${selectedItem.ten} ✨`,
            rarity: 'rare'
        });
    } else if (selectedItem.loai === "tuong") {
        const generalName = selectedItem.ten.replace("Tướng ", "");
        gameState.tuong[generalName] = true;
        results.push({
            text: `🌟 ${selectedItem.ten} 🌟`,
            rarity: 'legendary'
        });
    } else {
        gameState.vatPham[selectedItem.ten]++;
        results.push({
            text: selectedItem.ten,
            rarity: 'common'
        });
    }
    
    // Hiển thị kết quả
    displayResults(results);
    updateUI();
}

// Lấy tên loại rương
function getRuongName(loai) {
    const names = {
        'bac': 'Bạc',
        'vang': 'Vàng',
        'kimCuong': 'Kim Cương'
    };
    return names[loai] || '';
}

// Hiển thị kết quả
function displayResults(results) {
    const resultsContainer = document.getElementById('ketQuaMo');
    
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = `result-item ${result.rarity} pulse`;
        resultDiv.textContent = result.text;
        resultsContainer.appendChild(resultDiv);
    });
}

// Đánh ải
function danhAi() {
    const linhRequired = gameState.aiHienTai * 100;
    const totalLinh = gameState.linh.bo + gameState.linh.ky + gameState.linh.cung;
    
    if (totalLinh < linhRequired) {
        alert(`Không đủ lính! Cần ${linhRequired} lính để đánh ải ${gameState.aiHienTai}`);
        return;
    }
    
    // Trừ lính (ưu tiên trừ đều các loại)
    const linhMoiLoai = Math.ceil(linhRequired / 3);
    gameState.linh.bo = Math.max(0, gameState.linh.bo - linhMoiLoai);
    gameState.linh.ky = Math.max(0, gameState.linh.ky - linhMoiLoai);
    gameState.linh.cung = Math.max(0, gameState.linh.cung - linhMoiLoai);
    
    // Thưởng rương
    const ruongType = getRandomRuongType();
    gameState.ruong[ruongType] += gameState.aiHienTai;
    
    // Tăng ải
    gameState.aiHienTai++;
    
    // Hiển thị kết quả
    const resultsContainer = document.getElementById('ketQuaMo');
    resultsContainer.innerHTML = `
        <h3 style="color: #ff4444; text-align: center; margin-bottom: 15px;">⚔️ Chiến Thắng Ải ${gameState.aiHienTai - 1}</h3>
        <div class="result-item epic">Tiêu hao: ${linhRequired} lính</div>
        <div class="result-item rare">Nhận được: ${gameState.aiHienTai - 1} Rương ${getRuongName(ruongType)}</div>
    `;
    
    updateUI();
}

// Lấy loại rương ngẫu nhiên cho thưởng ải
function getRandomRuongType() {
    const rand = Math.random() * 100;
    if (rand < 70) return 'bac';      // 70% rương bạc
    if (rand < 90) return 'vang';     // 20% rương vàng
    return 'kimCuong';               // 10% rương kim cương
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
    
    if (gameState.manhTuong.Takemasa >= 100 && !gameState.tuong.Takemasa) {
        combineHTML += `<button class="use-btn" onclick="combineGeneral('Takemasa')">⚔️ Ghép Tướng Takemasa</button>`;
        canCombine = true;
    }
    if (gameState.manhTuong.Ren >= 100 && !gameState.tuong.Ren) {
        combineHTML += `<button class="use-btn" onclick="combineGeneral('Ren')">⚔️ Ghép Tướng Ren</button>`;
        canCombine = true;
    }
    if (gameState.manhTuong.Shinya >= 100 && !gameState.tuong.Shinya) {
        combineHTML += `<button class="use-btn" onclick="combineGeneral('Shinya')">⚔️ Ghép Tướng Shinya</button>`;
        canCombine = true;
    }
    
    if (canCombine) {
        combineSection = document.createElement('div');
        combineSection.className = 'combine-section';
        combineSection.innerHTML = `
            <h3>🌟 Ghép Tướng 🌟</h3>
            <div class="use-buttons">${combineHTML}</div>
        `;
        resultsContainer.appendChild(combineSection);
    }
}

// Ghép tướng
function combineGeneral(generalName) {
    if (gameState.manhTuong[generalName] >= 100 && !gameState.tuong[generalName]) {
        gameState.manhTuong[generalName] -= 100;
        gameState.tuong[generalName] = true;
        alert(`🎉 Chúc mừng! Bạn đã ghép thành công tướng ${generalName}!`);
        updateUI();
        updateInventoryUI();
    } else {
        alert(`❌ Không thể ghép tướng ${generalName}!`);
    }
}

// Sử dụng vật phẩm giảm thời gian
function suDungVatPham(tenVatPham) {
    if (gameState.vatPham[tenVatPham] <= 0) {
        alert(`Bạn không có ${tenVatPham}!`);
        return;
    }
    
    if (!gameState.dangRen) {
        alert("Không có lính nào đang được rèn!");
        return;
    }
    
    // Tìm vật phẩm trong danh sách để lấy số giây giảm
    let giamGiay = 0;
    switch(tenVatPham) {
        case "Giảm 1 phút rèn luyện": giamGiay = 60; break;
        case "Giảm 5 phút rèn luyện": giamGiay = 300; break;
        case "Giảm 10 phút rèn luyện": giamGiay = 600; break;
        case "Giảm 30 phút rèn luyện": giamGiay = 1800; break;
    }
    
    gameState.thoiGianCon = Math.max(0, gameState.thoiGianCon - giamGiay);
    gameState.vatPham[tenVatPham]--;
    
    alert(`Đã sử dụng ${tenVatPham}, giảm ${giamGiay/60} phút!`);
    updateUI();
    updateInventoryUI();
}

// Khởi động game khi trang load
document.addEventListener('DOMContentLoaded', initGame);
