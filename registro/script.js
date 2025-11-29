document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. VERIFICAÇÃO VISUAL (Impede envio se vazio)
    // O layout.js já cuida de mostrar a borda vermelha.
    // Aqui só paramos o código se o form estiver inválido.
    if (!e.target.checkValidity()) {
        return;
    }

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validação de Senha
    if (password !== confirmPassword) {
        if(window.showToast) showToast("As senhas não coincidem!", "error");
        else alert("As senhas não coincidem!");
        return;
    }

    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch("http://localhost/tcc/api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            // Sucesso com Toast
            if(window.showToast) showToast("Conta criada com sucesso!");
            else alert("Conta criada com sucesso!");
            
            setTimeout(() => {
                window.location.href = "../login/index.html";
            }, 1500);
        } else {
            // Erro da API (Ex: Email já existe) com Toast
            if(window.showToast) showToast(result.message || "Erro ao criar conta", "error");
            else alert(result.message || "Erro ao criar conta");
        }
    } catch (error) {
        console.error("Erro:", error);
        if(window.showToast) showToast("Erro de conexão com o servidor.", "error");
        else alert("Erro de conexão.");
    }
});