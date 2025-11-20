// let currentPage = 1;
// let limit = 10;

// const tbody = document.getElementById("body");
// const paginationButtons = document.getElementById("lnk");
// const dropMenu = document.querySelectorAll(".page-srt");

// async function loadData(page = 1, limitValue = limit) {
//   try {
//     const res = await fetch(`http://localhost:3000/api/izin/log/pagination`);
//     const result = await res.json();

//     console.log(result);

//     if (!result.success) {
//       tbody.innerHTML = `<tr><td colspan="6">Data tidak ditemukan</td></tr>`;
//       return;
//     }

//     let dataArray = result.data || Object.values(result).filter((v) => typeof v === "object" && v.id);

//     // Tampilkan data ke tabel
//     tbody.innerHTML = "";
//     dataArray.forEach(item => {
//       const row = `
//         <tr>
//           <td>${item.id}</td>
//           <td>${item.user_id}</td>
//           <td>${item.departement}</td>
//           <td>${item.section}</td>
//           <td>${item.alasan}</td>
//           <td>${item.status}</td>
//         </tr>`;
//       tbody.innerHTML += row;
//     });

//     // Update pagination button
//     generatePagination(result.currentPage, result.totalPages);
//   } catch (err) {
//     console.error(err);
//   }
// }

// // 🔹 Fungsi untuk generate tombol 1 2 3 ...
// function generatePagination(currentPage, totalPages) {
//   paginationButtons.innerHTML = "";

//   for (let i = 1; i <= totalPages; i++) {
//     const btn = document.createElement("button");
//     btn.textContent = i;
//     btn.className = i === currentPage ? "active" : "";
//     btn.addEventListener("click", () => {
//       currentPage = i;
//       loadData(currentPage, limit);
//     });
//     paginationButtons.appendChild(btn);
//   }
// }

// // 🔹 Ganti jumlah data per halaman (limit)
// dropMenu.forEach(el => {
//   el.addEventListener("click", e => {
//     e.preventDefault();
//     limit = parseInt(e.target.dataset.limit);
//     currentPage = 1;
//     loadData(currentPage, limit);
//   });
// });

// // 🔹 Load pertama kali
// loadData();

let currentPage = 1;
  const limit = 10;
  const apiURL = "http://localhost:3000/api/izin/log/pagination";

  async function loadIzin(page = 1) {
    try {
      const res = await fetch(`${apiURL}?page=${page}&limit=${limit}`);
      const result = await res.json();

      if (!res.ok || result.status === false) {
        throw new Error(result.message || "Gagal memuat data");
      }

      // Ambil data izin
      const izinList = result.data || [];

      // Render data tabel
      renderTable(izinList);

      // Update pagination dari result.pagination (bukan result.data)
      updatePagination(result.pagination);

    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  }

  function renderTable(data) {
    const tbody = document.getElementById("body");
    tbody.innerHTML = "";

    data.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.user_id}</td>
        <td>${item.tanggal ?? "-"}</td>
        <td>${item.status}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updatePagination(pagination) {
    const { current_page, total_pages, next, prev } = pagination;
    const pageInfo = document.getElementById("pageInfo");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    pageInfo.textContent = `Page ${current_page} of ${total_pages}`;

    // tombol prev
    prevBtn.disabled = !prev;
    prevBtn.onclick = () => {
      if (prev) loadIzin(prev.page);
    };

    // tombol next
    nextBtn.disabled = !next;
    nextBtn.onclick = () => {
      if (next) loadIzin(next.page);
    };
  }

  // Load pertama kali
  loadIzin(currentPage);