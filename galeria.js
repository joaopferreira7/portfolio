// Lightbox da galeria das páginas de projeto: a miniatura abre a imagem grande (data-src).
function iniciarGaleria() {
  const caixa = document.getElementById("lightbox");
  const imagem = document.getElementById("lightbox-img");
  if (!caixa || !imagem) return;
  document.querySelectorAll(".gallery button[data-src]").forEach((botao) =>
    botao.addEventListener("click", () => {
      imagem.src = botao.dataset.src;
      imagem.alt = botao.querySelector("img")?.alt || "";
      caixa.showModal();
    })
  );
  caixa.addEventListener("click", () => caixa.close());
}
iniciarGaleria();
