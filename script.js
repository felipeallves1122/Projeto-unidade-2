const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Estados Globais de Seleção
let selectedTomadasTipo = null;
let selectedLuminariasTipo = null;
let selectedDisjuntoresTipo = 'bifasico'; // Bifásico por padrão (igual à tela 04)

// Listas de Histórico
let tomadasHistorico = [];
let luminariasHistorico = [];
let disjuntoresHistorico = [];
let bitolaHistorico = [];

// Lista de Itens da Tabela do Projeto
let tabelaItens = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Volt Calc inicializado.');
    // Tenta verificar se a API está online
    verificarStatusAPI();
    
    // Configura botões de tipo com valores padrões se necessário
    selectDisjuntoresTipo('bifasico');

    // Carrega dados da tabela do localStorage
    carregarTabelaLocalStorage();
    
    // Carrega projetos salvos no banco de dados MySQL
    carregarProjetosDoBanco();

    // Listener para salvar o nome do projeto
    const projInput = document.getElementById('projeto-nome');
    if (projInput) {
        projInput.addEventListener('input', salvarTabelaLocalStorage);
    }
});

// Função para testar conexão com o Flask
async function verificarStatusAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        console.log('Backend Flask conectado com sucesso:', data);
    } catch (error) {
        console.warn('Aviso: Não foi possível conectar ao backend Flask na porta 5000. Lembre-se de rodar "python app.py".', error);
    }
}

