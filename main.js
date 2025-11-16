// ===== CLASS DEFINITIONS =====
class TrangBi {
    constructor(ten, sat_thuong, giap) {
        this.ten = ten;
        this.sat_thuong = sat_thuong;
        this.giap = giap;
    }
}

class NhanVat {
    constructor(ten, mau, sat_thuong_co_ban, giap_co_ban) {
        this.ten = ten;
        this.mau = mau;
        this.mau_toi_da = mau;
        this.sat_thuong_co_ban = sat_thuong_co_ban;
        this.giap_co_ban = giap_co_ban;
        this.trang_bi = null;
        this.cap_do = 1;
        
        // Hệ thống mới
        this.no = 0;
        this.max_no = 100;
        this.buff_sat_thuong_thuong = 0;
        this.buff_sat_thuong_phan_cong = 0;
    }
    
    get tong_sat_thuong() {
        let sat_thuong_co_so = this.sat_thuong_co_ban + (this.trang_bi ? this.trang_bi.sat_thuong : 0);
        return Math.floor(sat_thuong_co_so * (1 + this.buff_sat_thuong_thuong / 100));
    }
    
    get tong_sat_thuong_phan_cong() {
        let sat_thuong_co_so = this.sat_thuong_co_ban + (this.trang_bi ? this.trang_bi.sat_thuong : 0);
        let bonus_from_normal = this.buff_sat_thuong_thuong * 0.5;
        let total_bonus = bonus_from_normal + this.buff_sat_thuong_phan_cong;
        return Math.floor(sat_thuong_co_so * (1 + total_bonus / 100));
    }
    
    get tong_giap() {
        return this.giap_co_ban + (this.trang_bi ? this.trang_bi.giap : 0);
    }
    
    // Công thức giảm sát thương mới
    tinh_sat_thuong_thuc(atk) {
        let arm = this.tong_giap;
        let damage_taken = atk * (1 - (arm / (500 + arm)));
        return Math.max(1, Math.floor(damage_taken));
    }
    
    // Tấn công thường - Sát thương trắng
    tan_cong_thuong(muc_tieu) {
        let sat_thuong_goc = this.tong_sat_thuong;
        let sat_thuong = Math.floor(sat_thuong_goc * (0.8 + Math.random() * 0.4));
        let sat_thuong_thuc = muc_tieu.tinh_sat_thuong_thuc(sat_thuong);
        
        muc_tieu.mau -= sat_thuong_thuc;
        if (muc_tieu.mau < 0) muc_tieu.mau = 0;
        
        // Tích nộ từ tấn công thường
        let no_tich_duoc = Math.random() < 0.5 ? 10 : 20;
        this.no = Math.min(this.max_no, this.no + no_tich_duoc);
        
        addDamageLog(`⚪ <b>${this.ten}</b> tấn công thường<br>Gây <b>${sat_thuong_thuc}</b> sát thương<br>+${no_tich_duoc} Nộ`);
        
        updateDisplay();
        updateSkillButtons();
        return sat_thuong_thuc;
    }
    
    // Kỹ năng Trừng Phạt - tốn 100 nộ
    ky_nang_trung_phat(muc_tieu) {
        if (this.no < 100) {
            addDamageLog(`❌ <b>${this.ten}</b> không đủ 100 Nộ!`);
            return 0;
        }
        
        this.no -= 100;
        let sat_thuong_goc = this.tong_sat_thuong;
        let sat_thuong = Math.floor(sat_thuong_goc * (1.5 + Math.random() * 0.5));
        let sat_thuong_thuc = muc_tieu.tinh_sat_thuong_thuc(sat_thuong);
        
        muc_tieu.mau -= sat_thuong_thuc;
        if (muc_tieu.mau < 0) muc_tieu.mau = 0;
        
        addDamageLog(`💢 <b>${this.ten}</b> sử dụng TRỪNG PHẠT<br>Gây <b>${sat_thuong_thuc}</b> sát thương<br>-100 Nộ`);
        
        updateDisplay();
        updateSkillButtons();
        return sat_thuong_thuc;
    }
    
    // Kỹ năng Combo - tốn 100 nộ
    ky_nang_combo(muc_tieu) {
        if (this.no < 100) {
            addDamageLog(`❌ <b>${this.ten}</b> không đủ 100 Nộ!`);
            return 0;
        }
        
        this.no -= 100;
        let sat_thuong_goc = this.tong_sat_thuong;
        
        // Combo: 3 đòn tấn công
        let total_damage = 0;
        for (let i = 1; i <= 3; i++) {
            let sat_thuong = Math.floor(sat_thuong_goc * (0.4 + Math.random() * 0.3));
            let sat_thuong_thuc = muc_tieu.tinh_sat_thuong_thuc(sat_thuong);
            muc_tieu.mau -= sat_thuong_thuc;
            total_damage += sat_thuong_thuc;
        }
        
        if (muc_tieu.mau < 0) muc_tieu.mau = 0;
        
        addDamageLog(`🔄 <b>${this.ten}</b> sử dụng COMBO<br>Gây <b>${total_damage}</b> sát thương<br>-100 Nộ`);
        
        updateDisplay();
        updateSkillButtons();
        return total_damage;
    }
    
