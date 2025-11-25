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
    startTime: null,
    endTime: null,
    
    // Chiến trường
    aiHienTai: 1,
    autoDanhAi: false,
    autoDanhAiInterval: null
};

// Danh sách quái vật theo level
const danhSachQuaiVat = [
    { ten: "Slime", level: 1, sucManh: 50, mau: 100, thuong: { bac: 1 } },
    { ten: "Goblin", level: 2, sucManh: 80, mau: 150, thuong: { bac: 2 } },
    { ten: "Wolf", level: 3, sucManh: 120, mau: 200, thuong: { bac: 2, vang: 1 } },
    { ten: "Orc", level: 4, sucManh: 180, mau: 300, thuong: { bac: 3, vang: 1 } },
    { ten: "Skeleton", level: 5, sucManh: 250, mau: 400, thuong: { bac: 3, vang: 2 } },
    { ten: "Troll", level: 6, sucManh: 350, mau: 600, thuong: { vang: 2, kimCuong: 1 } },
    { ten: "Minotaur", level: 7, sucManh: 500, mau: 800, thuong: { vang: 3, kimCuong: 1 } },
    { ten: "Dragon", level: 8, sucManh: 800, mau: 1200, thuong: { vang: 5, kimCuong: 2 } }
];

// Danh sách vật phẩm cho từng loại rương
const bangVatPhamBac = [
    { ten: "Giảm 1 phút rèn luyện", tyLe: 40, loai: "giamtg", giam: 60 },
    { ten: "Giảm 5 phút rèn luyện", tyLe: 30, loai: "giamtg", giam: 300 },
    { ten: "Giảm 10 phút rèn luyện", tyLe: 20, loai: "giamtg", giam: 600 },
    { ten: "Giảm 30 phút rèn luyện", tyLe: 10, loai: "giamtg", giam: 1800 },
    { ten: "Mảnh Takemasa", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 10, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 5, loai: "manh" }
];

const bangVatPhamVang = [
    { ten: "Giảm 1 phút rèn luyện", tyLe: 35, loai: "giamtg", giam: 60 },
    { ten: "Giảm 5 phút rèn luyện", tyLe: 25, loai: "giamtg", giam: 300 },
    { ten: "Giảm 10 phút rèn luyện", tyLe: 15, loai: "giamtg", giam: 600 },
    { ten: "Giảm 30 phút rèn luyện", tyLe: 8, loai: "giamtg", giam: 1800 },
    { ten: "Mảnh Takemasa", tyLe: 15, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 15, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 7, loai: "manh" }
];

const bangVatPhamKimCuong = [
    { ten: "Giảm 1 phút rèn luyện", tyLe: 30, loai: "giamtg", giam: 60 },
    { ten: "Giảm 5 phút rèn luyện", tyLe: 20, loai: "giamtg", giam: 300 },
    { ten: "Giảm 10 phút rèn luyện", tyLe: 12, loai: "giamtg", giam: 600 },
    { ten: "Giảm 30 phút rèn luyện", tyLe: 6, loai: "giamtg", giam: 1800 },
    { ten: "Mảnh Takemasa", tyLe: 25, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 25, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 10, loai: "manh" },
    { ten: "Tướng Shinya", tyLe: 2, loai: "tuong" }
];

// Lưu game state
function saveGame() {
    const saveData = {
        ...gameState,
        timerInterval: null,
        autoDanhAiInterval: null
    };
    localStorage.setItem('gameTraiLinh', JSON.stringify(saveData));
}

