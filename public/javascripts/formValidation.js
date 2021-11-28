const form = document.querySelector('#form')
const submitButton = document.querySelector('#submit')

function onSubmitButtonClicked(event) {
  form.classList.add('was-validated')
}

function onFormSubmited(event) {
  event.preventDefault()
  event.stopPropagation()
}


form.addEventListener('submit', onFormSubmited)
submitButton.addEventListener('click', onSubmitButtonClicked)



