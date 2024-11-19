const apiBaseUrl = 'http://184.72.103.204:3333/usuario'; // Substitua pela URL base da API, se necessário

// Função de Login (usando PUT)
function realizarLogin(email, senha) {
    fetch(`${apiBaseUrl}/login`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao realizar login. Verifique suas credenciais.');
        }
        return response.json();
    })
    .then(response => {
        alert(`${response.mensagem}\n${response.usuario[0].nome}`);

        if (response.mensagem === "Bem vindo !") {
            localStorage.setItem('usuario', JSON.stringify(response.usuario[0]));
            window.location.href = './catalogo.html';
        }
    })
    .catch(error => {
        alert(error.message || 'Erro inesperado ao realizar login.');
    });
}

// Função de Cadastro (usando PUT e incluindo idPerfil)
function realizarCadastro(nome, email, senha) {
    fetch(`${apiBaseUrl}/cadastrar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha, idPerfil: 1 })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao realizar cadastro. Verifique os dados informados.');
        }
        return response.json();
    })
    .then(() => {
        alert(`Cadastro realizado com sucesso!\nUsuario: ${nome}\nE-mail: ${email}`);
    })
    .catch(error => {
        alert(error.message || 'Erro inesperado ao realizar cadastro.');
    });
}

// Event Listeners para os formulários
document.getElementById('loginFormElement').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;
    realizarLogin(email, senha);
});

document.getElementById('signupFormElement').addEventListener('submit', function (e) {
    e.preventDefault();
    const nome = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const senha = document.getElementById('signupPassword').value;
    realizarCadastro(nome, email, senha);

    window.location.href = '/login_Cadastro.html';
});
