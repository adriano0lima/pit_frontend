const divCards = document.querySelector("#productContainer");
const sair = document.querySelector("#sairButton");
const carrinho = document.querySelector("#cartButton");

// Logout ao clicar no botão de sair
sair.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = './index.html';
});

// Redireciona para a página do carrinho
carrinho.addEventListener('click', () => {
    window.location.href = './carrinho.html';
});

// Carrega os produtos ao carregar a página
window.addEventListener("load", async () => {
    try {
        const response = await fetch("http://184.72.103.204:3333/produto");
        if (!response.ok) throw new Error("Erro ao carregar os produtos.");
        const produtos = await response.json();

        // Processa os dados e cria os cards para os produtos
        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${srcIMG(produto.idCategoria)}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2)}</p>
                <label for="quantidade-${produto.id}">Quantidade:</label>
                <select id="quantidade-${produto.id}" class="combo-quantidade">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button value="${produto.id}" class="cardButton">Adicionar ao Carrinho</button>
            `;

            divCards.appendChild(card);

            const button = card.querySelector('.cardButton');
            button.addEventListener('click', () => {
                const qtd = parseInt(document.querySelector(`#quantidade-${produto.id}`).value);
                addCarrinho(qtd, produto.id);
            });
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

// Função para adicionar produto ao carrinho
async function addCarrinho(quantidade, idProduto) {
    const idUsuario = JSON.parse(localStorage.usuario).id;

    try {
        const response = await fetch('http://184.72.103.204:3333/carrinho', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantidade, idProduto, idUsuario })
        });

        if (!response.ok) throw new Error('Erro ao adicionar ao carrinho.');

        const data = await response.json();
        if (data.mensagem !== "Erro: SequelizeUniqueConstraintError: Validation error\n            Produto não adicionado") {
            alert(data.mensagem);
        } else {
            alert('Erro ao adicionar ao carrinho.');
        }

    } catch (error) {
        alert(error.message || 'Erro inesperado ao adicionar ao carrinho.');
    }
}
