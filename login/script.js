// login/script.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Seletores de Elementos ---
    const loginForm = document.getElementById("login-form");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const userCountSpan = document.getElementById("user-count");
    
    const togglePassword = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("password");
    const iconEye = document.getElementById("icon-eye");
    const iconEyeOff = document.getElementById("icon-eye-off");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    const API_URL = "http://localhost/tcc/api"; 

    // --- Funções Auxiliares ---
    function showToast(message, isError = false) {
        toastMessage.textContent = message;
        toast.classList.remove("error");
        if (isError) toast.classList.add("error");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function handleTogglePassword() {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        iconEye.classList.toggle("hidden", isPassword);
        iconEyeOff.classList.toggle("hidden", !isPassword);
    }

    // --- Funções Principais ---
    async function handleEmailLogin(event) {
        event.preventDefault(); 
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        if (!email || !password) {
            showToast("Por favor, preencha o email e a senha.", true);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                // --- ATUALIZAÇÃO IMPORTANTE AQUI ---
                localStorage.setItem("user_email", email); 
                localStorage.setItem("user_name", data.user_name);
                localStorage.setItem("user_id", data.user_id); // <--- SALVA O ID DO USUÁRIO
                
                showToast("Login realizado com sucesso! Redirecionando...");
                
                setTimeout(() => {
                    window.location.href = "../catalogo/index.html";
                }, 1500);
            } else {
                showToast(data.message || "Email ou senha inválidos.", true);
            }
            
        } catch (error) {
            console.error("Erro ao tentar logar:", error);
            showToast("Erro de conexão com o servidor.", true);
        }
    }

    function handleGoogleLogin() {
        showToast("Login com Google (OAuth 2.0) ainda não implementado.", true);
    }

    async function fetchUserCount() {
        try {
            const response = await fetch(`${API_URL}/user-count.php`);
            const data = await response.json();
            if (data.count) {
                userCountSpan.textContent = data.count.toLocaleString('pt-BR');
            } else {
                 userCountSpan.textContent = "10.000+";
            }
        } catch (error) {
            userCountSpan.textContent = "10.000+";
        }
    }

    // --- Event Listeners ---
    if (togglePassword) togglePassword.addEventListener("click", handleTogglePassword);
    if (loginForm) loginForm.addEventListener("submit", handleEmailLogin);
    if (googleLoginBtn) googleLoginBtn.addEventListener("click", handleGoogleLogin);

    fetchUserCount();
});