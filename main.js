// == Class Definitions ==
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
  }
  get tong_sat_thuong() {
    return this.sat_thuong_co_ban + (this.trang_bi ? this.trang_bi.sat_thuong : 0);
  }
  get tong_giap() {
    return this.giap_co_ban + (this.trang_bi ? this.trang_bi.giap : 0);
  }
  tan_cong(muc_tieu) {
    let sat_thuong_goc = this.tong_sat_thuong;
    let sat_thuong = Math.floor(sat_thuong_goc * (0.8 + Math.random()*0.4));
    let giap_muc_tieu = muc_tieu.tong_giap;
    let sat_thuong_thuc = Math.max(1, sat_thuong - giap_muc_tieu);
    muc_tieu.mau -= sat_thuong_thuc;
    if (muc_tieu.mau < 0) muc_tieu.mau = 0;
    addLog(`🎯 <b>${this.ten}</b> tấn công <b>${muc_tieu.ten}</b>!<br>
    Sát thương: <b>${sat_thuong_goc}</b> - Giáp <b>${giap_muc_tieu}</b> = <b>${sat_thuong_thuc}</b> sát thương thực!`);
    updateDisplay();
    return sat_thuong_thuc;
  }
  hoi_mau() {
    let hoi_mau = randInt(10, 20);
    this.mau += hoi_mau;
    if (this.mau > this.mau_toi_da) this.mau = this.mau_toi_da;
    addLog(`💚 <b>${this.ten}</b> hồi <b>${hoi_mau}</b> máu!`);
    updateDisplay();
    return hoi_mau;
  }
  con_song() {
    return this.mau > 0;
  }
  trang_thai() {
    let phan_tram_mau = (this.mau / this.mau_toi_da) * 100;
    let trang_bi_info = "";
    if (this.trang_bi)
      trang_bi_info = `<br>🎒 Trang bị: ${this.trang_bi.ten} (+${this.trang_bi.sat_thuong} sát thương, +${this.trang_bi.giap} giáp)`;
    return `${this.ten} - Cấp ${this.cap_do}<br>
    ❤️ Máu: ${this.mau}/${this.mau_toi_da} (${phan_tram_mau.toFixed(1)}%)<br>
    ⚔️ Sát thương: ${this.tong_sat_thuong} (Cơ bản: ${this.sat_thuong_co_ban})<br>
    🛡️ Giáp: ${this.tong_giap} (Cơ bản: ${this.giap_co_ban})${trang_bi_info}`;
  }
  chi_so_co_ban() {
    return `<b>${this.ten} - Chỉ số cơ bản</b><br>
    Cấp độ: ${this.cap_do}<br>
    Máu cơ bản: ${this.mau_toi_da}<br>
    Sát thương cơ bản: ${this.sat_thuong_co_ban}<br>
    Giáp cơ bản: ${this.giap_co_ban}${
    this.trang_bi ?
      `<br><br>🎒 Trang bị:<br>
        Tên: ${this.trang_bi.ten}<br>
        Sát thương: +${this.trang_bi.sat_thuong}<br>
        Giáp: +${this.trang_bi.giap}`
    : ''}
    <br><br><b>Tổng chỉ số:</b><br>
    Tổng sát thương: ${this.tong_sat_thuong}<br>
    Tổng giáp: ${this.tong_giap}`;
  }
}