// Tải game state và xử lý rèn lính offline
function loadGame() {
    const saved = localStorage.getItem('gameTraiLinh');
    if (saved) {
        const loadedState = JSON.parse(saved);
        
        // Kiểm tra nếu có quá trình rèn đang diễn ra
        if (loadedState.dangRen && loadedState.endTime) {
            const now = Date.now();
            const endTime = loadedState.endTime;
            
            if (now < endTime) {
                // Quá trình rèn lính chưa kết thúc - tiếp tục
                gameState = { ...loadedState };
                gameState.thoiGianCon = Math.floor((endTime - now) / 1000);
                gameState.dangRen = true;
                startTimer();
                console.log("Tiếp tục rèn lính từ offline...");
            } else {
                // Quá trình rèn lính đã kết thúc - hoàn thành
                gameState = { ...loadedState };
                gameState.linh[gameState.loaiLinhDangRen] += gameState.soLinhDangRen;
                gameState.dangRen = false;
                gameState.thoiGianCon = 0;
                gameState.startTime = null;
                gameState.endTime = null;
                gameState.loaiLinhDangRen = null;
                gameState.soLinhDangRen = 0;
                console.log("Rèn lính hoàn thành khi offline!");
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
    console.log("🚀 Đang khởi động Trại Lính...");
    
    // Kiểm tra kết nối internet
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
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
    document.getElementById('btnAutoDanhAi').addEventListener('click', toggleAutoDanhAi);
    
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
    
    // Sự kiện popup kết quả chiến đấu
    document.getElementById('btnCloseCombatResult').addEventListener('click', closeCombatResult);
    
    // Sự kiện chọn tướng
    setupChonTuong();
    
    updateUI();
    console.log("✅ Trại Lính đã sẵn sàng!");
}

// Cập nhật trạng thái online/offline
function updateOnlineStatus() {
    const statusElement = document.getElementById('onlineStatus');
    if (navigator.onLine) {
        statusElement.textContent = '🟢 Online';
        statusElement.style.color = '#4CAF50';
    } else {
        statusElement.textContent = '🔴 Offline';
        statusElement.style.color = '#ff4444';
    }
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

// Đóng popup kết quả chiến đấu
function closeCombatResult() {
    document.getElementById('combatResultPopup').classList.remove('active');
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
    
    // Cập nhật bonus từ tướng
    updateBonusDisplay();
    
    // Cập nhật rương
    document.getElementById('ruongBac').textContent = gameState.ruong.bac;
    document.getElementById('ruongVang').textContent = gameState.ruong.vang;
    document.getElementById('ruongKimCuong').textContent = gameState.ruong.kimCuong;
    
    // Cập nhật thông tin ải và quái vật
    updateAiInfo();
    
    // Cập nhật thông tin quân đội
    updateArmyInfo();
    
    // Cập nhật timer và thông tin rèn
    updateRenInfo();
    
    // Kiểm tra điều kiện ghép tướng
    checkGeneralCombination();
    
    // Lưu game
    saveGame();
}

// Cập nhật bonus từ tướng
function updateBonusDisplay() {
    let bonusBo = 0;
    let bonusKy = 0;
    let bonusCung = 0;
    
    if (gameState.tuong.Takemasa) bonusBo = 10;
    if (gameState.tuong.Ren) bonusCung = 10;
    if (gameState.tuong.Shinya) bonusKy = 10;
    
    document.getElementById('bonusBo').textContent = `+${bonusBo}%`;
    document.getElementById('bonusKy').textContent = `+${bonusKy}%`;
    document.getElementById('bonusCung').textContent = `+${bonusCung}%`;
}

// Cập nhật thông tin ải
function updateAiInfo() {
    const quaiVat = getQuaiVatForAi(gameState.aiHienTai);
    document.getElementById('aiHienTai').textContent = gameState.aiHienTai;
    document.getElementById('aiEnemy').textContent = quaiVat.ten;
    document.getElementById('aiThuong').textContent = getThuongText(quaiVat.thuong);
    
    // Cập nhật thông tin quái vật
    document.getElementById('enemyName').textContent = quaiVat.ten;
    document.getElementById('enemyPower').textContent = quaiVat.sucManh;
    document.getElementById('enemyHealth').textContent = quaiVat.mau;
}

// Cập nhật thông tin quân đội
function updateArmyInfo() {
    document.getElementById('armyBo').textContent = gameState.linh.bo;
    document.getElementById('armyKy').textContent = gameState.linh.ky;
    document.getElementById('armyCung').textContent = gameState.linh.cung;
    
    const totalLinh = gameState.linh.bo + gameState.linh.ky + gameState.linh.cung;
    document.getElementById('armyTotal').textContent = totalLinh;
}

// Cập nhật thông tin rèn lính
function updateRenInfo() {
    const minutes = String(Math.floor(gameState.thoiGianCon / 60)).padStart(2, '0');
    const seconds = String(gameState.thoiGianCon % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    
    const renInfoElement = document.getElementById('renInfo');
    if (gameState.dangRen) {
        const linhName = getLinhName(gameState.loaiLinhDangRen);
        renInfoElement.textContent = `Đang rèn ${gameState.soLinhDangRen} ${linhName}`;
        renInfoElement.style.color = '#ffd700';
    } else {
        renInfoElement.textContent = 'Không có lính đang rèn';
        renInfoElement.style.color = '#ccc';
    }
    
    // Vô hiệu hóa nút nếu đang rèn
    const renButtons = document.querySelectorAll('.ren-btn');
    renButtons.forEach(btn => {
        btn.disabled = gameState.dangRen;
    });
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
            let bonusText = '';
            if (ten === 'Takemasa') bonusText = '<div class="tuong-bonus-small">+10% Lính Bộ</div>';
            if (ten === 'Ren') bonusText = '<div class="tuong-bonus-small">+10% Lính Cung</div>';
            if (ten === 'Shinya') bonusText = '<div class="tuong-bonus-small">+10% Lính Kỵ</div>';
            
            itemDiv.innerHTML = `
                <div class="item-name">${ten}</div>
                <div class="item-count">✅ Đã sở hữu</div>
                ${bonusText}
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
            gameState.startTime = null;
            gameState.endTime = null;
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

// Rèn lính với cơ chế offline
function renLinh(loai, soLinh, thoiGianGiay) {
    if (gameState.dangRen) {
        alert("Đang rèn lính rồi!");
        return;
    }
    
    gameState.dangRen = true;
    gameState.thoiGianCon = thoiGianGiay;
    gameState.loaiLinhDangRen = loai;
    gameState.soLinhDangRen = soLinh;
    gameState.startTime = Date.now();
    gameState.endTime = gameState.startTime + (thoiGianGiay * 1000);
    
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

// Lấy quái vật cho ải
function getQuaiVatForAi(aiLevel) {
    const index = Math.min(aiLevel - 1, danhSachQuaiVat.length - 1);
    return danhSachQuaiVat[index];
}

// Lấy text thưởng
function getThuongText(thuong) {
    let text = '';
    if (thuong.bac) text += `${thuong.bac} Bạc `;
    if (thuong.vang) text += `${thuong.vang} Vàng `;
    if (thuong.kimCuong) text += `${thuong.kimCuong} Kim Cương`;
    return text.trim();
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
    const quaiVat = getQuaiVatForAi(gameState.aiHienTai);
    const totalLinh = gameState.linh.bo + gameState.linh.ky + gameState.linh.cung;
    
    // Tính sức mạnh quân đội có bonus từ tướng
    let sucManhQuanDoi = 0;
    sucManhQuanDoi += gameState.linh.bo * (1 + (gameState.tuong.Takemasa ? 0.1 : 0));
    sucManhQuanDoi += gameState.linh.ky * (1 + (gameState.tuong.Shinya ? 0.1 : 0));
    sucManhQuanDoi += gameState.linh.cung * (1 + (gameState.tuong.Ren ? 0.1 : 0));
    
    if (sucManhQuanDoi < quaiVat.sucManh) {
        showCombatResult(false, quaiVat, sucManhQuanDoi);
        return;
    }
    
    // Tính tổn thất (tối thiểu 10% quân)
    const tiLeThietHai = 0.1 + (Math.random() * 0.2); // 10-30% tổn thất
    const linhMat = Math.floor(totalLinh * tiLeThietHai);
    
    // Trừ lính (tỷ lệ theo số lượng mỗi loại)
    const tiLeBo = gameState.linh.bo / totalLinh;
    const tiLeKy = gameState.linh.ky / totalLinh;
    const tiLeCung = gameState.linh.cung / totalLinh;
    
    gameState.linh.bo = Math.max(0, gameState.linh.bo - Math.floor(linhMat * tiLeBo));
    gameState.linh.ky = Math.max(0, gameState.linh.ky - Math.floor(linhMat * tiLeKy));
    gameState.linh.cung = Math.max(0, gameState.linh.cung - Math.floor(linhMat * tiLeCung));
    
    // Thưởng rương
    if (quaiVat.thuong.bac) gameState.ruong.bac += quaiVat.thuong.bac;
    if (quaiVat.thuong.vang) gameState.ruong.vang += quaiVat.thuong.vang;
    if (quaiVat.thuong.kimCuong) gameState.ruong.kimCuong += quaiVat.thuong.kimCuong;
    
    // Tăng ải
    gameState.aiHienTai++;
    
    // Hiển thị kết quả
    showCombatResult(true, quaiVat, sucManhQuanDoi, linhMat);
    updateUI();
}

// Hiển thị kết quả chiến đấu
function showCombatResult(chienThang, quaiVat, sucManhQuanDoi, linhMat = 0) {
    const popup = document.getElementById('combatResultPopup');
    const content = document.getElementById('combatResultContent');
    
    if (chienThang) {
        content.innerHTML = `
            <div class="combat-result-victory">
                <h3 style="color: #4CAF50;">🎉 Chiến Thắng!</h3>
                <div class="combat-details">
                    <p>Đã đánh bại <strong>${quaiVat.ten}</strong></p>
                    <p>Tổn thất: <span style="color: #ff4444;">${linhMat.toLocaleString()} lính</span></p>
                    <p>Thưởng: <span style="color: #ffd700;">${getThuongText(quaiVat.thuong)}</span></p>
                </div>
                <div class="combat-stats">
                    <p>Ải mới: <strong>${gameState.aiHienTai}</strong></p>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="combat-result-defeat">
                <h3 style="color: #ff4444;">💥 Thất Bại!</h3>
                <div class="combat-details">
                    <p>Không thể đánh bại <strong>${quaiVat.ten}</strong></p>
                    <p>Sức mạnh của bạn: <span style="color: #ffd700;">${sucManhQuanDoi.toFixed(0)}</span></p>
                    <p>Sức mạnh đối thủ: <span style="color: #ff4444;">${quaiVat.sucManh}</span></p>
                </div>
                <div class="combat-tips">
                    <p>💡 Mẹo: Rèn thêm lính hoặc sử dụng vật phẩm tăng sức mạnh</p>
                </div>
            </div>
        `;
    }
    
    popup.classList.add('active');
}

// Tự động đánh ải
function toggleAutoDanhAi() {
    const btn = document.getElementById('btnAutoDanhAi');
    
    if (gameState.autoDanhAi) {
        // Tắt auto
        gameState.autoDanhAi = false;
        clearInterval(gameState.autoDanhAiInterval);
        btn.textContent = '🔄 Tự Động Đánh Ải';
        btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else {
        // Bật auto
        gameState.autoDanhAi = true;
        btn.textContent = '⏹️ Dừng Tự Động';
        btn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        
        gameState.autoDanhAiInterval = setInterval(() => {
            if (!gameState.autoDanhAi) {
                clearInterval(gameState.autoDanhAiInterval);
                return;
            }
            
            const quaiVat = getQuaiVatForAi(gameState.aiHienTai);
            const totalLinh = gameState.linh.bo + gameState.linh.ky + gameState.linh.cung;
            
            // Tính sức mạnh quân đội
            let sucManhQuanDoi = 0;
            sucManhQuanDoi += gameState.linh.bo * (1 + (gameState.tuong.Takemasa ? 0.1 : 0));
            sucManhQuanDoi += gameState.linh.ky * (1 + (gameState.tuong.Shinya ? 0.1 : 0));
            sucManhQuanDoi += gameState.linh.cung * (1 + (gameState.tuong.Ren ? 0.1 : 0));
            
            if (sucManhQuanDoi >= quaiVat.sucManh && totalLinh > 0) {
                danhAi();
            } else {
                // Không đủ sức đánh, tắt auto
                toggleAutoDanhAi();
                alert('Không đủ lính để tiếp tục tự động đánh ải!');
            }
        }, 3000); // 3 giây mỗi lần đánh
    }
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
    
    // Cập nhật thời gian kết thúc
    if (gameState.endTime) {
        gameState.endTime -= (giamGiay * 1000);
    }
    
    gameState.vatPham[tenVatPham]--;
    
    alert(`Đã sử dụng ${tenVatPham}, giảm ${giamGiay/60} phút!`);
    updateUI();
    updateInventoryUI();
}

// Khởi động game khi trang load
document.addEventListener('DOMContentLoaded', initGame);
