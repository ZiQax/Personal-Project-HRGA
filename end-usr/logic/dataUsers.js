
// Load data dari localStorage ketika halaman dibuka
window.addEventListener("DOMContentLoaded", loadFromApi);

const button = document.getElementById("delete"); // Tombol tambah data manual (opsional)
const selectAll = document.getElementById("selectAll");
const srcgBtn = document.getElementById("btnsrc");
const search = document.getElementById("search");
const tmbh = document.querySelector('.tmbh')

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = "login.html";
  };
  
  const namU = document.getElementById('nam-u');
  const emailU = document.getElementById('email-u');

  if(namU && emailU){
    namU.textContent = `NIK :  ${user.nik}`;
    emailU.textContent = `username :  ${user.username}`;
  };

  const btnLogout = document.getElementById("logoutBtn");

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
})

tmbh.addEventListener('click', () => {
  window.location.href = "from.html";
  console.log('clicked');
});


// Sidebar toggle
const body = document.querySelector("body");
const sidebar = body.querySelector(".menu");
const toggle = body.querySelector('#menbtn');

toggle.addEventListener("mouseover", () => {
   document.body.classList.toggle("sidebar-open");
 sidebar.classList.toggle("tutup");
});

sidebar.addEventListener("mouseleave", () => {
  document.body.classList.remove("sidebar-open");
  sidebar.classList.add("tutup");
});



const menuItem = document.querySelectorAll('.item > li');

menuItem.forEach(item => {
  item.addEventListener('click', () => {
    menuItem.forEach(i => {
       if(i !== item) i.classList.remove('open');
    })
    item.classList.toggle('open');
  });
});



const foto = document.getElementById("iamge");
const profile = document.querySelector(".ui");

foto.addEventListener("click", (e) => {
  e.stopPropagation();
  profile.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if(!profile.contains(e.target) && !foto.contains(e.target))
  profile.classList.remove("active");
});

function updateStatus(id, newStatus) {
  
  const statusCell = document.querySelectorAll('.status');
  console.log(statusCell);
  if(statusCell){
    statusCell.textContent = newStatus;
  }

  let pending = 0;
  let approved = 0;
  let rejected = 0;

  document.querySelectorAll('td.status').forEach(cell => {
    const status = cell.textContent.trim();
    if (status === "Menunggu Persetujuan") {
      pending++;
    } else if (status === "Disetujui") {
      approved++;
    } else if (status === "Ditolak") {
      rejected++;
    }
  });

  // document.getElementById("pending-count").textContent = pending;
  // document.getElementById("approved-count").textContent = approved;
  // document.getElementById("rejected-count").textContent = rejected;

  document.querySelectorAll(".value h3").forEach(h3 => {
    h3.style.color = "#000";
  })
}

