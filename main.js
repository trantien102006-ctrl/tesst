// Biến toàn cục
let soQuan = 0;
let ruong = 50;
let dangRen = false;
let thoiGianCon = 0;
let timerInterval = null;

// Lưu trữ mảnh tướng và vật phẩm
let manhTuong = {
    Takemasa: 0,
    Ren: 0,
    Shinya: 0
};

let vatPham = {
    "Giảm 1 phút": 0,
    "Giảm 5 phút": 0,
    "Giảm 10 phút": 0,
    "Giảm 30 phút": 0
};

// Danh sách vật phẩm có thể nhận từ rương
const bangVatPham = [
    { ten: "Giảm 1 phút", tyLe: 50, loai: "giamtg" },
    { ten: "Giảm 5 phút", tyLe: 30, loai: "giamtg" },
    { ten: "Giảm 10 phút", tyLe: 20, loai: "giamtg" },
    { ten: "Giảm 30 phút", tyLe: 10, loai: "giamtg" },
    { ten: "Mảnh Takemasa", tyLe: 5, loai: "manh" },
    { ten: "Mảnh Ren", tyLe: 5, loai: "manh" },
    { ten: "Mảnh Shinya", tyLe: 0.1, loai: "manh" }
];

// Hàm khởi tạo game
function initGame() {
    capNhat();
    console.log("Game đã được khởi tạo!");
}

// Hàm cập nhật giao diện
function capNhat() {
    document.getElementById("soQuan").textContent = soQuan.toLocaleString();
    document.getElementById("ruong").textContent = ruong;
    
    // Cập nhật hiển thị mảnh tướng
    document.getElementById("manhTuong").innerHTML = `
        <div class="vatpham manhtuong">Takemasa: ${manhTuong.Takemasa}/100</div>
        <div class="vatpham manhtuong">Ren: ${manhTuong.Ren}/100</div>
        <div class="vatpham manhtuong">Shinya: ${manhTuong.Shinya}/100</div>
    `;
    
    // Cập nhật hiển thị vật phẩm
    document.getElementById("vatPham").innerHTML = `
        <div class="vatpham giamtg">Giảm 1 phút: ${vatPham["Giảm 1 phút"]}</div>
        <div class="vatpham giamtg">Giảm 5 phút: ${vatPham["Giảm 5 phút"]}</div>
        <div class="vatpham giamtg">Giảm 10 phút: ${vatPham["Giảm 10 phút"]}</div>
        <div class="vatpham giamtg">Giảm 30 phút: ${vatPham["Giảm 30 phút"]}</div>
    `;
    
    // Kiểm tra và hiển thị nút ghép tướng nếu đủ mảnh
    kiemTraGhepTuong();
}

// Hàm đếm ngược thời gian
function demNguoc() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        if (thoiGianCon <= 0) {
            clearInterval(timerInterval);
            dangRen = false;
            capNhat();
            return;
        }
        thoiGianCon--;
        const m = String(Math.floor(thoiGianCon / 60)).padStart(2, '0');
        const s = String(thoiGianCon % 60).padStart(2, '0');
        document.getElementById("timer").textContent = `${m}:${s}`;
    }, 1000);
}

// Hàm rèn quân
function renQuan(so) {
    if (dangRen) {
        alert("Đang rèn quân rồi đại ca!");
        return;
    }
    
    const phut = so / 10;
    thoiGianCon = phut * 60;
    dangRen = true;
    demNguoc();
    
    setTimeout(() => {
        soQuan += so;
        dangRen = false;
        document.getElementById("timer").textContent = "00:00";
        clearInterval(timerInterval);
        capNhat();
        alert(`Rèn thành công ${so.toLocaleString()} lính!`);
    }, thoiGianCon * 1000);
}

