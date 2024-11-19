const divCards = document.querySelector("#productContainer");
const btnConta = document.querySelector("#contaButton");

// Redireciona para a página de login ou cadastro ao clicar no botão
btnConta.addEventListener('click', () => {
    window.location.href = '/login_Cadastro.html';
});

// Carrega os produtos ao carregar a página
window.addEventListener("load", async () => {
    try {
        const response = await fetch("http://184.72.103.204:3333/produto");
        if (!response.ok) throw new Error("Erro ao carregar os produtos.");
        const produtos = await response.json();

        // Cria os cards para os produtos
        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${srcIMG(produto.idCategoria)}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2)}</p>
            `;

            divCards.appendChild(card);
        });

    } catch (error) {
        alert(error.message);
    }
});

// Retorna o caminho da imagem do produto com base na categoria
function srcIMG(idCategoria) {
    const categorias = {
        1: '/images/Pneu.jpeg',
        2: '/images/Roda.jpeg',
        3: '/images/Som.jpeg'
    };
    return categorias[idCategoria] || '/images/default.jpg';
}
