let player = { gems: 0 };
if (localStorage.getItem("rok_save")) {
  player = JSON.parse(localStorage.getItem("rok_save"));
  document.getElementById("gems").innerText = player.gems;
}

function openTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
  document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add("active");
}

function startBattle() {
  const g1 = document.getElementById("general1").value;
  const g2 = document.getElementById("general2").value;
  const t1 = parseInt(document.getElementById("troops1").value);
  const t2 = parseInt(document.getElementById("troops2").value);
  const log = document.getElementById("battleLog");
  log.innerHTML = `<span style="color:#ffd700">Trận đấu bắt đầu: ${g1.toUpperCase()} (${t1.toLocaleString()}) vs ${g2.toUpperCase()} (${t2.toLocaleString()})</span>\n`;

  setTimeout(() => {
    const winner = Math.random() > 0.5 ? g1 : g2;
    const reward = Math.floor(Math.random() * 3000) + 500;
    player.gems += reward;
    localStorage.setItem("rok_save", JSON.stringify(player));
    document.getElementById("gems").innerText = player.gems;

    log.innerHTML += `>>> ${winner.toUpperCase()} thắng!\n`;
    log.innerHTML += `Bạn nhận được ${reward} gems!\n`;
    log.innerHTML += "Trận đấu kết thúc.\n";
    log.scrollTop = log.scrollHeight;
  }, 2000);
}

