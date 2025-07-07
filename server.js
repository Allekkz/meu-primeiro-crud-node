const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cadastro_db");

//Criação do banco, se não existir:
db.run(`
    CREATE TABLE IF NOT EXISTS Usuarios (
    Id INTEGER PRIMARY KEY,
    Nome TEXT,
    Senha TEXT
    )
    `)

//Rotas Express:
app.get("/", (req, res) => {
    res.send("Servidor rodando");
});

//Rota para cadastro:
app.post("/cadastrar", (req, res) => {
    const { nome, senha } = req.body;
    db.get("SELECT * FROM Usuarios WHERE Nome = ?",
        [nome],
        (err, row) => {
            if (err) {
                res.status(500).send("Erro no banco!");
            }
            else if (row) {
                res.status(400).send("Nome de usuário já cadastrado!");
            }
            else {
                db.run("INSERT INTO Usuarios (Nome, Senha) VALUES (?, ?)",
                    [nome, senha],
                    function (err) {
                        if (err) {
                            res.status(500).send("Erro ao cadastrar, tente novamente!");
                        }
                        else {
                            res.send("Usuário cadastrado com sucesso!");
                        }
                    }
                )
            }
        }
    )
});

//Rota para listagem de usuários:
app.get("/usuarios", (req, res) => {
    db.all("SELECT * FROM Usuarios", (err, rows) => {
        if (err) {
            res.status(500).send("Erro ao listar os usuários!");
        }
        else {
            res.json(rows);
        }
    })
})

//Rota para deletar usuário:
app.delete("/deletar/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM Usuarios WHERE Id = ?", [id], function (err) {
        if (err) {
            res.status(500).send("Erro ao deletar o usuário!");
        }
        else {
            res.send("Usuário deletado com sucesso!");
        }
    })
})

//Rota para atualizar usuário:
app.put("/atualizar/:id", (req, res) => {
    const id = req.params.id;
    const { nome, senha } = req.body;

    db.run("UPDATE Usuarios SET Nome = ?, Senha = ? WHERE Id = ?", [nome, senha, id],
        function (err) {
            if (err) {
                res.status(500).send("Erro ao atualizar usuário!");
            }
            else if (this.changes === 0) {
                res.status(400).send("Usuário não encontrado");
            }
            else {
                res.send("Usuário atualizado com sucesso!");
            }
        }
    )
})

// Servidor rodando:
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});


