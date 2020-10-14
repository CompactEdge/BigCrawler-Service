export default {

  appCommand: (e) => {
    const path = "/app/command";
    const command = document.querySelector('#appsCommand').value;
    // console.log('command :', command);
    fetch(path, {
      method: 'POST',
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "command": command
      })
    })
    .then(res => res.json())
    .then(result => {
      // console.log('result :', result);
      document.querySelector('.standard-output').innerHTML = result.stdout;
    })
    .catch(err => console.log(err));
  },

  appInstall: (e) => {
    // console.log(e.target);
    // console.log(e.target.nextElementSibling.value);
    Swal.fire({
      title: '정말 설치하시겠습니까?',
      text: 'Install',
      type: 'warning',
      input: 'text',
      inputValue: e.target.nextElementSibling.value,
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Install',
      cancelButtonText: 'Close',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      showLoaderOnConfirm: true,
      buttonsStyling: false,
      preConfirm: (app) => {
        console.log('app :', app);
        return fetch(`/app/install/${app}`, {
            method: 'POST',
          })
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
      if (result.value.flag === 'success') {
        Swal.fire({
          title: `${result.value.flag}`,
          type: 'success',
          timer: 1000 * 1.5,
          showConfirmButton: false,
        });
        document.querySelector('.standard-output').innerHTML = result.value.stdout;
      } else {
        Swal.fire({
          title: `${result.value.stdout}`,
          type: 'error',
          timer: 1000 * 1.5,
          showConfirmButton: false,
        });
      }
    }).catch(err => console.log(err));
  },

  appDelete: (e) => {
    // console.log(e.target);
    // console.log(e.target.nextElementSibling.value);
    Swal.fire({
      title: '정말 삭제하시겠습니까?',
      text: 'Delete',
      type: 'warning',
      input: 'text',
      inputValue: e.target.nextElementSibling.value,
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      showLoaderOnConfirm: true,
      buttonsStyling: false,
      preConfirm: (app) => {
        // console.log('app :', app);
        return fetch(`/app/delete/${app}`, {
            method: 'POST',
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText)
            }
            return response.json()
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              title: `${error}`,
              type: 'error',
              timer: 1000 * 1.5,
              showConfirmButton: false,
            });
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      // console.log('result.value :', result.value);
      if (result.value.flag === 'success') {
        Swal.fire({
          title: `${result.value.flag}`,
          type: 'success',
          timer: 1000 * 1.5,
          showConfirmButton: false,
        });
        document.querySelector('.standard-output').innerHTML = result.value.stdout;
      } else {
        Swal.fire({
          title: `${result.value.stdout}`,
          type: 'error',
          timer: 1000 * 1.5,
          showConfirmButton: false,
        });
      }
    }).catch(err => console.log(err));
  },

}

// const app = {
//   appCommand: appCommand,
//   appInstall: appInstall,
//   appDelete: appDelete,
// }

// export default app;