// Navegação SPA entre as telas
function navigateTo(screenId) {
    // Esconder todas as telas
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar a tela solicitada
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==========================================================================
// SELEÇÕES DE INTERFACE (TIPO DE AMBIENTE / CIRCUITO)
// ==========================================================================

function selectTomadasTipo(tipo) {
    selectedTomadasTipo = tipo;
    // Remove classe active de todos
    document.querySelectorAll('#screen-tomadas .option-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Adiciona no selecionado
    document.getElementById(`tomadas-tipo-${tipo}`).classList.add('active');
}

function selectLuminariasTipo(tipo) {
    selectedLuminariasTipo = tipo;
    // Remove classe active de todos
    document.querySelectorAll('#screen-luminarias .option-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Adiciona no selecionado
    document.getElementById(`luminarias-tipo-${tipo}`).classList.add('active');
}

function selectDisjuntoresTipo(tipo) {
    selectedDisjuntoresTipo = tipo;
    // Remove classe active de todos os botões toggle de disjuntor
    document.querySelectorAll('#screen-disjuntores .toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Adiciona no selecionado
    document.getElementById(`disjuntores-tipo-${tipo}`).classList.add('active');
}


// ==========================================================================
// FUNÇÕES AUXILIARES E LIMPEZA DE HISTÓRICO
// ==========================================================================

function exibirErro(containerId, mensagem) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <h4>Erro no Cálculo</h4>
        <p style="color: #b02a37; font-weight: 500;">${mensagem}</p>
        <div class="alert-text">
            Certifique-se de preencher todos os campos corretamente. Se o erro persistir, verifique se o servidor Python/Flask está rodando localmente na porta 5000.
        </div>
    `;
}

function clearTomadasHistory() {
    tomadasHistorico = [];
    renderTomadasHistorico();
}

function clearLuminariasHistory() {
    luminariasHistorico = [];
    renderLuminariasHistorico();
}

function clearDisjuntoresHistory() {
    disjuntoresHistorico = [];
    renderDisjuntoresHistorico();
}

function clearBitolaHistory() {
    bitolaHistorico = [];
    renderBitolaHistorico();
}


// ==========================================================================
// RENDERIZAÇÃO DOS HISTÓRICOS
// ==========================================================================

function renderTomadasHistorico() {
    const resultBox = document.getElementById('result-tomadas');
    if (tomadasHistorico.length === 0) {
        resultBox.innerHTML = '<p class="placeholder-text">Configure os valores e clique em Calcular.</p>';
        return;
    }
    
    let html = `
        <div class="history-header">
            <h4>Cálculos Realizados:</h4>
            <button class="clear-history-btn" onclick="clearTomadasHistory()">Limpar</button>
        </div>
        <div class="history-list">
    `;
    
    tomadasHistorico.forEach((item, index) => {
        let tipoTexto = "";
        if (item.ambiente === "I") tipoTexto = "Quarto / Sala (Tipo I)";
        else if (item.ambiente === "II") tipoTexto = "Cozinha / Área de Serviço (Tipo II)";
        else if (item.ambiente === "III") tipoTexto = "Menos de 6m² (Tipo III)";
        else tipoTexto = `Tipo ${item.ambiente}`;
        
        const badgeTexto = item.nome ? item.nome : `#${index + 1}`;
        
        html += `
            <div class="history-item">
                <span class="item-num">${badgeTexto}</span>
                <div class="item-details">
                    <span><strong>Perímetro:</strong> ${item.perimetro.toFixed(2)} m</span>
                    <span><strong>Tipo:</strong> ${tipoTexto}</span>
                </div>
                <div class="item-result" style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                    <span class="highlight">${item.tomadas_minimas} tomada(s)</span>
                    <button class="add-table-btn" onclick="adicionarATabela('tomadas', ${index}, this)">+ Tabela</button>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    resultBox.innerHTML = html;
}

function renderLuminariasHistorico() {
    const resultBox = document.getElementById('result-luminarias');
    if (luminariasHistorico.length === 0) {
        resultBox.innerHTML = '<p class="placeholder-text">Configure os valores e clique em Calcular.</p>';
        return;
    }
    
    let html = `
        <div class="history-header">
            <h4>Cálculos Realizados:</h4>
            <button class="clear-history-btn" onclick="clearLuminariasHistory()">Limpar</button>
        </div>
        <div class="history-list">
    `;
    
    luminariasHistorico.forEach((item, index) => {
        let tipoTexto = "";
        if (item.ambiente === "I") tipoTexto = "Quarto / Sala (Tipo I)";
        else if (item.ambiente === "II") tipoTexto = "Cozinha / Serviço (Tipo II)";
        else if (item.ambiente === "III") tipoTexto = "Escritório (Tipo III)";
        else tipoTexto = `Tipo ${item.ambiente}`;
        
        let details = `<span><strong>Área:</strong> ${item.area.toFixed(2)} m² | <strong>Ambiente:</strong> ${tipoTexto}</span>`;
        
        let results = `<div>• <strong>Fluxo necessário:</strong> ${item.lux_requerido} lm</div>`;
        if (item.quant_lampadas_lumens !== null) {
            results += `<div>• <strong>Quantidade de lâmpadas (Fluxo):</strong> ${item.quant_lampadas_lumens} un.</div>`;
        }
        results += `<div>• <strong>Potência exigida:</strong> ${item.potencia_total_va} VA (${item.potencia_real_w} W ativo)</div>`;
        if (item.quant_lampadas_potencia !== null) {
            results += `<div>• <strong>Quantidade de lâmpadas (NBR 5410):</strong> ${item.quant_lampadas_potencia} un.</div>`;
        }
        
        const badgeTexto = item.nome ? item.nome : `#${index + 1}`;
        
        html += `
            <div class="history-item flex-column">
                <div class="item-title-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="item-num">${badgeTexto}</span>
                        <div class="item-details">${details}</div>
                    </div>
                    <button class="add-table-btn" onclick="adicionarATabela('luminarias', ${index}, this)">+ Tabela</button>
                </div>
                <div class="item-results-grid">${results}</div>
            </div>
        `;
    });
    
    html += `</div>`;
    resultBox.innerHTML = html;
}

function renderDisjuntoresHistorico() {
    const resultBox = document.getElementById('result-disjuntores');
    if (disjuntoresHistorico.length === 0) {
        resultBox.innerHTML = '<p class="placeholder-text">Configure os valores e clique em Calcular.</p>';
        return;
    }
    
    let html = `
        <div class="history-header">
            <h4>Cálculos Realizados:</h4>
            <button class="clear-history-btn" onclick="clearDisjuntoresHistory()">Limpar</button>
        </div>
        <div class="history-list">
    `;
    
    disjuntoresHistorico.forEach((item, index) => {
        let ligacao = item.tipo === "trifasico" ? "Trifásico" : "Bifásico";
        
        html += `
            <div class="history-item">
                <span class="item-num">#${index + 1}</span>
                <div class="item-details">
                    <span><strong>Circuito:</strong> ${item.nome} (${ligacao})</span>
                    <span><strong>Potência/Tensão:</strong> ${item.potencia} VA / ${item.tensao} V</span>
                    <span class="sub-text">Corrente calculada: ${item.corrente_calculada.toFixed(2)} A</span>
                </div>
                <div class="item-result" style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                    <span class="highlight">${item.disjuntor_dimensionado}A</span>
                    <button class="add-table-btn" onclick="adicionarATabela('disjuntores', ${index}, this)">+ Tabela</button>
                </div>
            </div>
        `;
        // Exibe alertas se houver
        if (item.alerta) {
            html += `<div class="alert-text" style="margin-top: 5px; width:100%">${item.alerta}</div>`;
        }
    });
    
    html += `</div>`;
    resultBox.innerHTML = html;
}

function renderBitolaHistorico() {
    const resultBox = document.getElementById('result-bitola');
    if (bitolaHistorico.length === 0) {
        resultBox.innerHTML = '<p class="placeholder-text">Configure os valores e clique em Calcular.</p>';
        return;
    }
    
    let html = `
        <div class="history-header">
            <h4>Cálculos Realizados:</h4>
            <button class="clear-history-btn" onclick="clearBitolaHistory()">Limpar</button>
        </div>
        <div class="history-list">
    `;
    
    bitolaHistorico.forEach((item, index) => {
        let uso = item.tipo_circuito === 'ILUMINACAO' ? 'Iluminação' : 'Outros';
        const badgeTexto = item.nome ? item.nome : `#${index + 1}`;
        
        html += `
            <div class="history-item">
                <span class="item-num">${badgeTexto}</span>
                <div class="item-details">
                    <span><strong>Uso:</strong> ${uso} | <strong>Distância:</strong> ${item.distancia}m</span>
                    <span><strong>I/V:</strong> ${item.corrente} A / ${item.tensao} V</span>
                    <span class="sub-text">Seção calculada: ${item.secao_calculada.toFixed(2)} mm²</span>
                </div>
                <div class="item-result" style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                    <span class="highlight">${item.bitola_comercial} mm²</span>
                    <button class="add-table-btn" onclick="adicionarATabela('bitola', ${index}, this)">+ Tabela</button>
                </div>
            </div>
        `;
        if (item.alerta) {
            html += `<div class="alert-text" style="margin-top: 5px; width:100%">${item.alerta}</div>`;
        }
    });
    
    html += `</div>`;
    resultBox.innerHTML = html;
}


// ==========================================================================
// CÁLCULOS ASSÍNCRONOS E INTEGRAÇÃO COM BACKEND FLASK
// ==========================================================================

// 1. Calcular Tomadas
async function calcularTomadas() {
    const perimetroVal = document.getElementById('tomadas-perimetro').value;
    const nomeVal = document.getElementById('tomadas-nome').value.trim();
    const resultBox = document.getElementById('result-tomadas');
    
    if (!perimetroVal) {
        exibirErro('result-tomadas', 'Por favor, informe o perímetro do ambiente.');
        return;
    }
    if (!selectedTomadasTipo) {
        exibirErro('result-tomadas', 'Por favor, selecione o tipo de ambiente (Tipo I, II ou III).');
        return;
    }
    
    resultBox.innerHTML = '<p class="placeholder-text">Calculando...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/tomadas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                perimetro: parseFloat(perimetroVal),
                tipo: selectedTomadasTipo,
                nome: nomeVal
            })
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Erro no servidor.');
        }
        
        const data = await response.json();
        
        // Adicionar ao histórico e renderizar
        tomadasHistorico.push(data);
        renderTomadasHistorico();
        
    } catch (error) {
        exibirErro('result-tomadas', error.message);
    }
}