    // Kỹ năng Đặc Biệt - tốn 100 nộ
    ky_nang_dac_biet(muc_tieu) {
        if (this.no < 100) {
            addDamageLog(`❌ <b>${this.ten}</b> không đủ 100 Nộ!`);
            return 0;
        }
        
        this.no -= 100;
        let sat_thuong_goc = this.tong_sat_thuong;
        let sat_thuong = Math.floor(sat_thuong_goc * (2.0 + Math.random() * 0.5));
        
        // Kỹ năng bỏ qua 50% giáp
        let arm = muc_tieu.tong_giap;
        let effective_arm = Math.floor(arm * 0.5);
        let damage_taken = sat_thuong * (1 - (effective_arm / (500 + effective_arm)));
        let sat_thuong_thuc = Math.max(1, Math.floor(damage_taken));
        
        muc_tieu.mau -= sat_thuong_thuc;
        if (muc_tieu.mau < 0) muc_tieu.mau = 0;
        
        addDamageLog(`✨ <b>${this.ten}</b> sử dụng KỸ NĂNG<br>Gây <b>${sat_thuong_thuc}</b> sát thương<br>-100 Nộ`);
        
        updateDisplay();
        updateSkillButtons();
        return sat_thuong_thuc;
    }
    
    // Phản công
    phan_cong(muc_tieu) {
        let sat_thuong_goc = this.tong_sat_thuong_phan_cong;
        let sat_thuong = Math.floor(sat_thuong_goc * (0.8 + Math.random() * 0.4));
        let sat_thuong_thuc = muc_tieu.tinh_sat_thuong_thuc(sat_thuong);
        
        muc_tieu.mau -= sat_thuong_thuc;
        if (muc_tieu.mau < 0) muc_tieu.mau = 0;
        
        addDamageLog(`🛡️ <b>${this.ten}</b> phản công<br>Gây <b>${sat_thuong_thuc}</b> sát thương`, true);
        
        updateDisplay();
        return sat_thuong_thuc;
    }
    
    con_song() {
        return this.mau > 0;
    }
    
    hoi_mau() {
        let hoi_mau = randInt(50, 100);
        this.mau += hoi_mau;
        if (this.mau > this.mau_toi_da) this.mau = this.mau_toi_da;
        addDamageLog(`💚 <b>${this.ten}</b> hồi máu<br>Hồi +<b>${hoi_mau}</b> máu`);
        updateDisplay();
        return hoi_mau;
    }
    
    trang_thai() {
        let phan_tram_mau = (this.mau / this.mau_toi_da) * 100;
        let mau_color = phan_tram_mau > 70 ? "#51cf66" : phan_tram_mau > 30 ? "#fcc419" : "#ff6b6b";
        let no_color = this.no >= 100 ? "#ffd43b" : "#74c0fc";
        
        let trang_bi_info = this.trang_bi ? 
            `<div class="stat-item">🎒 <b>Trang bị:</b> ${this.trang_bi.ten}</div>
             <div class="stat-item">⚔️ +${this.trang_bi.sat_thuong} sát thương</div>
             <div class="stat-item">🛡️ +${this.trang_bi.giap} giáp</div>` : 
            "<div class='stat-item'>🎒 <b>Trang bị:</b> Không có</div>";
        
        return `
            <div class="stat-item"><b>${this.ten}</b> - Cấp ${this.cap_do}</div>
            <div class="stat-item">❤️ <b>Máu:</b> <span style="color:${mau_color}">${this.mau}/${this.mau_toi_da}</span> (${phan_tram_mau.toFixed(1)}%)</div>
            <div class="stat-item">🔥 <b>Nộ:</b> <span style="color:${no_color}">${this.no}/${this.max_no}</span></div>
            <div class="stat-item">⚔️ <b>Sát thương:</b> ${this.tong_sat_thuong}</div>
            <div class="stat-item">🛡️ <b>Giáp:</b> ${this.tong_giap}</div>
            ${trang_bi_info}
        `;
    }
}

// ===== UTILITY FUNCTIONS =====
function randInt(a, b) { 
    return Math.floor(Math.random() * (b - a + 1)) + a; 
}

function addDamageLog(msg, isPhanCong = false) {
    let damageLog = document.getElementById('damage-log');
    let cssClass = isPhanCong ? 'damage-entry-phancong' : 'damage-entry';
    damageLog.innerHTML = `<div class="${cssClass}">${msg}</div>` + damageLog.innerHTML;
    
    // Auto scroll to bottom
    damageLog.scrollTop = 0;
}

