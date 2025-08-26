const dialog = document.querySelector('.dialog');
const openBtn = document.querySelector('.addTrainerBtn');
const submitBtn = document.querySelector('.submitBtn');

openBtn.addEventListener('click', () => {
    dialog.showModal();
});

submitBtn.addEventListener('click', () => {
    dialog.closest();
});
