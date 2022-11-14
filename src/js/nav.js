const menu = document.getElementById('menu')
const burger = document.getElementById('burger')

// Open Close Navbar Menu on Click Burger
if (burger && menu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active')
    menu.classList.toggle('is-active')
  })
}

// Close Navbar Menu on Click Menu Links
document.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    burger.classList.remove('is-active')
    menu.classList.remove('is-active')
  })
})
