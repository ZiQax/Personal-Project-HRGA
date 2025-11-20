// ========================= Book.js (Full Fixed Version) ========================= //
// Load data saat halaman siap
window.addEventListener("DOMContentLoaded", () => {
  // default page & limit
  currentPage = 1;
  currentLimit = 10;
  loadFromApi(currentPage, currentLimit);
});

// ------------------------- Global state & helper -------------------------
let currentPage = 1;
let currentLimit = 10;
let totalPages = 1;

function formatTanggal(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");
  return `${d}-${m}-${y} ${h}:${min}:${sec}`;
}

function safeQuery(selector) {
  return document.querySelector(selector);
}

// Normalizer: konversi result API ke array data
function normalizeResult(result) {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.result?.data)) return result.result.data;
  // fallback: ambil values yang nampak seperti row (objek dengan id)
  return Object.values(result).filter((v) => v && typeof v === "object" && (v.id || v.user_id));
}

// ------------------------- Modal Stats (Pending/Approved/Rejected) -------------------------
function modalStats(message, data = []) {
  const modalStatus = safeQuery("#modalSts");
  const modalPesan = safeQuery("#modal-message");
  const modalTableContainer = safeQuery("#modal-table");
  if (!modalStatus || !modalPesan || !modalTableContainer) {
    console.warn("modalStats: elemen modal tidak lengkap");
    return;
  }

  modalPesan.textContent = message || "";
  modalTableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.id = "modalTable";
  table.innerHTML = `
    <thead>
      <tr>
        <th>NIK</th>
        <th>Alasan</th>
        <th>Status</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (it) => `
        <tr>
          <td>${it.user_id || ""}</td>
          <td>${it.alasan || ""}</td>
          <td>${it.status || ""}</td>
          <td>${formatTanggal(it.created_at)}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  `;
  modalTableContainer.appendChild(table);
  modalStatus.classList.remove("hidden");
}

// close modal stats
const closeModalStatsBtn = safeQuery("#close-modal");
if (closeModalStatsBtn) closeModalStatsBtn.addEventListener("click", () => {
  const modal = safeQuery("#modalSts");
  if (modal) modal.classList.add("hidden");
});

// helper load status endpoints
async function loadStatus(url) {
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || res.statusText || "Gagal");
    modalStats(json.message || "Status", normalizeResult(json));
  } catch (err) {
    modalStats(err.message || "Error", []);
    console.error(err);
  }
}

// status buttons
const pendingBtn = safeQuery("#pending-button");
if (pendingBtn) pendingBtn.addEventListener("click", () => loadStatus("http://localhost:3000/api/izin/log/pending"));

const approvedBtn = safeQuery("#approved-button");
if (approvedBtn) approvedBtn.addEventListener("click", () => loadStatus("http://localhost:3000/api/izin/log/approved"));

const rejectedBtn = safeQuery("#rejected-button");
if (rejectedBtn) rejectedBtn.addEventListener("click", () => loadStatus("http://localhost:3000/api/izin/log/rejected"));

// ------------------------- Auth & UI small features -------------------------
const token = localStorage.getItem("token");
const user = (() => {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
})();

if (!token || !user) {
  // redirect to login if missing
  window.location.href = "login.html";
} else {
  const namU = safeQuery("#nam-u");
  const emailU = safeQuery("#email-u");
  if (namU) namU.textContent = `NIK : ${user.nik || ""}`;
  if (emailU) emailU.textContent = `username : ${user.username || ""}`;
}

const logoutBtn = safeQuery("#logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

// sidebar/profile quick toggles (safe if elements exist)
const toggleBtn = safeQuery("#menbtn");
const sidebar = safeQuery(".menu");
if (toggleBtn && sidebar) {
  toggleBtn.addEventListener("mouseover", () => {
    document.body.classList.toggle("sidebar-open");
    sidebar.classList.toggle("tutup");
  });
  sidebar.addEventListener("mouseleave", () => {
    document.body.classList.remove("sidebar-open");
    sidebar.classList.add("tutup");
  });
}

const foto = safeQuery("#iamge");
const profile = safeQuery(".ui");
if (foto && profile) {
  foto.addEventListener("click", (e) => {
    e.stopPropagation();
    profile.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!profile.contains(e.target) && !foto.contains(e.target)) profile.classList.remove("active");
  });
}

// ------------------------- Update status counters -------------------------
function updateStatusCounters() {
  let pending = 0, approved = 0, rejected = 0;
  document.querySelectorAll("td.status").forEach(cell => {
    const s = cell.textContent.trim();
    if (s === "Menunggu Persetujuan") pending++;
    else if (s === "Disetujui") approved++;
    else if (s === "Ditolak") rejected++;
  });
  const pEl = safeQuery("#pending-count"), aEl = safeQuery("#approved-count"), rEl = safeQuery("#rejected-count");
  if (pEl) pEl.textContent = pending;
  if (aEl) aEl.textContent = approved;
  if (rEl) rEl.textContent = rejected;
}

// ------------------------- Add menu small popup -------------------------
const tmbh = safeQuery(".tmbh");
if (tmbh) {
  tmbh.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.querySelector(".cont-add")) return;
    const contAdd = document.createElement("div");
    contAdd.className = "cont-add";
    contAdd.innerHTML = `
      <div class="list-add">
        <ul>
          <li>Izin Keluar</li>
          <li>Peminjaman</li>
          <li>Service Support</li>
        </ul>
      </div>`;
    document.body.appendChild(contAdd);
    // remove on outside click
    const handleOutside = (ev) => {
      if (!contAdd.contains(ev.target)) {
        contAdd.remove();
        document.removeEventListener("click", handleOutside);
      }
    };
    document.addEventListener("click", handleOutside);
  });
}

// ------------------------- Date filter button -------------------------
const btnCar = safeQuery("#btn-car");
if (btnCar) {
  btnCar.addEventListener("click", () => {
    const startVal = safeQuery("#start-date")?.value;
    const endVal = safeQuery("#end-date")?.value;
    if (!startVal || !endVal) return alert("Please select start and end date");
    const startDate = new Date(startVal);
    const endDate = new Date(endVal);
    document.querySelectorAll("table tbody tr").forEach(row => {
      const text = row.querySelector("td.date")?.textContent?.trim();
      if (!text) { row.style.display = "none"; return; }
      const parts = text.includes("-") ? text.split("-") : text.split("/");
      // try parse day-month-year or dd-mm-yyyy
      let d, m, y;
      if (parts.length >= 3) {
        [d, m, y] = parts;
      } else {
        row.style.display = "none";
        return;
      }
      const dateObj = new Date(`${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
      row.style.display = (dateObj >= startDate && dateObj <= endDate) ? "" : "none";
    });
  });
}

