let token;
let count = 0;
const form = document.getElementById('form');
const register = document.getElementById('register');
const login = document.getElementById('login');
const responseDiv = document.getElementById('response');
const account = document.getElementById('account');
const forgotPassword = document.getElementById('forgot-password');

register.addEventListener('click', (e) => {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let role = document.getElementById('role').value;
  if (role.length === 0) {
    return responseDiv.innerHTML = "Don't forget about the role";
  }

  if (email.length >= 5 && password.length >= 5 && role) {
    registerAccount(email, password, role)
  }

  return responseDiv.innerHTML = 'Email or password is too short'

})

login.addEventListener('click', () => {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  enterAccount(email, password)
})

async function registerAccount(email, password, role) {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "email": email,
      "password": password,
      "role": role,
    })
  })

  if (response.status === 400) {
    responseDiv.innerHTML = 'Please provide email and password to register'
  }
  if (response.status === 500) {
    responseDiv.innerHTML = 'Invalid name'
  }
  if (response.status === 200) {
    responseDiv.innerHTML = 'Registered succesfully'
  }
}

async function enterAccount(email, password) {
  let response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "email": email,
      "password": password,
    })
  })

  if (response.status === 400) {
    responseDiv.innerHTML = 'Email or password is wrong'
  }
  if (response.status === 200) {
    response = await response.json()
    token = response.jwt_token;
    localStorage.setItem('token', token);
    const responseProfile = await fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
    })

    if (responseProfile.status === 200) {
      let info = await responseProfile.json();
      if (info.user.role.toLowerCase() === 'driver') {
        window.location.replace("/driver.html")
      } else {
        window.location.replace("/shipper.html")
      }
    }

    responseDiv.innerHTML = 'Enter successfully';




  }
}

forgotPassword.addEventListener('click', () => {
  let email = document.getElementById('email').value;
  if (email.length <= 0) {
    return responseDiv.innerHTML = 'Please provide an email';
  }

  sendPassword(email)
  async function sendPassword(email) {
    const response = await fetch('http://localhost:8080/api/auth/forgot_password', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "email": email,
      })
    })
    if (response.status === 200) {
      return responseDiv.innerHTML =
        'Your new password was send to your email'
    }
    if (response.status === 400) {
      return responseDiv.innerHTML =
        'Wrong email'
    } else {
      return responseDiv.innerHTML =
        'Try again later'
    }
  }
})