// 2. Calcular Luminárias
async function calcularLuminarias() {
    const areaVal = document.getElementById('luminarias-area').value;
    const nomeVal = document.getElementById('luminarias-nome').value.trim();
    const fluxoVal = document.getElementById('luminarias-fluxo').value;
    const potVal = document.getElementById('luminarias-potencia').value;
    const resultBox = document.getElementById('result-luminarias');
    
    if (!areaVal) {
        exibirErro('result-luminarias', 'Por favor, informe a área do ambiente.');
        return;
    }
    if (!selectedLuminariasTipo) {
        exibirErro('result-luminarias', 'Por favor, selecione o tipo de ambiente.');
        return;
    }
    
    resultBox.innerHTML = '<p class="placeholder-text">Calculando...</p>';
    
    // Monta o payload enviando fluxo e potência se preenchidos
    const payload = {
        area: parseFloat(areaVal),
        tipo: selectedLuminariasTipo,
        nome: nomeVal
    };
    if (fluxoVal) payload.lux_lampada = parseFloat(fluxoVal);
    if (potVal) payload.potencia_lampada = parseFloat(potVal);
    
    try {
        const response = await fetch(`${API_BASE_URL}/luminarias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Erro no servidor.');
        }
        
        const data = await response.json();
        
        // Adicionar ao histórico e renderizar
        luminariasHistorico.push(data);
        renderLuminariasHistorico();
        
    } catch (error) {
        exibirErro('result-luminarias', error.message);
    }
}

// 3. Calcular Disjuntores
async function calcularDisjuntores() {
    const nomeVal = document.getElementById('disjuntores-nome').value || 'Circuito';
    const potenciaVal = document.getElementById('disjuntores-potencia').value;
    const tensaoVal = document.getElementById('disjuntores-tensao').value;
    const resultBox = document.getElementById('result-disjuntores');
    
    if (!potenciaVal || !tensaoVal) {
        exibirErro('result-disjuntores', 'Por favor, preencha a potência (VA) e a tensão (V).');
        return;
    }
    
    resultBox.innerHTML = '<p class="placeholder-text">Calculando...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/disjuntores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nomeVal,
                potencia: parseFloat(potenciaVal),
                tensao: parseFloat(tensaoVal),
                tipo: selectedDisjuntoresTipo
            })
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Erro no servidor.');
        }
        
        const data = await response.json();
        
        // Adicionar ao histórico e renderizar
        disjuntoresHistorico.push(data);
        renderDisjuntoresHistorico();
        
    } catch (error) {
        exibirErro('result-disjuntores', error.message);
    }
}

// 4. Calcular Bitola
async function calcularBitola() {
    const distanciaVal = document.getElementById('bitola-distancia').value;
    const correnteVal = document.getElementById('bitola-corrente').value;
    const tensaoVal = document.getElementById('bitola-tensao').value;
    const usoVal = document.getElementById('bitola-uso').value;
    const nomeVal = document.getElementById('bitola-nome').value.trim();
    const resultBox = document.getElementById('result-bitola');
    
    if (!distanciaVal || !correnteVal || !tensaoVal) {
        exibirErro('result-bitola', 'Por favor, preencha todos os campos da Carga.');
        return;
    }
    
    resultBox.innerHTML = '<p class="placeholder-text">Calculando...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/bitola`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                distancia: parseFloat(distanciaVal),
                corrente: parseFloat(correnteVal),
                tensao: parseFloat(tensaoVal),
                tipo_circuito: usoVal,
                nome: nomeVal
            })
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Erro no servidor.');
        }
        
        const data = await response.json();
        
        // Adicionar ao histórico e renderizar
        bitolaHistorico.push(data);
        renderBitolaHistorico();
        
    } catch (error) {
        exibirErro('result-bitola', error.message);
    }
}

