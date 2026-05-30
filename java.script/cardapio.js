window.onload = () => {
    const botoes = document.querySelectorAll(".adicionar");
    const textoTotal = document.querySelector(".valor-total");
    const linkPagar = document.querySelector(".pagamento"); 
    const divSacola = document.getElementById("itens-na-sacola");
    const barraTotal = document.querySelector(".barra-total");
    
    let carrinho = [];

    const atualizarInterface = () => {
        if (!divSacola || !textoTotal) return;

        const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

        divSacola.innerHTML = carrinho.map((item, index) => `
            <div class="linha-item-sacola">
                <span>${item.nome}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>R$ ${item.preco.toFixed(2).replace(".", ",")}</span>
                    <button class="botao-remover-item" data-index="${index}">✕</button>
                </div>
            </div>
        `).join("");

        textoTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;

        if (barraTotal) {
            barraTotal.style.display = carrinho.length > 0 ? "flex" : "none";
        }

        // Adiciona o clique de remover nos botões criados pelas crases
        divSacola.querySelectorAll(".botao-remover-item").forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const index = parseInt(btn.getAttribute("data-index"));
                carrinho.splice(index, 1);
                atualizarInterface();
            };
        });
    };

    botoes.forEach(btn => {
        btn.onclick = (e) => {
            const caixaPrato = e.target.closest(".item-prato");
            const nome = caixaPrato.querySelector(".nome-prato").textContent;
            const precoTexto = caixaPrato.querySelector(".preco-prato").textContent;
            
            const preco = parseFloat(precoTexto.replace("R$", "").replace(",", ".").trim());
            
            carrinho.push({ nome, preco });
            atualizarInterface();
        };
    });

    if (barraTotal) {
        barraTotal.onclick = () => {
            if (window.innerWidth < 992) {
                barraTotal.classList.toggle("sacola-aberta");
            }
        };
    }

    if (linkPagar) {
        linkPagar.onclick = (e) => {
            e.stopPropagation();
            if (carrinho.length > 0) {
                const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
                localStorage.setItem("valorDoPedido", total.toFixed(2));
                localStorage.setItem("itensDoPedido", JSON.stringify(carrinho));
            }
        };
    }
};