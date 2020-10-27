import util from '../common/util.js';
import notification from '../common/notification.js';

const postUserProfile = document.getElementById("postUserProfile");
// const userId = document.getElementById("userId");

if (postUserProfile) {
  postUserProfile.addEventListener("submit", e => {
    e.preventDefault();
    // formdata to jsondata
    const jsonData = util.form2json(postUserProfile);
    // ajax
    fetch(`/user/${postUserProfile.id.value}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    }).then(res => {
      return res.json();
    }).then(data => {
      if (data.errors) {
        notification.show('top', 'right', data.errors[0].defaultMessage, 2);
        return;
      }
      // console.log(data);
      changeFormdata(data);
      notification.show('top','right', "성공적으로 수정되었습니다.", 3);
    }).catch(err => {
      console.error(err);
    });
  }, false);
}

function changeFormdata(data) {
  document.getElementsByClassName('card-description').item(0).innerHTML = data.userGroup;
  document.querySelector('input[name=userGroup]').value = data.userGroup;
  document.querySelector('input[name=status]').value = data.status;
  document.querySelector('input[name=email]').value = data.email;
  document.querySelector('input[name=phone]').value = data.phone;
}

const profile = {
  postUserProfile: postUserProfile,
  changeFormdata: changeFormdata,
}

export default profile;