// ==========================================================================
// FUNÇÕES DA TABELA DO PROJETO E EXPORTAÇÃO
// ==========================================================================

function carregarTabelaLocalStorage() {
    try {
        const data = localStorage.getItem('voltcalc_tabela_itens');
        if (data) {
            tabelaItens = JSON.parse(data);
        }
        const projNome = localStorage.getItem('voltcalc_projeto_nome');
        if (projNome && document.getElementById('projeto-nome')) {
            document.getElementById('projeto-nome').value = projNome;
        }
    } catch (e) {
        console.error('Erro ao carregar dados do localStorage:', e);
    }
    renderTabela();
}

function salvarTabelaLocalStorage() {
    try {
        localStorage.setItem('voltcalc_tabela_itens', JSON.stringify(tabelaItens));
        const projInput = document.getElementById('projeto-nome');
        if (projInput) {
            localStorage.setItem('voltcalc_projeto_nome', projInput.value);
        }
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}

function adicionarATabela(tipo, index, btn) {
    let item = null;
    let novoItem = {};

    if (tipo === 'tomadas') {
        item = tomadasHistorico[index];
        if (!item) return;
        let tipoTexto = "";
        if (item.ambiente === "I") tipoTexto = "Quarto / Sala (Tipo I)";
        else if (item.ambiente === "II") tipoTexto = "Cozinha / Área de Serviço (Tipo II)";
        else if (item.ambiente === "III") tipoTexto = "Menos de 6m² (Tipo III)";
        else tipoTexto = `Tipo ${item.ambiente}`;

        novoItem = {
            nome: item.nome || `Ambiente ${index + 1}`,
            tipo: "Dimensionamento de Tomadas",
            detalhes: `Perímetro: ${item.perimetro.toFixed(2)} m | Tipo: ${tipoTexto}`,
            resultado: `${item.tomadas_minimas} tomada(s) (${item.regra})`
        };
    } else if (tipo === 'luminarias') {
        item = luminariasHistorico[index];
        if (!item) return;
        let tipoTexto = "";
        if (item.ambiente === "I") tipoTexto = "Quarto / Sala (Tipo I)";
        else if (item.ambiente === "II") tipoTexto = "Cozinha / Serviço (Tipo II)";
        else if (item.ambiente === "III") tipoTexto = "Escritório (Tipo III)";
        else tipoTexto = `Tipo ${item.ambiente}`;

        let det = `Área: ${item.area.toFixed(2)} m² | Ambiente: ${tipoTexto}`;
        let res = `Lux Req: ${item.lux_requerido} lm | Potência: ${item.potencia_total_va} VA (${item.potencia_real_w} W)`;
        if (item.quant_lampadas_lumens) {
            res += ` | Lâmpadas (Fluxo): ${item.quant_lampadas_lumens} un.`;
        }
        if (item.quant_lampadas_potencia) {
            res += ` | Lâmpadas (NBR 5410): ${item.quant_lampadas_potencia} un.`;
        }

        novoItem = {
            nome: item.nome || `Ambiente ${index + 1}`,
            tipo: "Dimensionamento de Luminárias",
            detalhes: det,
            resultado: res
        };
    } else if (tipo === 'disjuntores') {
        item = disjuntoresHistorico[index];
        if (!item) return;
        let ligacao = item.tipo === "trifasico" ? "Trifásico" : "Bifásico";

        novoItem = {
            nome: item.nome || `Circuito ${index + 1}`,
            tipo: "Dimensionamento de Disjuntor",
            detalhes: `Potência: ${item.potencia} VA | Tensão: ${item.tensao} V | Conexão: ${ligacao}`,
            resultado: `Disjuntor: ${item.disjuntor_dimensionado}A | Corrente Calc: ${item.corrente_calculada.toFixed(2)}A`
        };
    } else if (tipo === 'bitola') {
        item = bitolaHistorico[index];
        if (!item) return;
        let uso = item.tipo_circuito === 'ILUMINACAO' ? 'Iluminação' : 'Outros (Tomadas/Força)';

        novoItem = {
            nome: item.nome || `Circuito ${index + 1}`,
            tipo: "Dimensionamento de Bitola",
            detalhes: `Uso: ${uso} | Distância: ${item.distancia} m | Disjuntor: ${item.corrente} A | Tensão: ${item.tensao} V`,
            resultado: `Bitola Comercial: ${item.bitola_comercial} mm² | Seção Calc: ${item.secao_calculada.toFixed(2)} mm²`
        };
    }

    tabelaItens.push(novoItem);
    salvarTabelaLocalStorage();
    renderTabela();
    
    // Feedback visual premium temporário no botão
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = "✓ Adicionado!";
        btn.style.backgroundColor = "var(--accent-gold)";
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = "";
        }, 1500);
    }
}

