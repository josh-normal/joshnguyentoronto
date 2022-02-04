const nameInput = document.querySelector('.name-input');
const emailInput = document.querySelector('.email-input');
const messInput = document.querySelector('.mess-input');
const textarea = document.querySelector('textarea');


nameInput.addEventListener("keyup", () => {
    if(nameInput.value) {
        nameInput.classList.add('not-empty');
    } else {
        nameInput.classList.remove('not-empty');
    }
});
emailInput.addEventListener("keyup", () => {
    if(emailInput.value) {
        emailInput.classList.add('not-empty');
    } else {
        emailInput.classList.remove('not-empty');
    }
});
messInput.addEventListener("keyup", () => {
    if(messInput.value) {
        messInput.classList.add('not-empty');
    } else {
        messInput.classList.remove('not-empty');
    }
});


setHeight(textarea);
textarea.addEventListener('input', setHeight.bind(this, textarea));

function setHeight(element) {
    const minRows = 1;
    const maxRows = 15;
    let rows = minRows;
    const initialInlineOverflowY = element.style.overflowY;
    element.style.overflowY = 'hidden';
    element.setAttribute("rows", rows);
    while (rows <= maxRows && element.scrollHeight !== element.clientHeight) {
        element.setAttribute("rows", rows);
        rows++;
    }
    if (initialInlineOverflowY) {
        element.style.overflowY = initialInlineOverflowY;
    } else {
        element.style.removeProperty("overflow-y");
    }
}