function clearLog() { 
    document.getElementById('damage-log').innerHTML = ""; 
}

function sleep(ms) { 
    return new Promise(r => setTimeout(r, ms)); 
}

// ===== GAME VARIABLES =====
let nguoi_choi, enemy, cap_do_hien_tai, so_quai_vat_da_tieu_diet, inBattle = true;

let mainMenuHtml = `
    <button onclick="chonHanhDong(1)">⚪ Tấn công thường</button>
    <button onclick="chonHanhDong(7)" id="trung-phat-btn">💢 Trừng phạt (100 nộ)</button>
    <button onclick="chonHanhDong(8)" id="combo-btn">🔄 Combo (100 nộ)</button>
    <button onclick="chonHanhDong(9)" id="ky-nang-btn">✨ Kỹ năng (100 nộ)</button>
    <button onclick="chonHanhDong(2)">💚 Hồi máu</button>
    <button onclick="chonHanhDong(6)">❌ Thoát game</button>
`;

// ===== GAME FUNCTIONS =====
function tao_quai_vat(cap_do) {
    let mau_co_ban = 1000 + (cap_do * 200);
    let sat_thuong_co_ban = 100 + (cap_do * 20);
    let giap_co_ban = 200 + (cap_do * 30);
    
    let ten_quai = arrRand(["Goblin", "Orc", "Skeleton", "Zombie", "Wolf"]);
    let quai_vat = new NhanVat(`${ten_quai} (Cấp ${cap_do})`, mau_co_ban, sat_thuong_co_ban, giap_co_ban);
    
    if (Math.random() < 0.5) {
        let trang_bi_quai = arrRand([
            new TrangBi("Răng nanh", 20, 0),
            new TrangBi("Da thú", 0, 30),
            new TrangBi("Móng vuốt", 30, 15)
        ]);
        quai_vat.trang_bi = trang_bi_quai;
    }
    return quai_vat;
}

function arrRand(arr) { 
    return arr[Math.floor(Math.random() * arr.length)]; 
}

// Khởi tạo game
function khoi_tao_game() {
    so_quai_vat_da_tieu_diet = 0;
    cap_do_hien_tai = 1;
    inBattle = true;
    
    nguoi_choi = new NhanVat("Anh hùng", 1000, 100, 200);
    nguoi_choi.trang_bi = new TrangBi("Kiếm gỗ", 30, 0);
    nguoi_choi.cap_do = 1;
    
    enemy = null;
    clearLog();
    document.getElementById('restart-btn').style.display = "none";
    
    addDamageLog(`🎮 <b>BẮT ĐẦU CUỘC PHIÊU LƯU MỚI!</b><br>🔥 <b>Hệ thống Nộ:</b> Tích nộ để sử dụng kỹ năng!`);
    tao_quai_va_chien();
}

async function tao_quai_va_chien() {
    enemy = tao_quai_vat(cap_do_hien_tai);
    addDamageLog(`🔥 <b>${enemy.ten}</b> xuất hiện!`);
    updateDisplay();
    await startBattle();
}

async function startBattle() {
    let luot_choi = 0;
    updateDisplay();
    inBattle = true;
    document.getElementById('menu').innerHTML = mainMenuHtml;
    updateSkillButtons();
    
    while (nguoi_choi.con_song() && enemy.con_song() && inBattle) {
        luot_choi++;
        document.getElementById("status").innerHTML = `🌀 <b>Lượt ${luot_choi}</b>`;
        window.choHanhDong = false;
        
        await waitForHanhDong();
        if (!nguoi_choi.con_song() || !enemy.con_song() || !inBattle) break;
        
        // Enemy turn
        document.getElementById("status").innerHTML = `👹 <b>Lượt của ${enemy.ten}</b>`;
        await sleep(1000);
        
        enemy.tan_cong_thuong(nguoi_choi);
        
        updateDisplay();
        updateSkillButtons();
        await sleep(1000);
    }
    
    setTimeout(checkEndBattle, 500);
}

// Cập nhật trạng thái nút kỹ năng
function updateSkillButtons() {
    const canUseSkill = nguoi_choi.no >= 100;
    document.getElementById('trung-phat-btn').disabled = !canUseSkill;
    document.getElementById('combo-btn').disabled = !canUseSkill;
    document.getElementById('ky-nang-btn').disabled = !canUseSkill;
    
    if (!canUseSkill) {
        document.getElementById('trung-phat-btn').title = "Cần 100 nộ";
        document.getElementById('combo-btn').title = "Cần 100 nộ";
        document.getElementById('ky-nang-btn').title = "Cần 100 nộ";
    } else {
        document.getElementById('trung-phat-btn').title = "";
        document.getElementById('combo-btn').title = "";
        document.getElementById('ky-nang-btn').title = "";
    }
}

