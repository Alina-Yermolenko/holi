const getAccount = document.getElementById('getAccount');
const profile = document.getElementsByClassName('profile');
const getProfile = document.getElementById('getProfile');
const deleteAccount = document.getElementById('deleteAccount');
const changePassword = document.getElementById('changePassword');
const userInfo = document.getElementById('userInfo');

getAccount.addEventListener('click', () => {
  count++;
  if (count % 2) {
    profile[0].style.display = "block";
  } else {
    profile[0].style.display = "none";
  }
})

getProfile.addEventListener('click', () => {
  getInfo()
  async function getInfo() {
    const response = await fetch('/api/users/me', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })
    if (response.status === 200) {
      let info = await response.json();
      userInfo.innerHTML =
        `<h1>Email: ${info.user.email}</h1>
         <div>User id: ${info.user._id}</div>
         <div>User created date: ${info.user.created_date}</div>
         <div>Role: ${info.user.role}</div>`
    }
  }
})

deleteAccount.addEventListener('click', () => {
  deleteAcc()

  async function deleteAcc() {
    const response = await fetch('/api/users/me', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    if (response.status === 200) {
      location.reload(true)
    }
  }
})

changePassword.addEventListener('click', () => {
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;

  async function changePass(oldPassword, newPassword) {
    const response = await fetch('/api/users/me', {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "oldPassword": oldPassword,
        "newPassword": newPassword,
      })
    })

    if (response.status === 200) {
      changedInfo.innerHTML = 'Password successfuly changed'
    }
    if (response.status === 400) {
      changedInfo.innerHTML = 'Wrong password'
    }
  }

  changePass(oldPassword, newPassword)
})

