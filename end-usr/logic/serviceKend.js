

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

  document.getElementById("pending-count").textContent = pending;
  document.getElementById("approved-count").textContent = approved;
  document.getElementById("rejected-count").textContent = rejected;

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



async function loadFromApi() {
  try {
    const response = await fetch("http://localhost:3000/api/service");
    const result = await response.json();
    if (!response.ok) throw new Error(response.statusText);
    const data = result.data; 
    console.log(data);

    const tbody = document.querySelector(".table tbody");

    tbody.innerHTML = "";

    data.forEach(item => {
      let rows = document.createElement("tr");

      const date = new Date(item.tanggal_service);
      const formattedDate = isNaN (date) ? "-" : date.toLocaleDateString("id-ID", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

      rows.innerHTML += `
        <td class="date">${formattedDate}</td>
        <td class="name">${item.deskripsi}</td>
        <td class="title">${item.biaya}</td>
        <td><input type="checkbox" class="centang"></td>
        <td>
          <a href="#" class="edit"><i class="fa-regular fa-pen-to-square"></i></a>
          <button type="button" class="hapus" disabled><i class="fa-regular fa-trash-can"></i></button>
        </td>
      `;

      const checkbox = rows.querySelector(".centang");
      const deleteBtn = rows.querySelector(".hapus");

      checkbox.addEventListener("change", () => {
        deleteBtn.disabled = !checkbox.checked;
      })

      deleteBtn.addEventListener('click', async () =>{
        if(!checkbox.checked) return alert('Pilih dulu dahulu');

        await fetch(`http://localhost:3000/api/service/form/${item.id}`, {
          method: 'DELETE'
        });

        console.log(item.id);
        rows.remove();

        updateStatus();
      });

      const editBtn = rows.querySelector(".edit");

      editBtn.addEventListener('click', () => {

        document.getElementById('editName').value = item.deskripsi;
        document.getElementById('editTitle').value = item.biaya;

        const modal = document.getElementById('modal');
        modal.style.display = 'block';

        document.getElementById('saveEdit').onclick = async () => {
          const updtedData = {
            deskripsi: document.getElementById('editName').value,
            biaya: document.getElementById('editTitle').value,
          };

          await fetch(`http://localhost:3000/izin/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updtedData)
          });

          modal.style.display = 'none';
          getData();
        }
      })

      tbody.appendChild(rows);
            });

    updateStatus();
    updatePgn();
  }catch (error) {
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

function updatePgn() {
  pageLinks.forEach((link, index) => {
    if (index + 1 === currentHal) {
      link.classList.add('act-pgn');
    }else {
      link.classList.remove('act-pgn');
    }
  })
}

pageLinks.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    currentHal = index + 1;
    updatePgn();
  })
})
    
prevBtn.addEventListener('click', () => {
  if (currentHal > 1) {
    currentHal--;
    updatePgn();
  }
})

nextBtn.addEventListener('click', () => {
  if (currentHal < totalHal) {
    currentHal++;
    updatePgn();
  }
})

firstBtn.addEventListener('click', () => {
  currentHal = 1;
  updatePgn();
});

lastBtn.addEventListener('click', () => {
  currentHal = totalHal;
  updatePgn();
});

updatePgn();


