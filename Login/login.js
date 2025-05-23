const form = document.getElementById('loginForm')
const erroLogin = document.getElementById('erroLogin')

form.addEventListener('submit', async(e) =>{
    e.preventDefault()

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;


    try{
        const res = await fetch('https://backend-resultados.onrender.com/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, senha})
        })

        if(res.ok){
            const {token, nome} = await res.json();
            localStorage.setItem('token', token)
            localStorage.setItem('nomeUsuario', nome)
            window.location.href = '../Promotores/promotores.html'
        } else {
            erroLogin.style.display = 'block'
        }
    } catch (err){
        alert("Erro ao tentar Logar")
    }
})