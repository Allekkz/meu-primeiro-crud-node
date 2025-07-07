carregarUsuarios();

function cadastrar() {
    const nomeInput = document.getElementById("nomeInput");
    const senhaInput = document.getElementById("senhaInput")

    if (nomeInput.value !== "" && senhaInput.value !== "") {

        fetch("http://localhost:3000/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: nomeInput.value,
                senha: senhaInput.value,
            })
        })
            .then(res => res.text())
            .then(msg => {
                alert(msg);
                carregarUsuarios();
            })
            .catch(err => alert("Erro" + err));
    }
    else {
        alert("Preencha todos os campos para seguir com o cadastro!")
    }
}

function carregarUsuarios() {
    fetch("http://localhost:3000/usuarios")
        .then(res => res.json())
        .then(lista => {
            const tabelaUsuarios = document.getElementById("tabelaUsuarios");
            tabelaUsuarios.innerHTML = "";

            lista.forEach(usuario => {
                const tr = document.createElement("tr");
                tr.textContent = "";

                const tdId = document.createElement("td");
                tdId.textContent = usuario.Id;

                const tdNome = document.createElement("td");
                tdNome.textContent = usuario.Nome;

                const tdEditar = document.createElement("td");
                const btnedit = document.createElement("button");
                btnedit.innerHTML = `<span class="material-symbols-outlined">
edit
</span>`;
                btnedit.onclick = () => {
                    if (confirm(`Confirmar edição do usuário ${usuario.Nome}`)) {
                        atualizarUsuario(usuario.Id);
                    }
                }
                tdEditar.appendChild(btnedit);

                const tdDeletar = document.createElement("td");
                const btn = document.createElement("button");
                btn.innerHTML = `<span class="material-symbols-outlined">
delete
</span>`;
                btn.onclick = () => {
                    if (confirm(`Confirmar remoção do usuário ${usuario.Nome}`)) {
                        deletarUsuario(usuario.Id);
                    }
                }
                tdDeletar.appendChild(btn);

                tr.appendChild(tdId);
                tr.appendChild(tdNome);
                tr.appendChild(tdEditar);
                tr.appendChild(tdDeletar);
                tabelaUsuarios.appendChild(tr)
            })
        })
        .catch(err => alert("Erro ao carregar os usuários! " + err))
}

function deletarUsuario(id) {
    fetch(`http://localhost:3000/deletar/${id}`, {
        method: "DELETE"
    })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            carregarUsuarios();
        })
        .catch(err => alert("Erro ao deletar o usuário! " + err))
}

function atualizarUsuario(id) {
    fetch(`http://localhost:3000/atualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: prompt("Novo nome:"),
            senha: prompt("Nova senha:")
        })
    })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            carregarUsuarios();
        })
        .catch(err => alert("Erro ao atulizar usuário: " + err))
}