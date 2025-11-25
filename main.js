let soQuan = 0;
let ruong = 50;
let danhSachAnhHung = [];
let dangRen = false;
let thoiGianCon = 0;

// Danh sách anh hùng (tỷ lệ chuẩn game turn-base)
const bangAnhHung = [
  { ten: "Thần Kiếm Thánh Vương", tyLe: 0.3, cap: "Legendary" },
  { ten: "Hắc Long Đế", tyLe: 0.5, cap: "Legendary" },
  { ten: "Tử Thần Nữ Vương", tyLe: 0.7, cap: "Legendary" },
  { ten: "Phượng Hoàng Chiến Thần", tyLe: 1.0, cap: "Epic" },
  { ten: "Băng Phong Ma Nữ", tyLe: 1.5, cap: "Epic" },
  { ten: "Lôi Thần", tyLe: 2.0, cap: "Epic" },
  { ten: "Hiệp Khách Vô Danh", tyLe: 8.0, cap: "Rare" },
  { ten: "Chiến Binh", tyLe: 86.0, cap: "Common" }
];

function capNhat() {
  document.getElementById("soQuan").textContent = soQuan.toLocaleString();
  document.getElementById("ruong").textContent = ruong;
  document.getElementById("dsAnhHung").innerHTML = danhSachAnhHung.map(h => 
    `<div class="anhhung ${h.cap === 'Legendary' ? 'legendary' : ''}">
      <strong>${h.ten}</strong><br><small>${h.cap}</small>
    </div>`
  ).join("");
}

function demNguoc() {
  if (thoiGianCon <= 0) {
    dangRen = false;
    capNhat();
    return;
  }
  thoiGianCon--;
  const m = String(Math.floor(thoiGianCon / 60)).padStart(2, '0');
  const s = String(thoiGianCon % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${m}:${s}`;
  setTimeout(demNguoc, 1000);
}

function renQuan(so) {
  if (dangRen) return alert("Đang rèn quân rồi đại ca!");
  const phut = so / 10;
  thoiGianCon = phut * 60;
  dangRen = true;
  demNguoc();
  setTimeout(() => {
    soQuan += so;
    dangRen = false;
    document.getElementById("timer").textContent = "00:00";
    capNhat();
  }, thoiGianCon * 1000);
}

function moRuong(so) {
  if (ruong < so) return alert("Hết rương rồi đại ca ơi!");
  ruong -= so;
  let html = "";
  for (let i = 0; i < so; i++) {
    const rand = Math.random() * 100;
    let tong = 0;
    let ra = bangAnhHung[bangAnhHung.length - 1]; // default
    for (const ah of bangAnhHung) {
      tong += ah.tyLe;
      if (rand <= tong) { ra = ah; break; }
    }
    danhSachAnhHung.push(ra);
    if (ra.cap === "Legendary") {
      html += `<div style="color:#ff00ff; font-size:2em; animation: pulse 1s infinite;">✦ ${ra.ten} ✦</div>`;
    }
  }
  document.getElementById("ketQuaMo").innerHTML = html || "<div>Chỉ ra anh hùng thường...</div>";
  capNhat();
}

// Khởi động
capNhat();


