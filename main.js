const username = document.getElementById("username");
const password = document.getElementById("password");

function validUsername() {
  const valueLowerCase = username.value.toLowerCase();
  if (valueLowerCase !== 'thanos' && valueLowerCase !== 'thor') {
    document.getElementById("username-error").textContent = "Username should be either thanos or avengers";
    return false;
  }
  return true;
}

function validPassowrd() {
  if (password.value !== username.value) {
    document.getElementById("password-error").textContent = "Password must match Username";
    return false;
  }
  return true;
}

username.addEventListener('focus', function() {
  document.getElementById("username-error").textContent = "";
});

username.addEventListener('blur', function() {
  validUsername();
});

password.addEventListener('focus', function() {
  document.getElementById("password-error").textContent = "";
});

password.addEventListener('blur', function() {
  validPassowrd();
});

document.getElementById("myForm").addEventListener("submit", async function(event) {
  const isFormValid = validUsername() && validPassowrd();
  event.preventDefault();
  if (!isFormValid) {
    return;
  }
  // document.querySelector('.formBox').classList.add('hide');
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "access-control-allow-origin": "*",
      SameSite: 'None',
      Accept: 'application/json'
    },
    body: JSON.stringify({ username: username.value, password: password.value })
  })
  const data = await response.json();
  if (data?.role === 'Thanos') {

    getAvengersAlive();

    // this is to be written by users
    var thanosButton = document.createElement('button');
    thanosButton.id = 'thanosButton'; 
    thanosButton.textContent = 'Snap';
    thanosButton.classList.add('btn')
    document.querySelector('.button-container').appendChild(thanosButton);
    
    
    thanosButton.addEventListener('click', function() {
      // ---------------------------------- 
      // function provided by us onSnap()
      const snap = document.createElement('div');
      const container = document.querySelector('.container');
      snap.classList.add('coverSite');
      container.appendChild(snap);
      document.getElementById('thanosButton').classList.add('hide');
    })

  } else if (role === 'Avengers') {
  //   const avengersButton = document.createElement('button');
  //   avengersButton.id = 'avengersButton'; 
  //   avengersButton.textContent = 'Save';
  //   avengersButton.classList.add('btn')
  //   document.querySelector('.button-container').appendChild(avengersButton);
  }
});


document.getElementById('save').addEventListener('click', function() {
  console.log('save clicked')
})


async function getAvengersAlive() {
  const response = await fetch('http://localhost:3000/whosAvenger', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "access-control-allow-origin": "*",
      SameSite: 'None',
      Accept: 'application/json'
    },
  })
  const {avengers} = await response.json()
  localStorage.setItem('avengers', avengers);
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}