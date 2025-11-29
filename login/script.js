// login/script.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Configurações ---
    const loginForm = document.getElementById("login-form");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const API_URL = "http://localhost/tcc/api"; 
    
    // ATENÇÃO: COLOQUE SEU CLIENT ID REAL AQUI
    // Exemplo: "123456789-abcdefg.apps.googleusercontent.com"
    const GOOGLE_CLIENT_ID = "346068481550-mso6ilvef036vviap4r92fiprlbq4f0s.apps.googleusercontent.com"; 

    // --- Elementos Visuais ---
    const togglePassword = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("password");
    const iconEye = document.getElementById("icon-eye");
    const iconEyeOff = document.getElementById("icon-eye-off");

    // --- Função: Mostrar/Ocultar Senha ---
    function handleTogglePassword() {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        iconEye.classList.toggle("hidden", isPassword);
        iconEyeOff.classList.toggle("hidden", !isPassword);
    }

    // --- Função: Login Normal (Email/Senha) ---
    async function handleEmailLogin(event) {
        event.preventDefault(); 
        if (!event.target.checkValidity()) return;

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            const btnSubmit = loginForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerText;
            btnSubmit.innerText = "Entrando...";
            btnSubmit.disabled = true;

            const response = await fetch(`${API_URL}/login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                salvarLogin(email, data.user_name, data.user_id);
            } else {
                if(window.showToast) window.showToast(data.message || "Erro no login.", "error");
                btnSubmit.innerText = originalText;
                btnSubmit.disabled = false;
            }
        } catch (error) {
            console.error(error);
            if(window.showToast) window.showToast("Erro de conexão.", "error");
        }
    }

    // --- LÓGICA GOOGLE REAL ---

    // 1. Função chamada AUTOMATICAMENTE pelo Google quando o usuário loga
    async function handleCredentialResponse(response) {
        // O "response.credential" é o token JWT que o PHP precisa
        console.log("Token recebido do Google:", response.credential);

        try {
            // Envia o token para o nosso PHP validar
            const res = await fetch(`${API_URL}/google_login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }) // <--- O PHP ESPERA ISSO
            });

            const data = await res.json();

            if (res.ok) {
                // Login sucesso! O PHP validou e retornou os dados do usuário
                salvarLogin(data.user_email || "Email Google", data.user_name, data.user_id);
            } else {
                console.error("Erro PHP:", data);
                if(window.showToast) window.showToast(data.message || "Erro ao validar login.", "error");
            }
        } catch (err) {
            console.error("Erro Fetch:", err);
            if(window.showToast) window.showToast("Erro de comunicação com o servidor.", "error");
        }
    }

    // 2. Inicializa a biblioteca do Google
    window.onload = function () {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse, // Define quem recebe o token
                cancel_on_tap_outside: true
            });
            
            // Opcional: Se quiser que o Google mostre o botão dele automaticamente
            // google.accounts.id.renderButton(document.getElementById("botao-google-div"), { theme: "outline", size: "large" });
        }
    };

    // 3. Clique no botão customizado: Abre o popup
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof google !== 'undefined') {
                // Força o prompt (janelinha) a aparecer
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.warn("O prompt não foi exibido:", notification.getNotDisplayedReason());
                        // Dica: Pode acontecer se você fechou a janela recentemente (Cooldown do Google)
                        // Limpe os cookies ou abra em aba anônima para testar
                    }
                });
            } else {
                alert("Aguarde, carregando Google...");
            }
        });
    }

    // --- Função Auxiliar ---
    function salvarLogin(email, nome, id) {
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", nome);
        localStorage.setItem("user_id", id);
        
        if(window.showToast) window.showToast(`Bem-vindo, ${nome}!`);
        setTimeout(() => window.location.href = "../catalogo/index.html", 1000);
    }

    // Listeners
    if (togglePassword) togglePassword.addEventListener("click", handleTogglePassword);
    if (loginForm) loginForm.addEventListener("submit", handleEmailLogin);
});