// ------------------------- Search -------------------------
const srcBtn = safeQuery("#btnsrc");
if (srcBtn) {
  srcBtn.addEventListener("click", () => {
    const keyword = (safeQuery("#search")?.value || "").toLowerCase();
    document.querySelectorAll(".table tbody tr").forEach(row => {
      const nameCell = row.querySelector("td.date");
      if (!nameCell) return row.style.display = "none";
      const txt = nameCell.textContent.toLowerCase();
      row.style.display = txt.includes(keyword) ? "" : "none";
    });
  });
}

// ------------------------- Sorting clickable on table headers -------------------------
(function setupSorting() {
  const headers = document.querySelectorAll("thead tr th");
  let currentShortIndex = null;
  let isAsc = true;
  headers.forEach((th, i) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      // toggle
      if (currentShortIndex === i) isAsc = !isAsc;
      else { currentShortIndex = i; isAsc = true; }
      headers.forEach(h => h.classList.remove("ats","asc"));
      th.classList.add("ats");
      if (!isAsc) th.classList.add("asc");

      const rows = Array.from(document.querySelectorAll("tbody tr"));
      rows.sort((a,b) => {
        const aText = (a.querySelectorAll("td")[i]?.textContent || "").trim();
        const bText = (b.querySelectorAll("td")[i]?.textContent || "").trim();
        const aDate = parseTanggal(aText);
        const bDate = parseTanggal(bText);
        if (!isNaN(aDate) && !isNaN(bDate)) return isAsc ? aDate - bDate : bDate - aDate;
        const aNum = parseFloat(aText.replace(/[^\d.-]/g,""));
        const bNum = parseFloat(bText.replace(/[^\d.-]/g,""));
        if (!isNaN(aNum) && !isNaN(bNum)) return isAsc ? aNum - bNum : bNum - aNum;
        return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });
      const tbody = safeQuery("tbody");
      rows.forEach(r => tbody.appendChild(r));
      // highlight column
      document.querySelectorAll("tbody td").forEach(td => td.classList.remove("ats"));
      document.querySelectorAll("tbody tr").forEach(row => {
        const cell = row.querySelectorAll("td")[i];
        if (cell) cell.classList.add("ats");
      });
    });
  });
})();

