// Aguarda o DOM (estrutura HTML) ser completamente carregado
document.addEventListener("DOMContentLoaded", () => {

    // --- Seletores de Elementos ---
    const loginForm = document.getElementById("login-form");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const userCountSpan = document.getElementById("user-count");
    
    // Para o "olho" da senha
    const togglePassword = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("password");
    const iconEye = document.getElementById("icon-eye");
    const iconEyeOff = document.getElementById("icon-eye-off");

    // Para a notificação (toast)
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    // --- Funções Auxiliares ---

    /**
     * Exibe uma notificação toast.
     * @param {string} message - A mensagem a ser exibida.
     * @param {boolean} [isError=false] - Se é uma mensagem de erro (vermelha).
     */
    function showToast(message, isError = false) {
        toastMessage.textContent = message;
        
        // Remove classes de erro/sucesso anteriores
        toast.classList.remove("error");
        
        if (isError) {
            toast.classList.add("error");
        }
        
        toast.classList.add("show");

        // Esconde o toast após 3 segundos
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    /**
     * Alterna a visibilidade da senha (password/text).
     */
    function handleTogglePassword() {
        const isPassword = passwordInput.type === "password";
        
        passwordInput.type = isPassword ? "text" : "password";
        iconEye.classList.toggle("hidden", isPassword);
        iconEyeOff.classList.toggle("hidden", !isPassword);
    }

    // --- Funções Principais (Lógica de Login) ---

    /**
     * Manipula o envio do formulário de login com Email/Senha.
     * @param {Event} event - O evento de submit do formulário.
     */
    async function handleEmailLogin(event) {
        event.preventDefault(); // Impede o recarregamento da página

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        // Validação simples no frontend
        if (!email || !password) {
            showToast("Por favor, preencha o email e a senha.", true);
            return;
        }

        // <-- BACKEND AQUI (Início) -->
        // 1. O JavaScript NÃO PODE conectar ao MySQL.
        // 2. Você deve enviar esses dados para seu servidor (backend PHP, Node.js, etc.)
        
        try {
            /*
            // Exemplo de como enviar dados para seu backend:
            const response = await fetch("/api/login", { // Use a URL do seu backend
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (data.success) {
                // Sucesso! O backend confirmou o login
                showToast("Login realizado com sucesso! Redirecionando...");
                // Redireciona para o catálogo
                setTimeout(() => {
                    window.location.href = "../catalogo/index.html";
                }, 1500);
            } else {
                // Falha! O backend negou o login
                showToast(data.message || "Email ou senha inválidos.", true);
            }
            */
            
            // Simulação (remova isso quando seu backend estiver pronto)
            console.log("Simulando login:", email, password);
            showToast("Backend (MySQL) não conectado. Simulação.", true);
            
            
        } catch (error) {
            console.error("Erro ao tentar logar:", error);
            showToast("Erro de conexão com o servidor.", true);
        }
        // <-- BACKEND AQUI (Fim) -->
    }

    /**
     * Manipula o clique no botão "Continue with Google".
     */
    function handleGoogleLogin() {
        // <-- BACKEND AQUI (Início) -->
        // O login com Google também depende do seu backend (usando OAuth 2.0).
        // O JavaScript (frontend) não pode fazer isso sozinho.
        
        // 1. O usuário clica neste botão.
        // 2. O frontend deve redirecionar o usuário para uma URL do *seu* backend.
        //    Exemplo: window.location.href = "/auth/google";
        // 3. O seu backend (Node.js/PHP) usa uma biblioteca (ex: Passport.js)
        //    para redirecionar o usuário para a tela de login do Google.
        // 4. Após o login, o Google redireciona de volta para o seu backend.
        // 5. Seu backend verifica o usuário no MySQL (cria se for novo,
        //    incrementa o contador) e então redireciona o usuário para o catálogo.

        console.log("Botão Google clicado. Requer implementação de OAuth 2.0 no backend.");
        showToast("Login com Google requer configuração de backend (OAuth 2.0).", true);
        // <-- BACKEND AQUI (Fim) -->
    }

    /**
     * Busca a contagem total de usuários no backend.
     */
    async function fetchUserCount() {
        // <-- BACKEND AQUI (Início) -->
        // 1. Seu backend deve ter uma "rota" (ex: /api/user-count)
        // 2. Essa rota executa no MySQL: "SELECT COUNT(*) as total FROM usuarios;"
        // 3. O backend retorna um JSON: { "count": 12345 }

        try {
            /*
            // Exemplo de como buscar o contador do seu backend:
            const response = await fetch("/api/user-count"); // Use a URL do seu backend
            const data = await response.json();

            if (data.count) {
                // Formata o número (ex: 12345 -> 12.345)
                const formattedCount = data.count.toLocaleString('pt-BR');
                userCountSpan.textContent = formattedCount;
            } else {
                 userCountSpan.textContent = "10M+"; // Fallback
            }
            */
            
            // Simulação (remova isso quando seu backend estiver pronto)
            console.log("Simulando contagem de usuários.");
            userCountSpan.textContent = "10M+"; // Usando o valor do mockup
            
        } catch (error) {
            console.error("Erro ao buscar contagem de usuários:", error);
            userCountSpan.textContent = "10M+"; // Fallback em caso de erro
        }
        // <-- BACKEND AQUI (Fim) -->
    }

    // --- Adiciona os Event Listeners ---

    // Adiciona o listener para o clique no "olho" da senha
    if (togglePassword) {
        togglePassword.addEventListener("click", handleTogglePassword);
    }

    // Adiciona o listener para o envio do formulário de login
    if (loginForm) {
        loginForm.addEventListener("submit", handleEmailLogin);
    }

    // Adiciona o listener para o clique no botão Google
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", handleGoogleLogin);
    }

    // --- Execução Inicial ---

    // Busca a contagem de usuários assim que a página carrega
    fetchUserCount();

});
