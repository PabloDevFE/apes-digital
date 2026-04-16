const revealElements = document.querySelectorAll(".reveal");
const planButtons = document.querySelectorAll(".select-plan-btn");
const planoGroup = document.getElementById("plano-group");
const planoInput = document.getElementById("plano");
const clearPlanoBtn = document.getElementById("clear-plano");
const nomeInput = document.getElementById("nome");
const formOrcamento = document.getElementById("orcamento-form");
const btnSubmit = formOrcamento?.querySelector(".form-submit-btn");
const boxSucesso = document.getElementById("mensagem-sucesso");
const foguete = document.getElementById("rocket-icon");
const btnNovo = document.getElementById("btn-novo-orcamento");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const navLinks = document.querySelectorAll(".nav-links a");
const telefoneInput = document.getElementById("telefone");
const honeypotInput = document.getElementById("website-url");

if (revealElements.length > 0) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("active");
      currentObserver.unobserve(entry.target);
    });
  }, {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  });

  revealElements.forEach((element) => observer.observe(element));
}

if (planButtons.length > 0 && planoGroup && planoInput && nomeInput) {
  planButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const selectedPlan = event.currentTarget.getAttribute("data-plano");

      planoInput.value = selectedPlan;
      planoGroup.style.display = "block";

      setTimeout(() => {
        nomeInput.focus();
      }, 800);
    });
  });
}

if (clearPlanoBtn && planoGroup && planoInput) {
  clearPlanoBtn.addEventListener("click", () => {
    planoInput.value = "";
    planoGroup.style.display = "none";
  });
}

function dispararSucesso() {
  if (!formOrcamento || !boxSucesso || !foguete) {
    return;
  }

  formOrcamento.style.display = "none";
  boxSucesso.style.display = "flex";
  foguete.classList.remove("fly-animation");
  void foguete.offsetWidth;
  foguete.classList.add("fly-animation");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.classList.toggle("active");

    mainNav.classList.toggle("active", isExpanded);
    menuToggle.setAttribute("aria-expanded", String(isExpanded));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (btnNovo && boxSucesso && formOrcamento) {
  btnNovo.addEventListener("click", () => {
    boxSucesso.style.display = "none";
    formOrcamento.style.display = "block";
  });
}

if (formOrcamento && btnSubmit && planoGroup && planoInput && honeypotInput) {
  formOrcamento.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (honeypotInput.value !== "") {
      dispararSucesso();
      formOrcamento.reset();
      return;
    }

    const lastSubmitTime = localStorage.getItem("lastSubmitTime");
    const currentTime = Date.now();

    if (lastSubmitTime && currentTime - Number(lastSubmitTime) < 60000) {
      alert("Calma ai! Voce ja enviou um pedido agora pouco. Aguarde um minutinho.");
      return;
    }

    const originalButtonLabel = btnSubmit.innerHTML;

    btnSubmit.innerHTML = "Enviando...";
    btnSubmit.disabled = true;

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxgB-qaX9kayCGfUz4JsdyLDE4F7wAI6dLmb0nPO9TPEvA_GwMfmFrEhZ7Knp-O-Q/exec",
        {
          method: "POST",
          body: new FormData(formOrcamento),
        },
      );
      const result = await response.json();

      if (result.result === "success") {
        dispararSucesso();
        formOrcamento.reset();
        planoGroup.style.display = "none";
        planoInput.value = "";
        localStorage.setItem("lastSubmitTime", String(Date.now()));
        return;
      }

      alert("Ocorreu um erro ao enviar. Por favor, nos chame diretamente no WhatsApp!");
    } catch {
      alert("Erro de conexao. Por favor, nos chame no WhatsApp!");
    } finally {
      btnSubmit.innerHTML = originalButtonLabel;
      btnSubmit.disabled = false;
    }
  });
}

if (telefoneInput) {
  telefoneInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");

    if (value.length === 0) {
      event.target.value = "";
      return;
    }

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length <= 2) {
      value = value.replace(/^(\d{0,2})/, "($1");
    } else if (value.length <= 6) {
      value = value.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
    } else if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    event.target.value = value;
  });
}