window.chonHanhDong = chonHanhDong;

function chonHanhDong(i) {
    if (!nguoi_choi.con_song() || !enemy.con_song() || !inBattle) return;
    
    switch (i) {
        case 1:
            nguoi_choi.tan_cong_thuong(enemy);
            // 30% cơ hội phản công
            if (enemy.con_song() && Math.random() < 0.3) {
                enemy.phan_cong(nguoi_choi);
            }
            checkEnemyDead();
            break;
        case 7:
            nguoi_choi.ky_nang_trung_phat(enemy);
            if (enemy.con_song() && Math.random() < 0.3) {
                enemy.phan_cong(nguoi_choi);
            }
            checkEnemyDead();
            break;
        case 8:
            nguoi_choi.ky_nang_combo(enemy);
            if (enemy.con_song() && Math.random() < 0.3) {
                enemy.phan_cong(nguoi_choi);
            }
            checkEnemyDead();
            break;
        case 9:
            nguoi_choi.ky_nang_dac_biet(enemy);
            if (enemy.con_song() && Math.random() < 0.3) {
                enemy.phan_cong(nguoi_choi);
            }
            checkEnemyDead();
            break;
        case 2:
            nguoi_choi.hoi_mau();
            break;
        case 6:
            inBattle = false;
            endGame();
            break;
    }
    window.choHanhDong = true;
}

function waitForHanhDong() {
    return new Promise(r => {
        function check() {
            if (window.choHanhDong || !nguoi_choi.con_song() || !enemy.con_song() || !inBattle) return r();
            setTimeout(check, 50);
        } 
        check();
    });
}

function checkEnemyDead() {
    if (!enemy.con_song()) {
        so_quai_vat_da_tieu_diet++;
        addDamageLog(`🎉 <b>Bạn đã đánh bại ${enemy.ten}!</b>`);
        
        // Trang bị mới 
        if (Math.random() < 0.3) {
            let trang_bi_moi = arrRand([
                new TrangBi("Kiếm sắt", 50, 0),
                new TrangBi("Áo giáp sắt", 0, 40),
                new TrangBi("Khiên gỗ", 10, 30),
                new TrangBi("Rìu chiến", 60, 10)
            ]);
            nguoi_choi.trang_bi = trang_bi_moi;
            addDamageLog(`💎 <b>Bạn nhận được trang bị mới!</b><br>🎒 ${trang_bi_moi.ten}`);
        }
        
        // Lên cấp mỗi 3 quái
        if (so_quai_vat_da_tieu_diet % 3 === 0) {
            cap_do_hien_tai++;
            nguoi_choi.cap_do++;
            nguoi_choi.mau_toi_da += 100;
            nguoi_choi.mau = nguoi_choi.mau_toi_da;
            nguoi_choi.sat_thuong_co_ban += 20;
            nguoi_choi.giap_co_ban += 15;
            addDamageLog(`🎊 <b>Bạn đã lên cấp ${nguoi_choi.cap_do}!</b>`);
        }
    }
}

function checkEndBattle() {
    if (!nguoi_choi.con_song()) {
        endGame();
    } else if (!enemy.con_song()) {
        setTimeout(tao_quai_va_chien, 1500);
    }
}

function endGame() {
    document.getElementById('menu').innerHTML = "";
    document.getElementById("status").innerHTML = "";
    let res = "";
    
    if (!nguoi_choi.con_song()) {
        res = `💀 <b>Bạn đã bị đánh bại...</b><br><br>
               🎯 <b>Số quái vật đã tiêu diệt:</b> ${so_quai_vat_da_tieu_diet}<br>
               🏆 <b>Cấp độ đạt được:</b> ${nguoi_choi.cap_do}`;
    } else {
        res = `🎉 <b>CHIẾN THẮNG!</b><br><br>
               🎯 <b>Số quái vật đã tiêu diệt:</b> ${so_quai_vat_da_tieu_diet}<br>
               🏆 <b>Cấp độ đạt được:</b> ${nguoi_choi.cap_do}`;
    }
    
    addDamageLog(`<hr style="margin:10px 0; border: 1px solid #555">${res}<hr style="margin:10px 0; border: 1px solid #555">`);
    document.getElementById('restart-btn').style.display = "block";
}

function updateDisplay() {
    document.getElementById('player-stats').innerHTML = nguoi_choi ? nguoi_choi.trang_thai() : '';
    document.getElementById('enemy-stats').innerHTML = enemy ? enemy.trang_thai() : '';
}

// Khởi động game khi trang load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('restart-btn').onclick = khoi_tao_game;
    khoi_tao_game();
});