document.getElementById('btn-car').addEventListener('click', () => {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  if(!startDate || !endDate) {
    alert('Please select start and end date');
    return;
  }

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  document.querySelectorAll('table tbody tr').forEach(row => {
    const dateCell = row.querySelector('td.date');
    const text = dateCell.textContent.trim();

    const [day, month, year] = text.split('/');
      const dateObj = new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`);
   
    if(!isNaN(dateObj)){
    if(dateObj >= startDateObj && dateObj <= endDateObj) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  }
  })

  })

tmbh.addEventListener('click', () => {
  window.location.href = "formIzin.html";
  console.log('clicked');
});

let currentPage = 1;
const limit = [10, 25, 50];
const apiURL = "http://localhost:3000/api/auth/all-user/pagination";

async function loadFromApi(page = 1) {
  try {
    const response = await fetch(`${apiURL}?page=${page}&limit=${limit}`);
    const result = await response.json();
       console.log(result);

    if (!response.ok) throw new Error(response.statusText);
    const data = result.data || []; 
 

    const tbody = document.querySelector(".table tbody");

    tbody.innerHTML = "";

    data.forEach((item , index) => {
      let rows = document.createElement("tr");

      const date = new Date(item.created_at);
      const formattedDate = isNaN (date) ? "-" : date.toLocaleDateString("id-ID", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

      rows.innerHTML += `
        <td class="number">${index + 1}</td>
        <td class="date">${formattedDate}</td>
        <td class="name">${item.nik}</td>
        <td class="section">${item.username}</td>
        <td class="status">${item.status}</td>
        <td class="position">${item.role}</td>
        <td><input type="checkbox" class="centang"></td>
        <td>
          <a href="#" class="edit"><i class="fa-regular fa-pen-to-square"></i></a>
          <button type="button" class="hapus" disabled><i class="fa-solid fa-rotate-left"></i></button>
        </td>
      `;

      const checkbox = rows.querySelector(".centang");
      const deleteBtn = rows.querySelector(".hapus");

      checkbox.addEventListener("change", () => {
        deleteBtn.disabled = !checkbox.checked;
      })

     deleteBtn.addEventListener('click', () => {
        document.getElementById('resetPassword').value;
        const modalReset = document.getElementById('resetPass');
        modalReset.style.display = 'block';

        document.getElementById('saveReset').onclick = async () => {
            if(!confirm("apakah anda yakin ingin mereset password ini?")) {
              return
            }
            const resetId = item.id;
            const updatePassword = {password: document.getElementById('resetPassword').value};

            await fetch(`http://localhost:3000/api/auth/reset-password/${resetId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatePassword)
            });

            console.log(updatePassword);
           updateStatus();
           modalReset.style.display = 'none';
        }
        document.getElementById('ttup').onclick = () => {
          modalReset.style.display = 'none';
        }
      })


      const editBtn = rows.querySelector(".edit");

      editBtn.addEventListener('click', () => {
        
        document.getElementById('editName').value = item.user_id;
        document.getElementById('editReason').value = item.alasan;
        document.getElementById('editStatus').value = item.status;

        const modal = document.getElementById('modalEdit');
        modal.style.display = 'block';

        document.getElementById('saveEdit').onclick = async () => {
          const currentEditingId = item.id;
          const updtedData = {
            user_id: document.getElementById('editName').value,
            alasan: document.getElementById('editReason').value,
            status: document.getElementById('editStatus').value
          };

          await fetch(`http://localhost:3000/api/izin/log/update/${currentEditingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updtedData)
          });

          console.log(updtedData);

          rows.querySelector(".name").textContent = updtedData.user_id;
          rows.querySelector(".alasan").textContent = updtedData.alasan;
          rows.querySelector(".status").textContent = updtedData.status;

          updateStatus();

          modal.style.display = 'none';
        }

        document.getElementById('closeModal').onclick = () => {
          modal.style.display = 'none';
        }
      })

      tbody.appendChild(rows);
            });

    updatePagination(result.pagination);
    updateStatus();
  }catch (error) {
    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = `<tr><td colspan="9">data tidak ditemukan</td></tr>`;
    console.log(error);
  }
}


// Search filter
srcgBtn.addEventListener("click", function () {
  const keyword = search.value.toLowerCase();
  const rows = document.querySelectorAll(".table tbody tr");

  rows.forEach((row) => {
    const nameCell = row.querySelector("td.date");
    if (!nameCell) return;

    const nameText = nameCell.textContent.toLowerCase();
    const match = nameText.includes(keyword);
    row.style.display = match ? "" : "none";
  });
});


const shorTable = document.querySelectorAll('thead tr th');
currentShortIndex = null;
let shortState = {};

shorTable.forEach((th, i) => {

  th.onclick = () => {

  if (currentShortIndex === i){
   isAsc = !isAsc;
  }else{
    isAsc = true;
    currentShortIndex = i;
  };

    shorTable.forEach((th) => th.classList.remove('ats', 'asc'));
    th.classList.add('ats');
     if (!isAsc) th.classList.add('asc');

    const rwTbl = Array.from(document.querySelectorAll('tbody tr'));

    rwTbl.sort((a, b) => {
      const aText = a.querySelectorAll('td')[i].textContent.trim();
      const bText = b.querySelectorAll('td')[i].textContent.trim();

      const aDate = parseTanggal(aText);
      const bDate = parseTanggal(bText);

      if (!isNaN(aDate) && !isNaN(bDate)) {
        return isAsc ? aDate - bDate : bDate - aDate;
      }

    const aNum = parseFloat(aText);
    const bNum = parseFloat(bText);
    if(!isNaN(aNum) && !isNaN(bNum)) {
      return isAsc ? aNum - bNum : bNum - aNum;
    }else{
      return isAsc
      ? aText.localeCompare(bText)
      : bText.localeCompare(aText);
    }
  
    })

     const tbody = document.querySelector('tbody');
     rwTbl.forEach((r) => tbody.appendChild(r));

     document.querySelectorAll('tbody td').forEach((td) => {
      td.classList.remove('ats');
    })  

    const baris = document.querySelectorAll('tbody tr');
    baris.forEach((bar) =>{
      const cell = bar.querySelectorAll('td');
      if (cell[i]) cell[i].classList.add('ats');
    });
  }
});

function parseTanggal(text) {
  const parts = text.split('/');
  if(parts.length !== 3) return NaN;
  const [ day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}

document.addEventListener('click' , (e) => {
  const isHeader = e.target.closest('thead th');

  if(!isHeader) {
    document.querySelectorAll('thead th').forEach(th => th.classList.remove('ats', 'asc'));
    document.querySelectorAll('thead th > span > i').forEach(icon => icon.style.transform = '');
   document.querySelectorAll('tbody td').forEach(td => td.classList.remove('ats'));
currentShortIndex = null;
}
});

const pageLinks = document.querySelectorAll('.page-link');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const firstBtn = document.getElementById('first');
const lastBtn = document.getElementById('last');

let currentHal = 1;
const totalHal = pageLinks.length;


// pagination
function updatePagination(pagination) {
  const { current_page, total_pages, next, prev } = pagination;
  const pageInfo = document.getElementById("pageInfo");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  pageInfo.innerHTML = ``;


  //looping pagination untuk memunculkan tombol
  for (let i = 1; i <= total_pages; i++) {
    const tnPgn = document.createElement("button");
    tnPgn.classList.add("btn-pagin");
    tnPgn.textContent = i;

    if (i === current_page) {
      tnPgn.classList.add("act-pgn");
    }

    tnPgn.addEventListener("click", () => loadFromApi(i));
    pageInfo.appendChild(tnPgn);
  }

  // tombol prev
  prevBtn.disabled = !prev;
  prevBtn.onclick = () => {
    if (prev) loadFromApi(prev.page);
  };

  // tombol next
  nextBtn.disabled = !next;
  nextBtn.onclick = () => {
    if (next) loadFromApi(next.page);
  };
}