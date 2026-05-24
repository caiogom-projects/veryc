// Configurações da Página - Index
// Ajustes e configuração de Formulário

// Formulário
const formulario = document.getElementById('registro-formulario');
const codigoBarras = document.getElementById('codigo-barras');
const quantidade = document.getElementById('quantidade');
const notaFiscal = document.getElementById('nota-fiscal');
const serieNFe = document.getElementById('serie-nfe');
const observacao = document.getElementById('observacao');
const listaEntrada = document.getElementById('lista-das-entradas');
// Excel
const btnExportar = document.getElementById('btn-exportar');
const buscarInput = document.getElementById('busca-input');
const itensPorPagina = document.getElementById('itens-por-pagina');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const indicadorPagina = document.getElementById('indicador-pagina');
// Editar ou Apagar dados
const btnLimparTudo = document.getElementById('btn-limpar-tudo');
// Controle de Variáveis
let bancoDeDadosLocal = JSON.parse(localStorage.getItem('bipes_estoque')) || [];

let paginaAtual = 1;
let limiteItensPorPagina = 10;

// Funções e configuração gerais

formulario.addEventListener('submit', function(evento) {
    // Impede que o navegador recarregue a página se bipar
    evento.preventDefault();

    // Mensagem de Teste
    console.log("Formulário registrado com sucesso.");

    // Data e Hora - Brasileiro
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
    const horaFormatada = dataAtual.toLocaleTimeString('pt-BR');

    // Dados que serão registrados
    const novoItem = {
        data: dataFormatada,
        hora: horaFormatada,
        codigo: codigoBarras.value,
        qtd: quantidade.value,
        nfe: notaFiscal.value ? `${notaFiscal.value} - ${serieNFe.value}` : " ",
        obs: observacao.value || "Sem observações"
    };
    
    // Salvando dados
    bancoDeDadosLocal.push(novoItem);
    localStorage.setItem('bipes_estoque', JSON.stringify(bancoDeDadosLocal));
    atualizarTabela();

    // Mensatem de Teste
    console.log(bancoDeDadosLocal);

    // Limpando os campos
    formulario.reset();
    codigoBarras.focus();
});

function atualizarTabela () {
    // Filtrar os dados com base na busca
    const termoBusca = buscarInput.value.toLowerCase();
    const dadosFiltrados = bancoDeDadosLocal.filter(function(item) {
        return item.codigo.toLowerCase().includes(termoBusca) ||
                item.nfe.toLowerCase().includes(termoBusca) ||
                item.obs.toLowerCase().includes(termoBusca) ||
                item.data.toLowerCase().includes(termoBusca);
    });

    const valorLimite = itensPorPagina.value;
    limiteItensPorPagina = valorLimite === "all" ? dadosFiltrados.length : parseInt(valorLimite);

    const totalPaginas = Math.ceil(dadosFiltrados.length / limiteItensPorPagina) || 1;

    if(paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const indiceInicial = (paginaAtual - 1) * limiteItensPorPagina;
    const indiceFinal = indiceInicial + limiteItensPorPagina;
    const itensDaPagina = dadosFiltrados.slice(indiceInicial, indiceFinal);

    // Limpa o texto básico
    listaEntrada.innerHTML = "";

    // Se não tiver entrada nenhuma, retornar mensagem básica
    if (dadosFiltrados.length === 0) {
        listaEntrada.innerHTML = `
            <tr>
                <td colspan="6" class="tabela-vazia">Nenhuma entrada de item ainda.</td>
            </tr>
        `;

        indicadorPagina.innerHTML = `Página 1 de 1`;
        return;
    }
    
    // Adicionando entrada na lista
    itensDaPagina.forEach(function(item) {
        const linha = document.createElement('tr'); // Criando uma nova linha
        const indiceReal = bancoDeDadosLocal.indexOf(item);

        linha.innerHTML = `
            <td class="registro-tempo">${item.data}</td>
            <td class="registro-tempo">${item.hora}</td>
            <td>${item.codigo}</td>
            <td>${item.qtd}</td>
            <td>${item.nfe}</td>
            <td>${item.obs}</td>
            <td>
                <button onclick="deletarLinha(${indiceReal})" class="btn-config">❌</button>
            </td>
        `;

        listaEntrada.appendChild(linha);
    });

    indicadorPagina.innerHTML = `Página ${paginaAtual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaAtual === 1;
    btnProximo.disabled = paginaAtual === totalPaginas;
}

// Configurações de Exportação - Excel
btnExportar.addEventListener('click', function() {
    // Verificação de lista, se há itens ou não
    if(bancoDeDadosLocal.length === 0) {
        alert("A tabela está vazia! Bipe alguns itens antes de exportar.");
        return;
    };

    const livroTrabalho = XLSX.utils.book_new(); // Livro do trabalho em branco do Excel
    const planilha = XLSX.utils.json_to_sheet(bancoDeDadosLocal); // Converter os dados para Excel

    XLSX.utils.sheet_add_aoa(planilha, [
        ["Data", "Hora", "Código de Barras", "Quantidade", "NFe - Série", "Observações"]
    ], {origin: "A1"});

    const largurasDasColunas = [
        {wch: 12}, // Coluna A - Data
        {wch: 10}, // Coluna B - Hora
        {wch: 20}, // Coluna C - Código
        {wch: 12}, // Coluna D - Quantidade
        {wch: 15}, // Coluna E - NFe
        {wch: 30} // Coluna F - Observações
    ];

    planilha['!cols'] = largurasDasColunas;

    XLSX.utils.book_append_sheet(livroTrabalho, planilha, "Entradas de Hoje");

    XLSX.writeFile(livroTrabalho, "relatorio-entradas.xlsx");

});

// Parte de apagar a lista toda ou a linha
window.deletarLinha = function(indice) {
    if (confirm("Tem certeza que deseja apagar este item?")) {
        bancoDeDadosLocal.splice(indice, 1); // Remove um item registrado da lista
        localStorage.setItem('bipes_estoque', JSON.stringify(bancoDeDadosLocal)); // Atualiza com a nova remoção
        atualizarTabela(); // Exibe novamente a tabala corrigida sem o item
    };
};

btnLimparTudo.addEventListener('click', function() {
    if(confirm("Isso apagará TODOS os registros do navegador! Você já exportou para o Excel?")) {
        bancoDeDadosLocal = []; // Esvaziando tudo
        localStorage.removeItem('bipes_estoque');
        // Atualizando tudo e deixando sem itens
        paginaAtual = 1;
        atualizarTabela();
    }
});

atualizarTabela();

buscarInput.addEventListener('input', function() {
    paginaAtual = 1; // Volta para a página 1 ao buscar
    atualizarTabela();
});

itensPorPagina.addEventListener('change', function() {
    paginaAtual = 1; // Volta para a página 1 ao mudar o limite
    atualizarTabela();
});

btnAnterior.addEventListener('click', function() {
    if (paginaAtual > 1) {
        paginaAtual--;
        atualizarTabela();
    }
});

btnProximo.addEventListener('click', function() {
    paginaAtual++;
    atualizarTabela();
});
