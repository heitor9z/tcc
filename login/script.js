// login/script.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Seletores ---
    const loginForm = document.getElementById("login-form");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const userCountSpan = document.getElementById("user-count");
    
    // Senha
    const togglePassword = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("password");
    const iconEye = document.getElementById("icon-eye");
    const iconEyeOff = document.getElementById("icon-eye-off");

    const API_URL = "http://localhost/tcc/api"; 

    // --- Mostrar/Ocultar Senha ---
    function handleTogglePassword() {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        iconEye.classList.toggle("hidden", isPassword);
        iconEyeOff.classList.toggle("hidden", !isPassword);
    }

    // --- Login com Email (Lógica Principal) ---
    async function handleEmailLogin(event) {
        event.preventDefault(); 

        // 1. Validação Visual (Borda Vermelha)
        // Se o campo estiver vazio, o layout.js mostra o erro e paramos aqui.
        if (!event.target.checkValidity()) {
            return;
        }

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            // Feedback de carregamento
            const btnSubmit = loginForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerText;
            btnSubmit.innerText = "Entrando...";
            btnSubmit.disabled = true;

            const response = await fetch(`${API_URL}/login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                // Salva sessão
                localStorage.setItem("user_email", email); 
                localStorage.setItem("user_name", data.user_name);
                localStorage.setItem("user_id", data.user_id);
                
                // Usa a notificação Global (Bonita)
                if(window.showToast) window.showToast("Login realizado com sucesso!");
                
                setTimeout(() => {
                    window.location.href = "../catalogo/index.html";
                }, 1000);
            } else {
                if(window.showToast) window.showToast(data.message || "Email ou senha inválidos.", "error");
                btnSubmit.innerText = originalText;
                btnSubmit.disabled = false;
            }
            
        } catch (error) {
            console.error("Erro:", error);
            if(window.showToast) window.showToast("Erro de conexão com o servidor.", "error");
            const btnSubmit = loginForm.querySelector('button[type="submit"]');
            btnSubmit.innerText = "Entrar";
            btnSubmit.disabled = false;
        }
    }

    function handleGoogleLogin() {
        if(window.showToast) window.showToast("Login com Google em breve!", "error");
    }

    // --- Listeners ---
    if (togglePassword) togglePassword.addEventListener("click", handleTogglePassword);
    if (loginForm) loginForm.addEventListener("submit", handleEmailLogin);
    if (googleLoginBtn) googleLoginBtn.addEventListener("click", handleGoogleLogin);
});