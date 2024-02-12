function toggleMenu() {
    const menu = document.querySelector('.menu');
    document.querySelector('.hamburger-icon').classList.toggle('change');
    menu.classList.toggle('show');
}

function toggleSubmenu(element) {
    element.classList.toggle('active');
    const submenu = element.nextElementSibling;
    submenu.classList.toggle('show');
}

const submenuLinks = document.querySelectorAll('.menu li a');

for (const link of submenuLinks) {
    if (link.nextElementSibling && link.nextElementSibling.classList.contains('submenu-items')) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            toggleSubmenu(event.target);
        });
    }
}
