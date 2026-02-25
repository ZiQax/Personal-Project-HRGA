// sidenav transition-burger

const sidenav = document.querySelector('aside')
const sidenav_trigger = document.querySelector('[sidenav-trigger]')
const sidenav_close_button = document.querySelector('[sidenav-close]')
const burger = sidenav_trigger.firstElementChild
const top_bread = burger.firstElementChild
const bottom_bread = burger.lastElementChild

sidenav_trigger.addEventListener('click', function () {
  if (page == 'virtual-reality') {
    sidenav.classList.toggle('xl:left-[18%]')
  }
  // sidenav_close_button.classList.toggle("hidden");
  if (sidenav.getAttribute('aria-expanded') == 'false') {
    sidenav.setAttribute('aria-expanded', 'true')
  } else {
    sidenav.setAttribute('aria-expanded', 'false')
  }
  sidenav.classList.toggle('translate-x-0')
  sidenav.classList.toggle('ml-6')
  sidenav.classList.toggle('shadow-xl')
  if (page == 'rtl') {
    top_bread.classList.toggle('-translate-x-[5px]')
    bottom_bread.classList.toggle('-translate-x-[5px]')
  } else {
    top_bread.classList.toggle('translate-x-[5px]')
    bottom_bread.classList.toggle('translate-x-[5px]')
  }
})
sidenav_close_button.addEventListener('click', function () {
  sidenav_trigger.click()
})

window.addEventListener('click', function (e) {
  if (!sidenav.contains(e.target) && !sidenav_trigger.contains(e.target)) {
    if (sidenav.getAttribute('aria-expanded') == 'true') {
      sidenav_trigger.click()
    }
  }
})
