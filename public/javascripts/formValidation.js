const form = document.querySelector('#restaurant-form')
const submitButton = document.querySelector('#submit')
const previewImageButton = document.querySelector('#preview-image-btn')

function onSubmitButtonClicked(event) {
  form.classList.add('was-validated')
}

function onFormSubmited(event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function onPreviewImageButtonClicked(event) {

  const imageURL = form.querySelector('#image').value
  const dialog = document.querySelector('#dialog-content')
  dialog.innerHTML = ''

  if (imageURL === '') {

    dialog.innerHTML = `
      <div class="not-found-page">
        <h1> not found!!!</h1>
      </div>
    `
    return
  }


  dialog.innerHTML = `
    <img src=${imageURL} alt="" >
  `

}



form.addEventListener('submit', onFormSubmited)
submitButton.addEventListener('click', onSubmitButtonClicked)
previewImageButton.addEventListener('click', onPreviewImageButtonClicked)


