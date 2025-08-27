const corpotabela = document.getElementById("addi");

const Nome = document.getElementById("nome");
const Email = document.getElementById("email");
const Curso = document.getElementById("curso");

let aluno;
let listadealunos = [];

function efetuarcadastro() {
	aluno = criarAluno(Nome.value, Email.value, Curso.value);

	listadealunos.push(aluno);                
	incluirAlunoTabela(aluno);     
	apagarCamposHTMLDadosAluno();       
}
function criarAluno(n1Nome, n1Email, n1Curso) {
	const objetoAluno = {
		Nome: n1Nome,
		Email: n1Email,
		Curso: n1Curso,
	};
	return objetoAluno;
}

function criarNovaLinha() {
	const novaLinha = document.createElement("tr");

	novaLinha.innerHTML = `
        <td>${aluno.Nome}</td><td>${aluno.Email}</td><td>${aluno.Curso}</td>
        <td><button class="deletarButton" onclick="apagarAluno('${aluno.Email}')">Apagar</button></td>
		<td><button class="alterarButton" type="button" onclick="alterarAluno(this)">Alterar</button></td>
    `;
	return novaLinha;
}
function incluirAlunoTabela() {
    const novaLinha = criarNovaLinha(aluno);  
    corpotabela.appendChild(novaLinha);
}

function alterarAluno(botao) {
    const linha = botao.parentElement.parentElement;
    const alunoEmail = linha.cells[1].textContent;

    const aluno = listadealunos.find(a => a.Email === alunoEmail);
    if (!aluno) {
        alert("Aluno não encontrado.");
        return;
    }

    const novoNome = prompt("Digite o novo nome:", aluno.Nome);
    const novoEmail = prompt("Digite o novo email:", aluno.Email);
    const novoCurso = prompt("Digite o novo curso:", aluno.Curso);

    if (novoNome && novoEmail && novoCurso) {
        aluno.Nome = novoNome;
        aluno.Email = novoEmail;
        aluno.Curso = novoCurso;

        linha.cells[0].textContent = novoNome;
        linha.cells[1].textContent = novoEmail;
        linha.cells[2].textContent = novoCurso;
    } else {
        alert("Dados inválidos. Alteração cancelada.");
    }
}

function apagarAluno(alunoEmail) {
    apagarAlunoDaTabela(alunoEmail);
    apagarAlunoDoArray(alunoEmail);
}

function apagarAlunoDaTabela(alunoEmail) {
    const linhas = corpotabela.getElementsByTagName("tr");
    for (let linha of linhas) {
        if (linha.cells[1].textContent === alunoEmail) { 
            linha.remove();
            break;
        }
    }
}

function apagarAlunoDoArray(alunoEmail) {
    const indice = listadealunos.findIndex(a => a.Email === alunoEmail);
    if (indice > -1) listadealunos.splice(indice, 1);
}

function apagarCamposHTMLDadosAluno() {
    Nome.value = "";
    Email.value = "";
    Curso.value = "";
}