function parseTanggal(text) {
  if (!text) return NaN;
  // accept dd/mm/yyyy or dd-mm-yyyy or locale date
  const parts = text.includes("/") ? text.split("/") : text.includes("-") ? text.split("-") : null;
  if (!parts || parts.length < 3) return NaN;
  const [day, month, year] = parts;
  return new Date(`${year}-${month.padStart(2,"0")}-${day.padStart(2,"0")}`).getTime();
}

// ------------------------- Pagination dropdown (limit) -------------------------
const dropBtn = safeQuery("#updown");
const dropUpMenu = safeQuery("#dropUpMenu");
if (dropBtn && dropUpMenu) {
  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropUpMenu.classList.toggle("show");
  });
  // close on outside click
  document.addEventListener("click", (e) => {
    if (!dropUpMenu.contains(e.target) && !dropBtn.contains(e.target)) dropUpMenu.classList.remove("show");
  });
}
// page-srt elements
document.querySelectorAll(".page-srt").forEach(el => {
  el.addEventListener("click", (ev) => {
    ev.preventDefault();
    const val = parseInt(el.textContent, 10);
    if (!isNaN(val) && val > 0) {
      currentLimit = val;
      currentPage = 1;
      loadFromApi(currentPage, currentLimit);
    }
    dropUpMenu?.classList.remove("show");
  });
});

// ------------------------- Main: loadFromApi with full pagination buttons -------------------------
async function loadFromApi(page = 1, limit = 10) {
  try {
    // ensure state
    currentPage = page;
    currentLimit = limit;

    const url = `http://localhost:3000/api/izin/log/pagination?page=${page}&limit=${limit}`;
    const response = await fetch(url);
    const result = await response.json();
    console.log("API result:", result);

    if (!response.ok) {
      // try message
      throw new Error(result.message || response.statusText || "Gagal memuat");
    }

    // normalize data
    const data = normalizeResult(result);
    // find pagination meta if any
    totalPages = result.totalPages || result.pagination?.totalPages || Math.max(1, Math.ceil((result.total || data.length || 0) / limit));
    const apiCurrentPage = result.currentPage || result.pagination?.currentPage || page;
    // render table rows
    const tbody = safeQuery(".table tbody");
    if (!tbody) { console.error("Tidak menemukan <tbody>"); return; }
    tbody.innerHTML = "";

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="9">Data tidak ditemukan</td></tr>`;
    } else {
      data.forEach(item => {
        const tr = document.createElement("tr");
        const date = new Date(item.created_at);
        const formattedDate = isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID");
        tr.innerHTML = `
          <td class="date">${formattedDate}</td>
          <td class="name">${item.user_id || ""}</td>
          <td class="departement">${item.departement || ""}</td>
          <td class="section">${item.section || ""}</td>
          <td class="position">${item.position || ""}</td>
          <td class="alasan">${item.alasan || ""}</td>
          <td class="status">${item.status || ""}</td>
          <td><input type="checkbox" class="centang"></td>
          <td>
            <a href="#" class="edit"><i class="fa-regular fa-pen-to-square"></i></a>
            <button type="button" class="hapus" disabled><i class="fa-regular fa-trash-can"></i></button>
          </td>
        `;

        // handlers for checkbox, delete, edit
        const checkbox = tr.querySelector(".centang");
        const deleteBtn = tr.querySelector(".hapus");
        const editBtn = tr.querySelector(".edit");

        if (checkbox && deleteBtn) {
          checkbox.addEventListener("change", () => deleteBtn.disabled = !checkbox.checked);
          deleteBtn.addEventListener("click", async () => {
            if (!checkbox.checked) return alert("Pilih dulu dahulu");
            try {
              await fetch(`http://localhost:3000/api/izin/log/${item.id}`, { method: "DELETE" });
              tr.remove();
              updateStatusCounters();
            } catch (err) {
              console.error(err);
              alert("Gagal menghapus");
            }
          });
        }

        if (editBtn) {
          editBtn.addEventListener("click", () => openEditModal(item, tr));
        }

        tbody.appendChild(tr);
      });
    }

    // render pagination UI (1 2 3 ... with prev/next/first/last)
    renderPagination(apiCurrentPage, totalPages);
    updateStatusCounters();
  } catch (err) {
    console.error("loadFromApi error:", err);
    const tbody = safeQuery(".table tbody");
    if (tbody) tbody.innerHTML = `<tr><td colspan="9">Gagal memuat data</td></tr>`;
  }
}

