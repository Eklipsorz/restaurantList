
// form is the form on creation page and on edit page
// submitButton is button for each form
// previewImageButton is button and when you click it, then you
// can preview image according to url input
const form = document.querySelector('#restaurant-form')
const submitButton = document.querySelector('#submit')
const previewImageButton = document.querySelector('#preview-image-btn')


// form event handler and submitButton event handler
// when submitButton is clicked, it then fire the following handler
function onSubmitButtonClicked(event) {
  form.classList.add('was-validated')
}

// when form is submitted, it then fire the following handler
function onFormSubmited(event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
}


// when previewImageButton is clicked, it then fire the following handler
function onPreviewImageButtonClicked(event) {

  // get url from url input
  const imageURL = form.querySelector('#image').value
  // get dialog for previewing image
  const dialog = document.querySelector('#dialog-content')


  dialog.innerHTML = ''

  // If user input nothing, it shows 404
  if (imageURL === '') {

    dialog.innerHTML = `
      <div class="not-found-page">
        <h1> not found!!!</h1>
      </div>
    `
    return
  }

  // If user input something, it try to preview image according to url
  dialog.innerHTML = `
    <img src=${imageURL} alt="" >
  `

}

// binding event handler
form.addEventListener('submit', onFormSubmited)
submitButton.addEventListener('click', onSubmitButtonClicked)
previewImageButton.addEventListener('click', onPreviewImageButtonClicked)


