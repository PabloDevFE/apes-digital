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

/* =========================================
     ENVIO REAL DO FORMULÁRIO COM PROTEÇÃO ANTI-SPAM
     ========================================= */
  const formOrçamento = document.getElementById('orcamento-form');
  const btnSubmit = formOrçamento.querySelector('.form-submit-btn');

  // ⚠️ SUA URL DO GOOGLE AQUI
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgB-qaX9kayCGfUz4JsdyLDE4F7wAI6dLmb0nPO9TPEvA_GwMfmFrEhZ7Knp-O-Q/exec';

  formOrçamento.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // 1. PROTEÇÃO HONEYPOT (Pega Robôs)
    const honeypot = document.getElementById('website-url').value;
    if (honeypot !== '') {
      // Se tiver algo escrito, é robô! Fingimos sucesso e cancelamos.
      console.log('Spam bot bloqueado com sucesso.');
      alert('🚀 Sucesso! Orçamento enviado. Nossa equipe vai te chamar no WhatsApp em breve!');
      formOrçamento.reset();
      return; // Para a execução do código aqui. Não envia pro Google.
    }

    // 2. PROTEÇÃO DE METRALHADORA (Cooldown de 60 segundos)
    const ultimaTentativa = localStorage.getItem('lastSubmitTime');
    const agora = new Date().getTime();
    
    if (ultimaTentativa && (agora - ultimaTentativa < 60000)) {
      // 60000 ms = 1 minuto
      alert('⚠️ Calma aí! Você já enviou um pedido agora pouco. Aguarde um minutinho para enviar de novo.');
      return;
    }

    // --- SE PASSOU PELAS DEFESAS, INICIA O ENVIO REAL ---
    
    const textoOriginalBotao = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'Enviando... ⏳';
    btnSubmit.disabled = true; 
    
    const formData = new FormData(formOrçamento);
    
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        alert('🚀 Sucesso! Orçamento enviado. Nossa equipe vai te chamar no WhatsApp em breve!');
        formOrçamento.reset();
        planoGroup.style.display = 'none';
        planoInput.value = '';
        
        // Registra a hora que enviou com sucesso no cache do navegador
        localStorage.setItem('lastSubmitTime', new Date().getTime());
      } else {
        alert('❌ Ocorreu um erro ao enviar. Por favor, nos chame diretamente no WhatsApp!');
      }
    })
    .catch(error => {
      alert('❌ Erro de conexão. Por favor, nos chame no WhatsApp!');
    })
    .finally(() => {
      btnSubmit.innerHTML = textoOriginalBotao;
      btnSubmit.disabled = false;
    });
  });