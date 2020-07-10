import swal from "sweetalert";
import Swal from 'sweetalert2';

export function confirmationBox(title, callback) {
  swal({
    title: title,
    buttons: true,
  }).then((value) => {
    callback && callback();
  });
}

export function alertBox(title, callback) {
  swal({
    title: title,
  }).then((value) => {
    callback && callback();
  });
}

export function envBox(appname){
  let response;
  Swal.fire({
    title: 'Add Environment',
    inputPlaceholder: 'Environment Name!',
    //titleText: 'Add Environment',
    text: `App Name: ${appname}`,
    input: 'text',
    inputAttributes: {
      autocapitalize: 'On'
    },
    showCancelButton: false,
    confirmButtonText: 'Add',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`https://jsonplaceholder.typicode.com/todos/1`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    console.log('res', result);
    if (result.value) {
      Swal.fire({
        title: `${appname} environment creation initiated!`
        
      })
    }
  })
}