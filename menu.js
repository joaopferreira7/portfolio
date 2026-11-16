// Menu recolhível do celular. O botão só aparece abaixo de 641 px (style.css).
function iniciarMenu() {
  const botao = document.querySelector(".nav-toggle");
  const lista = document.getElementById("nav-links");
  if (!botao || !lista) return;
  const definir = (aberto) => botao.setAttribute("aria-expanded", String(aberto));
  botao.addEventListener("click", () => definir(botao.getAttribute("aria-expanded") !== "true"));
  lista.addEventListener("click", (e) => {
    if (e.target.closest("a")) definir(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      definir(false);
      botao.focus();
    }
  });
}
iniciarMenu();
