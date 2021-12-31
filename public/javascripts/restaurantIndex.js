const deleteForms = document.querySelectorAll('.delete-form')


// add sumbit event to each form (button) for deleting
// when occuring submit event, it just showing another alert model 
// to remind user to make sure that each user really want to delete
deleteForms.forEach(deleteForm =>
  deleteForm.addEventListener('submit', (event) => {
    
    event.preventDefault()
    event.stopPropagation()

    const restaurantName = deleteForm.dataset.name

    // fire a event to swal for showing alert model
    Swal.fire({
      title: `確定移除${restaurantName}嗎？`,
      showDenyButton: true,
      confirmButtonText: '確定移除',
      denyButtonText: '取消移除',
    }).then((result) => {

      // If user click a button for confirming, it just send a request for deleting it
      if (result.isConfirmed) {
        Swal.fire('已移除', '', 'success')
        // send a data to /restaurants/:id/delete via post method and redirect to /
        deleteForm.submit()

      } else if (result.isDenied) {
        // If user click a button for cancelling, it just cancel execution of deleting it
        Swal.fire('別擔心，我沒移除喔 :>', '', 'info')

      }
    })

  }))