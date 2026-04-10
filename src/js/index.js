document.addEventListener("DOMContentLoaded", () => {
  let e = { root: null, rootMargin: "0px", threshold: 0.15 },
    t = new IntersectionObserver((e, t) => {
      e.forEach((e) => {
        e.isIntersecting &&
          (e.target.classList.add("active"), t.unobserve(e.target));
      });
    }, e);
  document.querySelectorAll(".reveal").forEach((e) => t.observe(e));
});
const planButtons = document.querySelectorAll(".select-plan-btn"),
  planoGroup = document.getElementById("plano-group"),
  planoInput = document.getElementById("plano"),
  clearPlanoBtn = document.getElementById("clear-plano");
(planButtons.forEach((e) => {
  e.addEventListener("click", (e) => {
    let t = e.target.getAttribute("data-plano");
    ((planoInput.value = t),
      (planoGroup.style.display = "block"),
      setTimeout(() => {
        document.getElementById("nome").focus();
      }, 800));
  });
}),
  clearPlanoBtn.addEventListener("click", () => {
    ((planoInput.value = ""), (planoGroup.style.display = "none"));
  }));
const formOrçamento = document.getElementById("orcamento-form"),
  btnSubmit = formOrçamento.querySelector(".form-submit-btn"),
  boxSucesso = document.getElementById("mensagem-sucesso"),
  foguete = document.getElementById("rocket-icon"),
  btnNovo = document.getElementById("btn-novo-orcamento");
function dispararSucesso() {
  ((formOrçamento.style.display = "none"),
    (boxSucesso.style.display = "flex"),
    foguete.classList.remove("fly-animation"),
    foguete.offsetWidth,
    foguete.classList.add("fly-animation"));
}
(document.addEventListener("DOMContentLoaded", () => {
  let e = document.getElementById("menu-toggle"),
    t = document.getElementById("main-nav"),
    n = document.querySelectorAll(".nav-links a");
  e &&
    t &&
    (e.addEventListener("click", () => {
      (e.classList.toggle("active"), t.classList.toggle("active"));
    }),
    n.forEach((n) => {
      n.addEventListener("click", () => {
        (e.classList.remove("active"), t.classList.remove("active"));
      });
    }));
}),
  btnNovo.addEventListener("click", () => {
    ((boxSucesso.style.display = "none"),
      (formOrçamento.style.display = "block"));
  }),
  formOrçamento.addEventListener("submit", (e) => {
    if (
      (e.preventDefault(), "" !== document.getElementById("website-url").value)
    ) {
      (console.log("Spam bot bloqueado com sucesso."),
        dispararSucesso(),
        formOrçamento.reset());
      return;
    }
    let t = localStorage.getItem("lastSubmitTime"),
      n = new Date().getTime();
    if (t && n - t < 6e4) {
      alert(
        "⚠️ Calma a\xed! Voc\xea j\xe1 enviou um pedido agora pouco. Aguarde um minutinho.",
      );
      return;
    }
    let o = btnSubmit.innerHTML;
    ((btnSubmit.innerHTML = "Enviando... ⏳"),
      (btnSubmit.disabled = !0),
      fetch(
        "https://script.google.com/macros/s/AKfycbxgB-qaX9kayCGfUz4JsdyLDE4F7wAI6dLmb0nPO9TPEvA_GwMfmFrEhZ7Knp-O-Q/exec",
        { method: "POST", body: new FormData(formOrçamento) },
      )
        .then((e) => e.json())
        .then((e) => {
          "success" === e.result
            ? (dispararSucesso(),
              formOrçamento.reset(),
              (planoGroup.style.display = "none"),
              (planoInput.value = ""),
              localStorage.setItem("lastSubmitTime", new Date().getTime()))
            : alert(
                "❌ Ocorreu um erro ao enviar. Por favor, nos chame diretamente no WhatsApp!",
              );
        })
        .catch((e) => {
          alert("❌ Erro de conex\xe3o. Por favor, nos chame no WhatsApp!");
        })
        .finally(() => {
          ((btnSubmit.innerHTML = o), (btnSubmit.disabled = !1));
        }));
  }));
const telefoneInput = document.getElementById("telefone");
telefoneInput.addEventListener("input", (e) => {
  let t = e.target.value.replace(/\D/g, "");
  if (0 === t.length) {
    e.target.value = "";
    return;
  }
  (t.length > 11 && (t = t.substring(0, 11)),
    (t =
      t.length <= 2
        ? t.replace(/^(\d{0,2})/, "($1")
        : t.length <= 6
          ? t.replace(/^(\d{2})(\d{0,4})/, "($1) $2")
          : t.length <= 10
            ? t.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
            : t.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")),
    (e.target.value = t));
});
