function loadPage(page) {
  const title = document.getElementById("page-title");
  const content = document.getElementById("content");

  document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
  event.target.classList.add("active");

  switch(page) {
    case "dashboard":
      title.innerText = "Dashboard";
      content.innerHTML = `
        <div class="card">
          <h3>Welcome</h3>
          <p>Sistem Pass Kendaraan & Izin Keluar</p>
        </div>
      `;
      break;

    case "izin":
      title.innerText = "Izin Keluar";
      content.innerHTML = `
        <div class="card">
          <h3>Form Izin Keluar</h3>
          <form onsubmit="submitIzin(event)">
            <label>Nama</label><br>
            <input type="text" id="namaIzin" required><br><br>
            
            <label>Alasan</label><br>
            <input type="text" id="alasanIzin" required><br><br>
            
            <button type="submit">Ajukan</button>
          </form>
        </div>
      `;
      break;

    case "kendaraan":
      title.innerText = "Pass Kendaraan";
      content.innerHTML = `
        <div class="card">
          <h3>Form Pass Kendaraan</h3>
          <form onsubmit="submitKendaraan(event)">
            <label>No. Polisi</label><br>
            <input type="text" id="nopol" required><br><br>
            
            <label>Keperluan</label><br>
            <input type="text" id="keperluan" required><br><br>
            
            <button type="submit">Ajukan</button>
          </form>
        </div>
      `;
      break;

    case "laporan":
      title.innerText = "Laporan";
      content.innerHTML = `
        <div class="card">
          <h3>Data Pengajuan</h3>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Jenis</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="laporanData">
              <tr><td colspan="4">Belum ada data</td></tr>
            </tbody>
          </table>
        </div>
      `;
      break;

    case "setting":
      title.innerText = "Setting";
      content.innerHTML = `
        <div class="card">
          <h3>Pengaturan</h3>
          <p>Atur role, user, dan konfigurasi aplikasi.</p>
        </div>
      `;
      break;
  }
}

function submitIzin(e) {
  e.preventDefault();
  alert("Izin berhasil diajukan!");
}

function submitKendaraan(e) {
  e.preventDefault();
  alert("Pass kendaraan berhasil diajukan!");
}

function logout() {
  alert("Logout berhasil!");
  window.location.reload();
}

// default load dashboard
window.onload = () => loadPage("dashboard");
