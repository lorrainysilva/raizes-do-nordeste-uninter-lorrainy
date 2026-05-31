function mostrarComidas(caixa, dados) {
    try {
        var itens = JSON.parse(dados);
        if (!itens || !itens.length) return;
        
        var htmlFinal = "";
        for (var i = 0; i < itens.length; i++) {
            var prato = itens[i];
            var nomePrato = typeof prato === "object" ? prato.nome : prato;
            htmlFinal += '<p style="margin: 5px 0; color: #3e2723;">• ' + nomePrato + '</p>';
        }
        caixa.innerHTML = htmlFinal;
    } catch (e) {
        console.log("Erro ao processar lista: ", e);
    }
}
window.onload = function() {
    var vSalvo = localStorage.getItem("valorDoPedido");
    var iSalvos = localStorage.getItem("itensDoPedido");
    let pontosAtuais = parseInt(localStorage.getItem("pontosFidelidade")) || 0;
    
    var txtExibido = document.getElementById("valor-total-exibido");
    var boxItens = document.getElementById("lista-itens-pagamento");
    var formulario = document.querySelector("form");
    var pagamento = document.getElementById("forma-pagamento");

    if (vSalvo && txtExibido) {
        txtExibido.innerText = vSalvo.replace(".", ",");
    }
    if (iSalvos && boxItens) {
        mostrarComidas(boxItens, iSalvos);
    }
    if (formulario) {
        formulario.onsubmit = function(evento) {
            evento.preventDefault();

            if (!vSalvo || parseFloat(vSalvo) <= 0) {
                alert("Ops! Seu carrinho está vazio. Adicione um prato antes de pagar.");
                return;
            }
            
            var granaGasta = parseFloat(vSalvo);
            var modalidade = pagamento ? pagamento.options[pagamento.selectedIndex].text : "Não informada";
            
            alert("Conectando ao serviço de pagamento externo... Por favor, aguarde.");

            if (modalidade.toLowerCase().includes("dinheiro")) {
                alert("Erro de comunicação: O sistema de pagamento externo está indisponível.");
                alert("Sua tentativa foi registrada. Por favor, tente outra modalidade ou dirija-se ao balcão.");
                return;
            }
            var novosPontos = Math.floor(granaGasta / 10);
            var textoAlerta = "Pedido enviado com sucesso!\n\nForma de pagamento: " + modalidade + "\nTotal: R$ " + vSalvo.replace(".", ",") + "\n";

            if (novosPontos > 0) {
                pontosAtuais += novosPontos;
                
                if (pontosAtuais >= 10) {
                    textoAlerta += "\nPARABÉNS! Você completou seu cartão fidelidade e ganhou uma cortesia para o próximo pedido!";
                    pontosAtuais -= 10; 
                } else {
                    textoAlerta += "\nVocê ganhou +" + novosPontos + " carimbos! Saldo atualizado na tela de fidelidade.";
                }
                localStorage.setItem("pontosFidelidade", pontosAtuais);
            }
            
            alert(textoAlerta);
            
            localStorage.removeItem("valorDoPedido");
            localStorage.removeItem("itensDoPedido");
            
            setTimeout(function() {
                window.location.href = "cardapio.html";
            }, 1000);
        };
    }
};
