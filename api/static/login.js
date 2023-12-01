const btn = document.getElementById('submit')
const form = document.getElementById('form')

console.log(btn)
btn.addEventListener('click', (e) => {
    // prevent the form from submitting
    e.preventDefault();

    // show the form values
    const formData = new FormData(form);
    const values = [...formData.entries()];
    console.log(values);
});