// == Logic and UI ==
// Utility
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function addLog(msg) {
  let log = document.getElementById('log');
  log.innerHTML = msg + "<br>" + log.innerHTML;
}
function clearLog() { document.getElementById('log').innerHTML = ""; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let nguoi_choi, enemy, cap_do_hien_tai, so_quai_vat_da_tieu_diet, inBattle = true;
let ao_da = new TrangBi("Áo da", 0, 2); // để quay lại khi cần
let mainMenuHtml = `
  <button onclick="chonHanhDong(1)">⚔️ Tấn công</button>
  <button onclick="chonHanhDong(2)">💚 Hồi máu</button>
  <button onclick="chonHanhDong(3)">🛡️ Xem trạng thái</button>
  <button onclick="chonHanhDong(4)">📊 Xem chỉ số bản thân</button>
  <button onclick="chonHanhDong(5)">👹 Xem chỉ số quái vật</button>
  <button onclick="chonHanhDong(6)">❌ Thoát game</button>
`;

function tao_quai_vat(cap_do) {
  let mau_co_ban = 60 + (cap_do * 10);
  let sat_thuong_co_ban = 8 + (cap_do * 2);
  let giap_co_ban = 2 + cap_do;
  let ten_quai = arrRand(["Goblin", "Orc", "Skeleton", "Zombie", "Wolf"]);
  let quai_vat = new NhanVat(`${ten_quai} (Cấp ${cap_do})`, mau_co_ban, sat_thuong_co_ban, giap_co_ban);
  if (Math.random() < 0.5) {
    let trang_bi_quai = arrRand([
      new TrangBi("Răng nanh", 2, 0),
      new TrangBi("Da thú", 0, 2),
      new TrangBi("Móng vuốt", 3, 1)
    ]);
    quai_vat.trang_bi = trang_bi_quai;
  }
  return quai_vat;
}
function arrRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Init game
function khoi_tao_game() {
  so_quai_vat_da_tieu_diet = 0;
  cap_do_hien_tai = 1;
  inBattle = true;
  nguoi_choi = new NhanVat("Anh hùng", 100, 12, 3);
  nguoi_choi.trang_bi = new TrangBi("Kiếm gỗ", 3, 0);
  nguoi_choi.cap_do = 1;
  enemy = null;
  clearLog();
  document.getElementById('restart-btn').style.display = "none";
  addLog(`⚔️ <b>TRANG BỊ BAN ĐẦU</b>:<br>Vũ khí: Kiếm gỗ (+3 sát thương)<br>Giáp: Áo da (+2 giáp)`);
  tao_quai_va_chien();
}

async function tao_quai_va_chien() {
  enemy = tao_quai_vat(cap_do_hien_tai);
  addLog(`🔥 <b>${enemy.ten}</b> xuất hiện!`);
  updateDisplay();
  await startBattle();
}

async function startBattle() {
  let luot_choi = 0;
  updateDisplay();
  inBattle = true;
  document.getElementById('menu').innerHTML = mainMenuHtml;
  while (nguoi_choi.con_song() && enemy.con_song() && inBattle) {
    luot_choi++;
    document.getElementById("status").innerHTML = `🌀 Lượt ${luot_choi}`;
    window.choHanhDong = false; // reset flag
    await waitForHanhDong();
    if (!nguoi_choi.con_song() || !enemy.con_song() || !inBattle) break;
    // Enemy turn
    document.getElementById("status").innerHTML = `--- Lượt của ${enemy.ten} ---`;
    await sleep(700);
    if (Math.random() < 0.7 || enemy.mau > enemy.mau_toi_da * 0.5) enemy.tan_cong(nguoi_choi);
    else enemy.hoi_mau();
    updateDisplay();
    await sleep(700);
  }
  // End battle
  setTimeout(checkEndBattle, 300);
}

window.chonHanhDong = chonHanhDong;
function chonHanhDong(i) {
  if (!nguoi_choi.con_song() || !enemy.con_song() || !inBattle) return;
  switch (i) {
    case 1:
      nguoi_choi.tan_cong(enemy);
      checkEnemyDead();
      break;
    case 2:
      nguoi_choi.hoi_mau();
      break;
    case 3:
      alert(nguoi_choi.trang_thai().replaceAll("<br>", "\n"));
      break;
    case 4:
      alert(nguoi_choi.chi_so_co_ban().replaceAll("<br>", "\n"));
      break;
    case 5:
      alert(enemy.chi_so_co_ban().replaceAll("<br>", "\n"));
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
    } check();
  });
}
function checkEnemyDead() {
  if (!enemy.con_song()) {
    so_quai_vat_da_tieu_diet++;
    addLog(`🎉 Bạn đã đánh bại <b>${enemy.ten}</b>!<hr style="margin:4px"> 
    <b>Chỉ số đã bị đánh bại:</b> Sát thương: ${enemy.sat_thuong_co_ban}, Giáp: ${enemy.giap_co_ban}
    ${enemy.trang_bi ? `<br>Trang bị: ${enemy.trang_bi.ten}` : ''}`);
    // Trang bị mới 
    if (Math.random() < 0.3) {
      let trang_bi_moi = arrRand([
        new TrangBi("Kiếm sắt", 5, 0),
        new TrangBi("Áo giáp sắt", 0, 4),
        new TrangBi("Khiên gỗ", 1, 3),
        new TrangBi("Rìu chiến", 6, 1)
      ]);
      nguoi_choi.trang_bi = trang_bi_moi;
      addLog(`💎 Bạn nhận được: <b>${trang_bi_moi.ten}</b>!<br>+${trang_bi_moi.sat_thuong} sát thương, +${trang_bi_moi.giap} giáp`);
    }
    // Lên cấp mỗi 3 quái
    if (so_quai_vat_da_tieu_diet % 3 === 0) {
      cap_do_hien_tai++;
      nguoi_choi.cap_do++;
      nguoi_choi.mau_toi_da += 10;
      nguoi_choi.mau = nguoi_choi.mau_toi_da;
      nguoi_choi.sat_thuong_co_ban += 2;
      nguoi_choi.giap_co_ban += 1;
      addLog(`🎊 <b>Bạn đã lên cấp ${nguoi_choi.cap_do}!</b><br>+10 máu, +2 sát thương cơ bản, +1 giáp cơ bản`);
    }
  }
}
function checkEndBattle() {
  if (!nguoi_choi.con_song()) {
    endGame();
  } else if (!enemy.con_song()) {
    setTimeout(tao_quai_va_chien, 1300);
  }
}
function endGame() {
  document.getElementById('menu').innerHTML = "";
  document.getElementById("status").innerHTML = "";
  let res = "";
  if (!nguoi_choi.con_song())
    res = `💀 <b>Bạn đã bị đánh bại...</b><br>
           Số quái vật đã tiêu diệt: <b>${so_quai_vat_da_tieu_diet}</b>`;
  else
    res = `🎉 <b>CHIẾN THẮNG!</b> Bạn đã tiêu diệt <b>${so_quai_vat_da_tieu_diet}</b> quái vật!<br>
           🏆 Cấp độ đạt được: <b>${nguoi_choi.cap_do}</b><br>
           <b>Chỉ số cuối:</b><br>
           Sát thương cơ bản: ${nguoi_choi.sat_thuong_co_ban}, Giáp cơ bản: ${nguoi_choi.giap_co_ban}`;
  addLog(`<hr>${res}<hr>`);
  document.getElementById('restart-btn').style.display = "";
}
document.getElementById('restart-btn').onclick = khoi_tao_game;

function updateDisplay() {
  document.getElementById('player-stats').innerHTML = nguoi_choi ? nguoi_choi.trang_thai() : '';
  document.getElementById('enemy-stats').innerHTML = enemy ? enemy.trang_thai() : '';
}

// Khởi động
khoi_tao_game();