// Hàm mở rương
function moRuong(so) {
    if (ruong < so) {
        alert("Hết rương rồi đại ca ơi!");
        return;
    }
    
    ruong -= so;
    let html = "";
    let results = [];
    
    for (let i = 0; i < so; i++) {
        const rand = Math.random() * 100;
        let tong = 0;
        let ra = bangVatPham[0];
        
        for (const vp of bangVatPham) {
            tong += vp.tyLe;
            if (rand <= tong) { 
                ra = vp; 
                break; 
            }
        }
        
        // Xử lý kết quả
        if (ra.loai === "manh") {
            const tenTuong = ra.ten.replace("Mảnh ", "");
            manhTuong[tenTuong]++;
            results.push({ type: 'manh', name: ra.ten, html: `<div class="ketqua-item pulse" style="color:#4CAF50; font-weight:bold;">✦ ${ra.ten} ✦</div>` });
        } else {
            vatPham[ra.ten]++;
            results.push({ type: 'giamtg', name: ra.ten, html: `<div class="ketqua-item" style="color:#2196F3;">${ra.ten}</div>` });
        }
    }
    
    // Hiển thị kết quả với hiệu ứng
    displayResultsWithAnimation(results);
    capNhat();
}

// Hiển thị kết quả với hiệu ứng
function displayResultsWithAnimation(results) {
    const ketQuaMoDiv = document.getElementById("ketQuaMo");
    ketQuaMoDiv.innerHTML = "<h3>Kết quả mở rương:</h3>";
    
    let index = 0;
    const showNextResult = () => {
        if (index < results.length) {
            ketQuaMoDiv.innerHTML += results[index].html;
            index++;
            setTimeout(showNextResult, 200);
        }
    };
    
    showNextResult();
}

// Kiểm tra điều kiện ghép tướng
function kiemTraGhepTuong() {
    const ketQuaMoDiv = document.getElementById("ketQuaMo");
    let existingGhepSection = document.querySelector('.ghep-tuong-section');
    
    if (existingGhepSection) {
        existingGhepSection.remove();
    }
    
    let ghepHTML = "";
    let canGhep = false;
    
    if (manhTuong.Takemasa >= 100) {
        ghepHTML += `<button onclick="ghepTuong('Takemasa')">Ghép Tướng Takemasa (${manhTuong.Takemasa}/100)</button>`;
        canGhep = true;
    }
    if (manhTuong.Ren >= 100) {
        ghepHTML += `<button onclick="ghepTuong('Ren')">Ghép Tướng Ren (${manhTuong.Ren}/100)</button>`;
        canGhep = true;
    }
    if (manhTuong.Shinya >= 100) {
        ghepHTML += `<button onclick="ghepTuong('Shinya')">Ghép Tướng Shinya (${manhTuong.Shinya}/100)</button>`;
        canGhep = true;
    }
    
    if (canGhep) {
        const ghepSection = document.createElement('div');
        ghepSection.className = 'ghep-tuong-section';
        ghepSection.innerHTML = `<h3>Ghép Tướng</h3>${ghepHTML}`;
        ketQuaMoDiv.appendChild(ghepSection);
    }
}

// Hàm ghép tướng
function ghepTuong(tenTuong) {
    if (manhTuong[tenTuong] >= 100) {
        manhTuong[tenTuong] -= 100;
        alert(`Chúc mừng! Bạn đã ghép thành công tướng ${tenTuong}!`);
        capNhat();
    } else {
        alert(`Không đủ mảnh để ghép tướng ${tenTuong}!`);
    }
}

// Sử dụng vật phẩm giảm thời gian
function suDungVatPham(tenVatPham) {
    if (vatPham[tenVatPham] <= 0) {
        alert(`Bạn không có ${tenVatPham}!`);
        return;
    }
    
    if (!dangRen) {
        alert("Không có quân nào đang được rèn!");
        return;
    }
    
    let giamPhut = 0;
    switch(tenVatPham) {
        case "Giảm 1 phút": giamPhut = 1; break;
        case "Giảm 5 phút": giamPhut = 5; break;
        case "Giảm 10 phút": giamPhut = 10; break;
        case "Giảm 30 phút": giamPhut = 30; break;
    }
    
    const giamGiay = giamPhut * 60;
    thoiGianCon = Math.max(0, thoiGianCon - giamGiay);
    vatPham[tenVatPham]--;
    
    alert(`Đã sử dụng ${tenVatPham}!`);
    capNhat();
}

// Khởi động game khi trang load xong
document.addEventListener('DOMContentLoaded', initGame);





