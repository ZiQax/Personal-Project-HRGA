
document.addEventListener("DOMContentLoaded", () => {

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
  }
});

document.querySelectorAll(".val-box").forEach((box, i) => {
  setTimeout(() => {
    box.classList.add("show");
  }, i * 200); // animasi delay tiap card
});


const btnLogout = document.getElementById("logoutBtn");

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
})

const srcgBtn = document.getElementById("btnsrc");
const search = document.getElementById("search");


// Sidebar toggle
const body = document.querySelector("body");
const sidebar = body.querySelector(".menu");
const toggle = body.querySelector('#menbtn');

if(toggle, sidebar){
  
toggle.addEventListener("mouseover", () => {
   document.body.classList.toggle("sidebar-open");
 sidebar.classList.toggle("tutup");
});

sidebar.addEventListener("mouseleave", () => {
  document.body.classList.remove("sidebar-open");
  sidebar.classList.add("tutup");
});

};

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



document.querySelectorAll('#x').forEach(btn => {
  btn.addEventListener('click', () => {
    const chartBox =btn.closest('.val-box');
    if(chartBox){
      chartBox.remove();
    }
  })
})

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

  async function ambilData(){
    try {
      const response = await fetch('http://localhost:3000/api/analitycs/top-recent');
      const result = await response.json();

      if(!response.ok) throw new Error(response.statusText);
      
      const data = result.data;
      const dataTop = document.getElementById('chart4');

       dataTop.innerHTML = '';
        
       let table = document.createElement('table');
       table.classList.add('table');
       
       let headers = `
          <thead>
            <tr>
              <th scope="col">NIK</th>
              <th scope="col">Kendaraan</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
       `;

       table.innerHTML = headers;

       let body = document.createElement('tbody');
       data.forEach((item) => {
          let rows = document.createElement('tr');

          const date = new Date(item.created_at);
          const formattedDate = isNaN (date) ? "-" : date.toLocaleDateString("id-ID", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          });

          rows.innerHTML += `
            <td class="name">${item.user_id}</td>
            <td class="position">${item.merk}</td>
            <td class="status">${item.status}</td>
          `;

          body.appendChild(rows);
       })
      
       table.appendChild(body);
       dataTop.appendChild(table);

    } catch (err) {
      console.log(err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    ambilData();
  });

  async function topIzin(){
    try {
      const response = await fetch('http://localhost:3000/api/analitycs/top-izin');
      const result = await response.json();

      if(!response.ok) throw new Error(response.statusText);
      
      const data = result.data;
      const dataTop = document.getElementById('chart3');

       dataTop.innerHTML = '';
        
       let table = document.createElement('table');
       table.classList.add('table');
       
       let headers = `
          <thead>
            <tr>
              <th scope="col">NIK</th>
              <th scope="col">Alasan</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
       `;

       table.innerHTML = headers;

       let body = document.createElement('tbody');
       data.forEach((item) => {
          let rows = document.createElement('tr');

          const date = new Date(item.created_at);
          const formattedDate = isNaN (date) ? "-" : date.toLocaleDateString("id-ID", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          });

          rows.innerHTML += `
            <td class="name">${item.user_id}</td>
            <td class="alasan">${item.alasan}</td>
            <td class="status">${item.status}</td>
          `;

          body.appendChild(rows);
       })
      
       table.appendChild(body);
       dataTop.appendChild(table);

    } catch (err) {
      console.log(err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    topIzin();
  });

  //Notifikasi

const socket = io('http://localhost:3001', {
    transports: ['polling'], // atau bisa ['websocket'] jika ingin mencoba transportasi websocket
    withCredentials: true,   // Untuk memastikan socket bisa mengirimkan kredensial (cookies)
});


// Mendengarkan event 'notification' yang dikirim dari server
socket.on('notification', function(data) {
    console.log('Notification received:', data);
    const notificationCount = data.newNotificationCount;
    updateNotificationBadge(notificationCount);
});

// Fungsi untuk memperbarui badge notifikasi
function updateNotificationBadge(count) {
    const badge = document.getElementById("notification-count");
    if (count > 0) {
        badge.style.display = "inline-block";
        badge.textContent = count;
    } else {
        badge.style.display = "none";
    }
}
