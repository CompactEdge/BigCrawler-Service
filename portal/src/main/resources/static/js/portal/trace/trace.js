export default function () {
  // const conn = (document.querySelector('input[name=connection]').value === 'true');
  const conn = true;
  if (conn) {
    setTimeout(()=>{
      $('.kiali-iframe-container>.overlay').fadeOut();
      $('.data-loading').remove();
      // document.querySelector('.kiali-iframe-container>.overlay').style.display = 'none';
    }, 1000 * 1);
  } else {
    alert('Connection refused');
  }
  // const myHeaders = new Headers();
  // myHeaders.set('mode', 'no-cors');
  // myHeaders.append('Authorization', 'Basic ' + btoa('username:password'));
  // document.cookie = `kiali-token=${document.querySelector('input[name=kialitoken]').value.replace(/"/g, '')}; SameSite=None; Secure`;
  // const token = '[[${token}]]'.replace(/&quot;/gi, '');
  // const token = document.querySelector('input[name=kialitoken]').value.replace(/"/g, '');
  // window.open('http://221.153.191.33:12020');
  fetch('http://221.153.191.33:12020/kiali/api/authenticate', {
    method: "POST",
    // mode: "no-cors",
    mode: "cors",
    // credentials: 'include',
    // headers: myHeaders,
    headers: {
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "*",
      // "Access-Control-Allow-Headers": "*",
      // "Access-Control-Allow-Credentials": true,
      // "Access-Control-Expose-Headers": "Access-Control-Allow-Origin,Authorization",
      // "Set-Cookie": "cross-site-cookie=name; SameSite=None;",
      // "Authorization": 'Basic ' + btoa('username:password'),
      // Authorization: 'Bearer ' + document.querySelector('input[name=kialitoken]').value.replace(/"/g, ''),
    },
    timeout: 1000 * 2,
  }).then(res => {
    // console.log(res);
    return res.json();
  }).then(data => {
    // console.log(data);
  }).catch(err => {
    console.log(err);
  });
}