function renderTabela() {
    const tbody = document.getElementById('tabela-itens-body');
    const msgVazia = document.getElementById('tabela-vazia-mensagem');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (tabelaItens.length === 0) {
        if (msgVazia) msgVazia.style.display = 'block';
        return;
    }
    
    if (msgVazia) msgVazia.style.display = 'none';
    
    tabelaItens.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(18, 35, 56, 0.15)';
        tr.innerHTML = `
            <td style="padding: 10px; font-weight: 500;">${item.nome}</td>
            <td style="padding: 10px; font-style: italic;">${item.tipo}</td>
            <td style="padding: 10px; font-size: 0.8rem; max-width: 300px; word-wrap: break-word;">${item.detalhes}</td>
            <td style="padding: 10px; font-weight: 600; color: var(--primary-dark);">${item.resultado}</td>
            <td style="padding: 10px; text-align: center;">
                <button class="table-remove-btn" onclick="removerItemTabela(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function removerItemTabela(index) {
    tabelaItens.splice(index, 1);
    salvarTabelaLocalStorage();
    renderTabela();
}

function limparTabela() {
    if (confirm("Deseja realmente limpar toda a tabela do projeto?")) {
        tabelaItens = [];
        salvarTabelaLocalStorage();
        renderTabela();
    }
}

function fecharPreviewModal() {
    const modal = document.getElementById('pdf-preview-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function getSanitizedFilename() {
    const projNomeInput = document.getElementById('projeto-nome');
    const filenameRaw = projNomeInput ? projNomeInput.value : 'relatorio-eletrico';
    const filenameSanitized = filenameRaw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/gi, '_') // replace non-alphanumeric with underscore
        .replace(/_+/g, '_') // remove duplicates
        .trim();
    return (filenameSanitized || 'relatorio-eletrico') + '.pdf';
}

function exportarPDF() {
    if (tabelaItens.length === 0) {
        alert("A tabela está vazia. Adicione algum cálculo antes de exportar.");
        return;
    }

    // 1. Abre o modal com estado de carregamento
    const modal = document.getElementById('pdf-preview-modal');
    const previewContainer = document.getElementById('pdf-preview-container');
    if (modal) {
        modal.classList.add('active');
    }
    if (previewContainer) {
        previewContainer.innerHTML = '<p class="placeholder-text" style="margin-top: 0; color: var(--text-dark);">Gerando pré-visualização do PDF...</p>';
    }

    // 2. Atualiza os dados no template invisível do PDF
    const pdfProjNome = document.getElementById('pdf-projeto-nome');
    const projNomeInput = document.getElementById('projeto-nome');
    if (pdfProjNome && projNomeInput) {
        pdfProjNome.innerText = projNomeInput.value || "Meu Projeto Elétrico";
    }

    const pdfDataGeracao = document.getElementById('pdf-data-geracao');
    if (pdfDataGeracao) {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        pdfDataGeracao.innerText = `Data: ${dia}/${mes}/${ano}`;
    }

    const pdfTbody = document.getElementById('pdf-tabela-itens-body');
    if (pdfTbody) {
        pdfTbody.innerHTML = '';
        tabelaItens.forEach((item) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px; border: 1px solid #dddddd; font-weight: 500;">${item.nome}</td>
                <td style="padding: 10px; border: 1px solid #dddddd; font-style: italic;">${item.tipo}</td>
                <td style="padding: 10px; border: 1px solid #dddddd; font-size: 0.8rem;">${item.detalhes}</td>
                <td style="padding: 10px; border: 1px solid #dddddd; font-weight: 600; color: #122338;">${item.resultado}</td>
            `;
            pdfTbody.appendChild(tr);
        });
    }

    // 3. Configuração do html2pdf
    const element = document.getElementById('pdf-template');
    const opt = {
        margin:       10,
        filename:     getSanitizedFilename(),
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    // 4. Compila o PDF para um Blob URL e exibe no iframe
    html2pdf().from(element).set(opt).toPdf().output('bloburl').then(function(blobUrl) {
        if (previewContainer) {
            previewContainer.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.src = blobUrl;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '8px';
            previewContainer.appendChild(iframe);
        }
    }).catch(function(err) {
        console.error("Erro ao gerar preview do PDF:", err);
        if (previewContainer) {
            previewContainer.innerHTML = '<p class="placeholder-text" style="color: #dc3545;">Não foi possível gerar a pré-visualização. Clique em confirmar download para baixar diretamente.</p>';
        }
    });
}

