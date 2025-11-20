
const nama = document.getElementById("nme");
const departement = document.getElementById("departement");
const section = document.getElementById("section");
const  position = document.getElementById("position");
const rson = document.getElementById("rson");
const estimasi = document.getElementById('estimasi');
const tambah = document.getElementById("tmbh");
// function validasiInput () {
//   const isValid = nama.value !== "" && departement.value !== "" && section.value !== "" && position.value !=="" && rson.value !=="";
//   tambah.disabled = !isValid;
// };

function showModal(message) {
  const modal = document.getElementById('modal');
  const messageBox = document.getElementById('modal-message');

  messageBox.textContent = message;
  modal.classList.remove("hidden");

  setTimeout(() => {
    modal.classList.add("hidden");
  }, 1000);

}

// // Cek validasi setiap kali ada perubahan di input
// [nama, departement, section, position, rson].forEach((el) => {
//   el.addEventListener("input", validasiInput);
// });

function setupDropdown(dropdownId, inputTarget) {
  const dropdown = document.getElementById(dropdownId);
  const selected = dropdown.querySelector(".selected");
  const options = dropdown.querySelectorAll(".options div");


selected.addEventListener("click", () => {
  dropdown.classList.toggle("open");
  console.log("clicked");
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    const value = option.getAttribute("data-value");
    const label = option.textContent;

    selected.textContent = label;
    inputTarget.value = value;
    dropdown.classList.remove("open");

    // validasiInput();

  });
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
})

}


setupDropdown("departementDropdown", departement);

const form = document.getElementById("form");

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  console.log(data);
  try{
    const response = await fetch('http://localhost:3000/api/service/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if(!response.ok) throw new Error(response.statusText);

    const result = await response.json();
    showModal('Register Success', result.message || "akun berhasil di buat");
    console.log(result);
  } catch (err) {
    alert(err.message);
    console.log(err);
  } finally {
    form.reset();
    [kendaraan_id, tanggal_service, deskripsi, biaya].forEach((el) => {
      el.value = "";
    })
  }
})


