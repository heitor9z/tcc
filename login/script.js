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

    // URL base do seu backend
    const API_URL = "http://localhost:3000"; // Nosso backend vai rodar aqui

    // --- Funções Auxiliares ---

    /**
     * Exibe uma notificação toast.
     * @param {string} message - A mensagem a ser exibida.
     * @param {boolean} [isError=false] - Se é uma mensagem de erro (vermelha).
     */
    function showToast(message, isError = false) {
        toastMessage.textContent = message;
        
        toast.classList.remove("error");
        if (isError) {
            toast.classList.add("error");
        }
        
        toast.classList.add("show");

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

        if (!email || !password) {
            showToast("Por favor, preencha o email e a senha.", true);
            return;
        }

        // <-- ISSO MUDOU (Início) -->
        try {
            // Envia os dados para o backend
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (response.ok) { // Status 200-299
                // Sucesso! O backend confirmou o login
                showToast("Login realizado com sucesso! Redirecionando...");
                
                // Opcional: Salvar o token para usar depois
                // localStorage.setItem("authToken", data.token);
                
                // Redireciona para o catálogo
                setTimeout(() => {
                    window.location.href = "../catalogo/index.html";
                }, 1500);
            } else {
                // Falha! O backend negou o login
                showToast(data.message || "Email ou senha inválidos.", true);
            }
            
        } catch (error) {
            console.error("Erro ao tentar logar:", error);
            showToast("Erro de conexão com o servidor.", true);
        }
        // <-- ISSO MUDOU (Fim) -->
    }

    /**
     * Manipula o clique no botão "Continue with Google".
     */
    function handleGoogleLogin() {
        console.log("Botão Google clicado. Requer implementação de OAuth 2.0 no backend.");
        showToast("Login com Google (OAuth 2.0) ainda não implementado.", true);
    }

    /**
     * Busca a contagem total de usuários no backend.
     */
    async function fetchUserCount() {
        // <-- ISSO MUDOU (Início) -->
        try {
            // Busca o contador do backend
            const response = await fetch(`${API_URL}/api/user-count`);
            const data = await response.json();

            if (data.count) {
                // Formata o número (ex: 12345 -> 12.345)
                const formattedCount = data.count.toLocaleString('pt-BR');
                userCountSpan.textContent = formattedCount;
            } else {
                 userCountSpan.textContent = "10.000+"; // Fallback
            }
            
        } catch (error) {
            console.error("Erro ao buscar contagem de usuários:", error);
            userCountSpan.textContent = "10.000+"; // Fallback em caso de erro
        }
        // <-- ISSO MUDOU (Fim) -->
    }

    // --- Adiciona os Event Listeners ---

    if (togglePassword) {
        togglePassword.addEventListener("click", handleTogglePassword);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", handleEmailLogin);
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", handleGoogleLogin);
    }

    // --- Execução Inicial ---
    fetchUserCount(); // Busca a contagem assim que a página carrega
});