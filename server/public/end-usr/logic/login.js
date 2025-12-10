
/*=============== SHOW HIDE PASSWORD LOGIN ===============*/
const passwordAccess = (loginPass, loginEye) =>{
   const input = document.getElementById(loginPass),
         iconEye = document.getElementById(loginEye)

   iconEye.addEventListener('click', () =>{
      // Change password to text
      input.type === 'password' ? input.type = 'text'
						              : input.type = 'password'

      // Icon change
      iconEye.classList.toggle('ri-eye-fill')
      iconEye.classList.toggle('ri-eye-off-fill')
   })
}
passwordAccess('password','loginPassword')

/*=============== SHOW HIDE PASSWORD CREATE ACCOUNT ===============*/
const passwordRegister = (loginPass, loginEye) =>{
   const input = document.getElementById(loginPass),
         iconEye = document.getElementById(loginEye)

   iconEye.addEventListener('click', () =>{
      // Change password to text
      input.type === 'password' ? input.type = 'text': input.type = 'password'

      // Icon change
      iconEye.classList.toggle('ri-eye-fill')
      iconEye.classList.toggle('ri-eye-off-fill')
   })
}
passwordRegister('passwordCreate','loginPasswordCreate')

/*=============== SHOW HIDE LOGIN & CREATE ACCOUNT ===============*/
const loginAcessRegister = document.getElementById('loginAccessRegister'),
      buttonRegister = document.getElementById('loginButtonRegister'),
      buttonAccess = document.getElementById('loginButtonAccess')

buttonRegister.addEventListener('click', () => {
   loginAcessRegister.classList.add('active')
})

buttonAccess.addEventListener('click', () => {
   loginAcessRegister.classList.remove('active')
})


const showModal = function (title, message) {
   const overlay = document.getElementById('modalOverlay');
   document.getElementById('modalTitle').textContent = title;
   document.getElementById('modalMessage').textContent = message;
  overlay.style.display = 'flex';

  setTimeout(() => {
     closeModal();
  }, 2000);
}

const closeModal = function () {

   document.getElementById('modalOverlay').style.display = 'none';
}

// document.getElementById('closeModal').addEventListener('click', closeModal);

document.addEventListener('DOMContentLoaded', () => {
 
 const FormRegister = document.querySelector('.register__form');

FormRegister.addEventListener('submit', async(e) => {
    e.preventDefault();

    const formData = new FormData(FormRegister);
    const data = Object.fromEntries(formData);
    
    console.log(data);
     
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
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

    }catch (err) {
        showModal('Register Failed', err.message || "akun gagal di buat");
        console.log(err);
    }
});

   FormRegister.reset();

   const FormLogin = document.querySelector('.login__form');
    
   FormLogin.addEventListener('submit', async(e) => {
      e.preventDefault();
      const formData = new FormData(FormLogin);
      const data = Object.fromEntries(formData);

      try {
         const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
         });

         const result = await response.json();
         if(!response.ok) throw new Error(result.message ||response.statusText);

         localStorage.setItem("token", result.token);
         localStorage.setItem('user', JSON.stringify(result.user));
         localStorage.setItem("role", result.user.role);

         showModal("Login Success", result.message || `Selamat Datang ${result.user.username}!`);

         setTimeout(() => {
            if (result.user.role === 'admin') {
               window.location.href = "index.html";
            }else if (result.user.role === 'user') {
               window.location.href = "menudash.html";
            }else{
               window.location.href = "unauthorized.html";
            }
         },2000);

      } catch (err) {
         setTimeout(() => {
            showModal('Login Failed', err.message);
         }, 10);
         
         console.log(err);
         localStorage.setItem('errorr', JSON.stringify(err));
      } finally {
         FormLogin.reset();
      };
   });

});