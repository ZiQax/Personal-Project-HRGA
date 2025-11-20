let nama = document.getElementById("nama");
let button = document.getElementById("tambah");

button.addEventListener("click", function () {
  if (nama.value == "") {
    alert("form jangan kosong");
  } else {
    let conatinerList = document.querySelector(".list-group");
    let urutan = conatinerList.innerHTML;
    urutan += `N
 <li class="list-group-item d-flex justify-content-between">
   <div>
    <input class="form-check-input me-1" type="checkbox">
      <span>${nama.value}</span>
    </div>
      <button class="badge border-0 btn-danger btn-hapus">x</button>
  </li>
      `;

    conatinerList.innerHTML = urutan;
    nama.value = "";
    nama.focus();
    console.log(urutan);

    let checklist = document.querySelectorAll(".form-check-input");

    for (let a = 0; a < checklist.length; a++) {
      const input = checklist[a];
      input.addEventListener("change", function () {
        let todo = input.nextElementSibling;
        todo.classList.toggle("text-decoration-line-through");
      });
    }
    let hapus = document.querySelectorAll(".btn-hapus");
    for (let i = 0; i < hapus.length; i++) {
      const del = hapus[i];
      console.log(del);
      del.addEventListener("click", function () {
        this.parentElement.remove();
      });
    }
  }
});
console.log(button);
