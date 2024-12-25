document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
  
    const result = await response.json();
  
    if (response.status === 200) {
        localStorage.setItem('authentificationToken', result.token);
        window.location.href = '/indexEdit.html'; 
    } else if (response.status === 401 || response.status === 404) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent ="Erreur dans l’identifiant ou le mot de passe.";
        errorMessage.style.display = 'block';
    } 
  });
  
  