document.addEventListener("DOMContentLoaded", async () => {

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


const btnLogout = document.getElementById("logoutBtn");

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
})

const button = document.getElementById("delete"); // Tombol tambah data manual (opsional)
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
  const keyword = search.value.toLowerCase();s
  const rows = document.querySelectorAll(".table tbody tr");

  rows.forEach((row) => {
    const nameCell = row.querySelector("td.date");
    if (!nameCell) return;

    const nameText = nameCell.textContent.toLowerCase();
    const match = nameText.includes(keyword);
    row.style.display = match ? "" : "none";
  });
 
});

const container = document.querySelector('.value')
if(!container) return;

try{
 const response = await fetch('http://localhost:3000/api/izin/log/pending');
 const data = await response.json();

 console.log(data);

 data.data.forEach(item => {
     
    if(item.status === 'Disetujui' || item.status === 'Ditolak') return;

    const card = document.createElement('div');
    card.classList.add('val-box');
    card.dataset.id = item.id;
    card.dataset.status = item.status;
    card.innerHTML = `
    <div class="lbl">
      <h4>Peminjaman Data</h4>
      <span class="close">x</span>
    </div>
    <div class="chart">
     <div class="profile-tc">
       <img src="">
     </div>
    </div>
    <div class="detail">
       <p>NIK : ${item.user_id}</p>
       <p>departement : ${item.departement}</p>
       <p>Kepentingan : ${item.tujuan}</p>
       <p>tanggal : ${item.created_at}</p>
    </div>
    <div class="valid">
      <button class="btn btn-proove" data-value="Disetujui">Setuju</button>
      <button class="btn btn-reject" data-value="Ditolak">Tolak</button>
    </div>
    </div>

    `;

    const btnProove = card.querySelector('.btn-proove');

    if(btnProove){
      btnProove.addEventListener('click', async (e) => {
        const status = e.target.getAttribute('data-value');
        await updateStatus(item.id, status, card, container);
      });
    }

    const btnReject = card.querySelector('.btn-reject');
    if(btnReject){
      btnReject.addEventListener('click', async (e) => {
        const status = e.target.getAttribute('data-value');
        await updateStatus(item.id, status, card, container);
      });
    }
    
    container.appendChild(card);
  });

}catch(err){
  console.log(err);
}

});

async function updateStatus(id, status, cardElement, container) {
  try {
    const response = await fetch(`http://localhost:3000/api/mobilitas/edit/${id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    console.log(response);

    if(!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errText}`);
    }

    const result = await response.json();
    console.log(result);

    cardElement.remove();
    console.log(id, status);
    
    const remainingCards = container.querySelectorAll('.val-box');
    if(remainingCards.length === 0){
      container.innerHTML = '<p>No pending requests.</p>';
    }

  } catch (err) {
    console.log('Update status error:', err);
  }
}


  