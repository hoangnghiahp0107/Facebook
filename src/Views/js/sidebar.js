const sideLinks = document.querySelectorAll('sidebar .side-menu li a:not(.logout)');
sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', ()=> {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
})

const menuBar = document.querySelector('.content nav .fa-solid.icon-menu');
const sidebar = document.querySelector('.sidebar');
menuBar.addEventListener('click', ()=>{
    sidebar.classList.toggle('close');
})