function renderPagination(current, total) {
  const container = safeQuery(".pgnt") || safeQuery("#pagination");
  if (!container) {
    console.warn("renderPagination: container .pagination tidak ditemukan");
    return;
  }
  container.innerHTML = "";

  function makeBtn(label, disabled, cb, active = false) {
    const b = document.createElement("button");
    b.textContent = label;
    if (disabled) b.disabled = true;
    if (active) b.classList.add("act-pgn");
    b.addEventListener("click", cb);
    return b;
  }

  container.appendChild(makeBtn("<<", current === 1, () => { currentPage = 1; loadFromApi(1, currentLimit); }));
  container.appendChild(makeBtn("<", current === 1, () => { if (current > 1) { currentPage = current - 1; loadFromApi(currentPage, currentLimit); } }));

  // logic to show page window (like show 1..5 or sliding) — simple version: show all pages but cap if too many
  const MAX_BUTTONS = 9; // change to control how many number buttons shown
  let start = 1;
  let end = total;
  if (total > MAX_BUTTONS) {
    const side = Math.floor(MAX_BUTTONS / 2);
    start = Math.max(1, current - side);
    end = Math.min(total, start + MAX_BUTTONS - 1);
    if (end - start + 1 < MAX_BUTTONS) start = Math.max(1, end - MAX_BUTTONS + 1);
  }
  if (start > 1) {
    container.appendChild(makeBtn("1", false, () => { loadFromApi(1, currentLimit); }));
    if (start > 2) {
      const dots = document.createElement("span"); dots.textContent = "..."; dots.className = "dots"; container.appendChild(dots);
    }
  }

  for (let i = start; i <= end; i++) {
    container.appendChild(makeBtn(i, false, () => { currentPage = i; loadFromApi(i, currentLimit); }, i === current));
  }

  if (end < total) {
    if (end < total - 1) {
      const dots2 = document.createElement("span"); dots2.textContent = "..."; dots2.className = "dots"; container.appendChild(dots2);
    }
    container.appendChild(makeBtn(total, false, () => { loadFromApi(total, currentLimit); }));
  }

  container.appendChild(makeBtn(">", current === total, () => { if (current < total) { currentPage = current + 1; loadFromApi(currentPage, currentLimit); } }));
  container.appendChild(makeBtn(">>", current === total, () => { currentPage = total; loadFromApi(total, currentLimit); }));
}

// ------------------------- Edit modal (basic) -------------------------
function openEditModal(item, rowEl) {
  const modal = safeQuery("#modalEdit");
  const editName = safeQuery("#editName");
  const editReason = safeQuery("#editReason");
  const editStatus = safeQuery("#editStatus");
  const saveEdit = safeQuery("#saveEdit");
  const closeModal = safeQuery("#closeModal");

  if (!modal || !editName || !editReason || !editStatus || !saveEdit || !closeModal) {
    alert("Modal edit belum lengkap di HTML");
    return;
  }

  // fill
  editName.value = item.user_id || "";
  editReason.value = item.alasan || "";
  editStatus.value = item.status || "";

  modal.style.display = "block";

  // close handler
  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  // save handler (one-time binding)
  saveEdit.onclick = async () => {
    const updateData = {
      user_id: editName.value,
      alasan: editReason.value,
      status: editStatus.value
    };
    try {
      await fetch(`http://localhost:3000/api/izin/log/update/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      modal.style.display = "none";
      // optionally re-load current page
      loadFromApi(currentPage, currentLimit);
    } catch (err) {
      console.error(err);
      alert("Gagal update");
    }
  };
}

// ------------------------- Utilities / defensive -------------------------
window.addEventListener("resize", () => {
  // optional: responsive actions
});
