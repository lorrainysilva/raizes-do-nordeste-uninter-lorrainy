document.addEventListener("DOMContentLoaded", () => {
    const pontosAcumulados = parseInt(localStorage.getItem("pontosFidelidade")) || 0;
    const elementoSaldoPontos = document.getElementById("saldo-pontos");
    const circulos = document.querySelectorAll(".carimbo");

    if (elementoSaldoPontos) {
        elementoSaldoPontos.textContent = pontosAcumulados;
    }

    circulos.forEach(circulo => {
        const numeroPonto = parseInt(circulo.getAttribute("data-ponto"));
        circulo.classList.toggle("carimbado", pontosAcumulados >= numeroPonto);
    });
});