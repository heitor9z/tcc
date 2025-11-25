document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }

    // Dados para enviar ao PHP
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
            alert("Conta criada com sucesso!");
            window.location.href = "../login/index.html";
        } else {
            alert(result.message || "Erro ao criar conta");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão com o servidor.");
    }
});