document.addEventListener("DOMContentLoaded", () => {
  // Configuração do "Olheiro" (Observer)
  const observerOptions = {
    root: null, // Usa a própria janela do navegador
    rootMargin: '0px',
    threshold: 0.15 // Dispara a animação quando 15% do elemento estiver visível
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Se o elemento entrou na tela
      if (entry.isIntersecting) {
        entry.target.classList.add('active'); // Adiciona a classe que faz surgir
        observer.unobserve(entry.target); // Para de observar para animar só 1 vez
      }
    });
  }, observerOptions);

  // Pega todos os elementos que têm a classe .reveal no HTML
  const revealElements = document.querySelectorAll('.reveal');
  
  // Manda o observer ficar de olho em cada um deles
  revealElements.forEach(el => observer.observe(el));
});

/* =========================================
     INTEGRAÇÃO: CARDS DE PLANOS -> FORMULÁRIO
     ========================================= */
  const planButtons = document.querySelectorAll('.select-plan-btn');
  const planoGroup = document.getElementById('plano-group');
  const planoInput = document.getElementById('plano');
  const clearPlanoBtn = document.getElementById('clear-plano');

  // 1. Quando clicar em um botão de "Quero o Plano"
  planButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Captura o nome do plano escondido no data-plano="Nome"
      const planoEscolhido = e.target.getAttribute('data-plano');
      
      // Preenche o input bloqueado do formulário com o nome do plano
      planoInput.value = planoEscolhido;
      
      // Revela a caixa "Plano Interessado" no formulário com uma animação suave de CSS
      planoGroup.style.display = 'block';
      
      // O navegador automaticamente vai rolar até o #contato por causa do href="#contato"
      
      // Foca automaticamente no campo "Nome" para o cliente começar a digitar
      setTimeout(() => {
        document.getElementById('nome').focus();
      }, 800); // Espera 0.8s (tempo de rolagem da tela)
    });
  });

  // 2. Botão de limpar (caso o usuário desista de escolher um plano e queira só mandar msg)
  clearPlanoBtn.addEventListener('click', () => {
    planoInput.value = ''; // Limpa o valor
    planoGroup.style.display = 'none'; // Esconde a caixinha
  });

  // 3. Simulação de Envio do Formulário
  const formOrçamento = document.getElementById('orcamento-form');
  formOrçamento.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    // Animação/Alerta simples de sucesso para o estilo neo-brutalista
    alert('🚀 Desenho pronto! Orçamento enviado com sucesso. Nossa equipe vai te chamar no WhatsApp em breve!');
    
    // Limpa o formulário
    formOrçamento.reset();
    planoGroup.style.display = 'none';
  });