function confirmarDownloadPDF() {
    const element = document.getElementById('pdf-template');
    const opt = {
        margin:       10,
        filename:     getSanitizedFilename(),
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save().then(function() {
        fecharPreviewModal();
    });
}

// ==========================================================================
// FUNÇÕES DE COMUNICAÇÃO COM O BANCO DE DADOS (MYSQL VIA API FLASK)
// ==========================================================================

async function carregarProjetosDoBanco() {
    const listaContainer = document.getElementById('db-projetos-lista');
    if (!listaContainer) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/projetos`);
        if (!response.ok) {
            throw new Error("Erro ao carregar do banco.");
        }
        
        const projetos = await response.json();
        
        if (projetos.length === 0) {
            listaContainer.innerHTML = '<p class="placeholder-text" style="grid-column: 1/-1; margin: 10px 0; text-align: center;">Nenhum projeto salvo no banco de dados ainda.</p>';
            return;
        }
        
        let html = '';
        projetos.forEach(p => {
            const dataCriacao = new Date(p.criado_em).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            
            html += `
                <div style="background-color: white; border: 1.5px solid var(--border-color); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 700; color: var(--primary-dark); font-size: 0.95rem; word-break: break-all;">${p.nome}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Salvo em: ${dataCriacao}</span>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 5px;">
                        <button onclick="carregarProjetoEspecifico(${p.id})" style="flex: 1; background-color: var(--primary-dark); color: white; border: 1.5px solid var(--border-color); border-radius: 12px; padding: 6px; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;">Carregar</button>
                        <button onclick="deletarProjetoDoBanco(${p.id}, '${p.nome}')" style="background-color: #dc3545; color: white; border: 1.5px solid #dc3545; border-radius: 12px; padding: 6px 12px; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;">Excluir</button>
                    </div>
                </div>
            `;
        });
        
        listaContainer.innerHTML = html;
    } catch (error) {
        console.warn("Erro ao buscar projetos do banco MySQL:", error);
        listaContainer.innerHTML = `
            <p class="placeholder-text" style="grid-column: 1/-1; margin: 10px 0; text-align: center; color: #dc3545; font-size: 0.85rem;">
                Banco de dados offline. Certifique-se de iniciar o MySQL e rodar "python app.py".
            </p>
        `;
    }
}

async function salvarProjetoNoBanco() {
    const projInput = document.getElementById('projeto-nome');
    const nomeProj = projInput ? projInput.value.trim() : "Meu Projeto Elétrico";
    
    if (tabelaItens.length === 0) {
        alert("A tabela do projeto está vazia. Adicione algum cálculo antes de salvar.");
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/projetos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nomeProj,
                itens: tabelaItens
            })
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Erro no servidor.");
        }
        
        const res = await response.json();
        alert(res.message || "Projeto salvo com sucesso!");
        
        // Recarrega a lista do banco de dados
        carregarProjetosDoBanco();
    } catch (error) {
        console.error("Erro ao salvar projeto no banco:", error);
        alert("Erro ao salvar no banco de dados MySQL: " + error.message);
    }
}

async function carregarProjetoEspecifico(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/projetos/${id}`);
        if (!response.ok) {
            throw new Error("Não foi possível carregar os dados do projeto.");
        }
        
        const proj = await response.json();
        
        // Atualiza a tabela local
        tabelaItens = proj.itens || [];
        
        // Atualiza o input de nome do projeto
        const projInput = document.getElementById('projeto-nome');
        if (projInput) {
            projInput.value = proj.nome;
        }
        
        // Salva localmente também e renderiza
        salvarTabelaLocalStorage();
        renderTabela();
        
        alert(`Projeto "${proj.nome}" carregado com sucesso!`);
    } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        alert("Erro ao carregar projeto do banco: " + error.message);
    }
}

async function deletarProjetoDoBanco(id, nome) {
    if (!confirm(`Deseja realmente excluir o projeto "${nome}" do banco de dados?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/projetos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error("Erro ao excluir no servidor.");
        }
        
        alert("Projeto excluído com sucesso!");
        carregarProjetosDoBanco();
    } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        alert("Erro ao excluir do banco de dados: " + error.message);
    }
}
