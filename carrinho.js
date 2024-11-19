document.addEventListener("DOMContentLoaded", () => {
    const sairButton = document.querySelector("#sairButton");
    const tabelaCarrinho = document.querySelector("#tabelaCarrinho tbody");
    const userId = JSON.parse(localStorage.usuario)?.id;

    if (!userId) {
        alert("Usuário não encontrado.");
        return;
    }

    sairButton.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = './index.html';
    });

    // Função para carregar o carrinho do usuário
    async function carregarCarrinho() {
        try {
            const response = await fetch("http://184.72.103.204:3333/carrinho/meucarrinho", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId }),
            });

            if (!response.ok) throw new Error("Erro ao carregar o carrinho.");

            const data = await response.json();
            tabelaCarrinho.innerHTML = "";

            for (const item of data) {
                const produto = await obterProduto(item.idProduto);
                const linha = criarLinhaCarrinho(produto, item);
                tabelaCarrinho.appendChild(linha);
            }

            // Adiciona o evento de remoção para cada item
            adicionarEventosRemover();
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar o carrinho.");
        }
    }

    // Função para buscar detalhes do produto
    async function obterProduto(idProduto) {
        try {
            const response = await fetch(`http://184.72.103.204:3333/produto/${idProduto}`);
            if (!response.ok) throw new Error(`Erro ao buscar o produto com ID ${idProduto}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            return { nome: "Produto não encontrado", preco: 0.0 };
        }
    }

    // Cria uma linha para o carrinho
    function criarLinhaCarrinho(produto, item) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>R$ ${(produto.preco * item.quantidade).toFixed(2)}</td>
            <td>
                <button class="btn-remover" data-id="${item.id}">Remover</button>
            </td>
        `;
        return linha;
    }

    // Adiciona o evento de remover item ao botão
    function adicionarEventosRemover() {
        document.querySelectorAll(".btn-remover").forEach(button => {
            button.addEventListener("click", async function () {
                const itemId = this.getAttribute("data-id");
                await removerItem(itemId);
            });
        });
    }

    // Função para remover um item do carrinho
    async function removerItem(itemId) {
        try {
            const response = await fetch(`http://184.72.103.204:3333/carrinho/${itemId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erro ao remover item.");

            alert("Item removido com sucesso!");
            carregarCarrinho();
        } catch (error) {
            console.error(error);
            alert("Erro ao remover o item.");
        }
    }

    // Função para finalizar a compra
    window.finalizarCompra = async () => {
        try {
            const response = await fetch("http://184.72.103.204:3333/carrinho/meucarrinho", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId }),
            });

            if (!response.ok) throw new Error("Erro ao carregar os itens do carrinho.");

            const carrinho = await response.json();

            for (const item of carrinho) {
                await fetch(`http://184.72.103.204:3333/carrinho/${item.id}`, { method: "DELETE" });
            }

            alert("Compra finalizada com sucesso!");
            carregarCarrinho();
        } catch (error) {
            console.error(error);
            alert("Erro ao finalizar a compra.");
        }
    };

    carregarCarrinho();
});
