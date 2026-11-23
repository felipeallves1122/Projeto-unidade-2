/**
 * VOLT CALC - Frontend Logic & Electrical Calculations
 * Implementado conforme as telas do Figma (Desktop 1 a 12)
 * e fórmulas elétricas NBR 5410.
 */

// ==========================================================================
// ESTADO GLOBAL DA APLICAÇÃO
// ==========================================================================
let currentTomadasTipo = 'I';
let currentLuminariasTipo = 'I';
let currentDisjuntoresFase = 'bifasico';
let currentBitolaUso = 'geral';

let tabelaItens = [];

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Define seleções iniciais refletindo o Figma
    selectTomadasTipo('I');
    selectLuminariasTipo('I');
    selectDisjuntoresFase('bifasico');
    selectBitolaUso('geral');

    // Carrega dados persistidos da tabela
    carregarTabelaStorage();
});

// ==========================================================================
// NAVEGAÇÃO SPA (Desktop 1 a 4)
// ==========================================================================
function navigateTo(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
}

// ==========================================================================
// SELETORES DE TIPO E FASE (Desktop 5 a 12)
// ==========================================================================

// Tomadas: Tipo I, II ou III (Figma telas 05, 06, 07)
function selectTomadasTipo(tipo) {
    currentTomadasTipo = tipo;
    ['I', 'II', 'III'].forEach(t => {
        const btn = document.getElementById(`tomadas-btn-${t}`);
        if (btn) {
            btn.classList.toggle('active', t === tipo);
        }
    });
}

// Luminárias: Tipo I, II ou III (Figma telas 08, 09, 10)
function selectLuminariasTipo(tipo) {
    currentLuminariasTipo = tipo;
    ['I', 'II', 'III'].forEach(t => {
        const btn = document.getElementById(`luminarias-btn-${t}`);
        if (btn) {
            btn.classList.toggle('active', t === tipo);
        }
    });
}

// Disjuntores: Monofásico, Bifásico ou Trifásico (Figma telas 11, 12)
function selectDisjuntoresFase(fase) {
    currentDisjuntoresFase = fase;
    const mapa = {
        'monofasico': 'disjuntores-btn-mono',
        'bifasico': 'disjuntores-btn-bi',
        'trifasico': 'disjuntores-btn-tri'
    };

    Object.keys(mapa).forEach(f => {
        const btn = document.getElementById(mapa[f]);
        if (btn) {
            btn.classList.toggle('active', f === fase);
        }
    });
}

// Bitola: Geral ou Iluminação
function selectBitolaUso(uso) {
    currentBitolaUso = uso;
    const btnGeral = document.getElementById('bitola-uso-geral');
    const btnIlum = document.getElementById('bitola-uso-ilum');
    if (btnGeral && btnIlum) {
        btnGeral.classList.toggle('active', uso === 'geral');
        btnIlum.classList.toggle('active', uso === 'iluminacao');
    }
}


// ==========================================================================
// CÁLCULOS ELÉTRICOS
// ==========================================================================

/**
 * 1. DIMENSIONAMENTO DE TOMADAS (TUGs)
 * - Tipo I (Quartos e Salas): 1 tomada a cada 5m de perímetro ou fração
 * - Tipo II (Cozinhas, Copas, Áreas de Serviço): 1 tomada a cada 3,5m de perímetro ou fração
 * - Tipo III (Ambientes com menos de 6m²): mínimo 1 tomada
 */
function calcularTomadas() {
    const nome = document.getElementById('tomadas-nome').value.trim() || 'Ambiente';
    const perimetroRaw = document.getElementById('tomadas-perimetro').value;
    const perimetro = parseFloat(perimetroRaw);
    const resultContainer = document.getElementById('result-text-tomadas');

    if (isNaN(perimetro) || perimetro <= 0) {
        resultContainer.innerHTML = `
            <div class="result-card" style="border-left-color: var(--danger-red);">
                <p style="color: var(--danger-red); font-weight: 600;">Informe um perímetro válido maior que zero.</p>
            </div>
        `;
        return;
    }

    let qtdTomadas = 1;
    let tipoDesc = '';
    let regra = '';

    if (currentTomadasTipo === 'I') {
        qtdTomadas = Math.ceil(perimetro / 5);
        tipoDesc = 'Quarto / Sala (Tipo I)';
        regra = `${perimetro.toFixed(2)}m ÷ 5m (arredondado para cima)`;
    } else if (currentTomadasTipo === 'II') {
        qtdTomadas = Math.ceil(perimetro / 3.5);
        tipoDesc = 'Cozinha / Área de serviço (Tipo II)';
        regra = `${perimetro.toFixed(2)}m ÷ 3,5m (arredondado para cima)`;
    } else if (currentTomadasTipo === 'III') {
        qtdTomadas = 1;
        tipoDesc = 'Menos de 6m² (Tipo III)';
        regra = 'Mínimo de 1 tomada pela NBR 5410';
    }

    const resultadoFinal = `${qtdTomadas} tomada(s) mínimas`;

    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-main-value">${resultadoFinal}</div>
            <div class="result-detail-line"><strong>Ambiente:</strong> ${nome} (${tipoDesc})</div>
            <div class="result-detail-line"><strong>Perímetro:</strong> ${perimetro.toFixed(2)} m</div>
            <div class="result-detail-line"><strong>Regra:</strong> ${regra}</div>
            <div class="result-actions">
                <button class="add-table-btn" onclick="salvarItemNaTabela('Tomadas', '${nome}', '${perimetro.toFixed(2)}m (${tipoDesc})', '${resultadoFinal}')">
                    + Adicionar à Tabela
                </button>
            </div>
        </div>
    `;
}

/**
 * 2. DIMENSIONAMENTO DE LUMINÁRIAS / LUMENS
 * - Tipo I: 200 lumens/m² (Quarto / Sala)
 * - Tipo II: 300 lumens/m² (Cozinha / Área de serviço)
 * - Tipo III: 400 lumens/m² (Escritório)
 */
function calcularLuminarias() {
    const nome = document.getElementById('luminarias-nome').value.trim() || 'Ambiente';
    const areaRaw = document.getElementById('luminarias-area').value;
    const area = parseFloat(areaRaw);
    const lumensPorLampadaRaw = document.getElementById('luminarias-lumens-lamp').value;
    const lumensPorLampada = parseFloat(lumensPorLampadaRaw) || 800;
    const resultContainer = document.getElementById('result-text-luminarias');

    if (isNaN(area) || area <= 0) {
        resultContainer.innerHTML = `
            <div class="result-card" style="border-left-color: var(--danger-red);">
                <p style="color: var(--danger-red); font-weight: 600;">Informe uma área válida maior que zero.</p>
            </div>
        `;
        return;
    }

    let luxPorM2 = 200;
    let tipoDesc = 'Quarto / Sala';
    if (currentLuminariasTipo === 'I') {
        luxPorM2 = 200;
        tipoDesc = 'Quarto / Sala (Tipo I)';
    } else if (currentLuminariasTipo === 'II') {
        luxPorM2 = 300;
        tipoDesc = 'Cozinha / Área de serviço (Tipo II)';
    } else if (currentLuminariasTipo === 'III') {
        luxPorM2 = 400;
        tipoDesc = 'Escritório (Tipo III)';
    }

    const lumensTotal = area * luxPorM2;
    const qtdLampadas = Math.ceil(lumensTotal / lumensPorLampada);
    const resultadoFinal = `${qtdLampadas} lâmpada(s) (${lumensTotal} lm)`;

    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-main-value">${resultadoFinal}</div>
            <div class="result-detail-line"><strong>Ambiente:</strong> ${nome} (${tipoDesc})</div>
            <div class="result-detail-line"><strong>Fluxo Total Necessário:</strong> ${lumensTotal} lumens</div>
            <div class="result-detail-line"><strong>Lâmpada Adotada:</strong> ${lumensPorLampada} lm cada</div>
            <div class="result-actions">
                <button class="add-table-btn" onclick="salvarItemNaTabela('Luminárias', '${nome}', '${area.toFixed(2)}m² (${tipoDesc})', '${resultadoFinal}')">
                    + Adicionar à Tabela
                </button>
            </div>
        </div>
    `;
}

/**
 * 3. DIMENSIONAMENTO DE DISJUNTORES
 * - Monofásico ou Bifásico: I = Potência / Tensão
 * - Trifásico: I = Potência / (Tensão * √3)
 * Padrões comerciais: 10, 16, 20, 25, 32, 40, 50, 63 A
 */
function calcularDisjuntores() {
    const nome = document.getElementById('disjuntores-nome').value.trim() || 'Circuito';
    const potencia = parseFloat(document.getElementById('disjuntores-potencia').value);
    const tensao = parseFloat(document.getElementById('disjuntores-tensao').value);
    const resultContainer = document.getElementById('result-text-disjuntores');

    if (isNaN(potencia) || potencia <= 0 || isNaN(tensao) || tensao <= 0) {
        resultContainer.innerHTML = `
            <div class="result-card" style="border-left-color: var(--danger-red);">
                <p style="color: var(--danger-red); font-weight: 600;">Preencha a potência e a tensão corretamente.</p>
            </div>
        `;
        return;
    }

    let corrente = 0;
    let faseDesc = '';

    if (currentDisjuntoresFase === 'trifasico') {
        corrente = potencia / (tensao * Math.sqrt(3));
        faseDesc = 'Trifásico';
    } else if (currentDisjuntoresFase === 'bifasico') {
        corrente = potencia / tensao;
        faseDesc = 'Bifásico';
    } else {
        corrente = potencia / tensao;
        faseDesc = 'Monofásico';
    }

    // Seleciona disjuntor comercial padrão
    const padroes = [10, 16, 20, 25, 32, 40, 50, 63];
    let disjuntorEscolhido = null;

    for (const d of padroes) {
        if (corrente <= d) {
            disjuntorEscolhido = d;
            break;
        }
    }

    if (!disjuntorEscolhido) {
        disjuntorEscolhido = Math.ceil(corrente);
    }

    const resultadoFinal = `Disjuntor de ${disjuntorEscolhido} A`;

    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-main-value">${resultadoFinal}</div>
            <div class="result-detail-line"><strong>Circuito:</strong> ${nome} (${faseDesc})</div>
            <div class="result-detail-line"><strong>Corrente Nominal (Ib):</strong> ${corrente.toFixed(2)} A</div>
            <div class="result-detail-line"><strong>Potência / Tensão:</strong> ${potencia} VA / ${tensao} V</div>
            <div class="result-actions">
                <button class="add-table-btn" onclick="salvarItemNaTabela('Disjuntores', '${nome}', '${potencia}VA / ${tensao}V (${faseDesc})', '${resultadoFinal} (Ib: ${corrente.toFixed(2)}A)')">
                    + Adicionar à Tabela
                </button>
            </div>
        </div>
    `;
}

/**
 * 4. DIMENSIONAMENTO DE BITOLA DE CONDUTORES
 * Queda de tensão máxima de 4% com condutor de cobre (ρ = 0.0172 Ω·mm²/m)
 */
function calcularBitola() {
    const nome = document.getElementById('bitola-nome').value.trim() || 'Circuito Geral';
    const potencia = parseFloat(document.getElementById('bitola-potencia').value);
    const tensao = parseFloat(document.getElementById('bitola-tensao').value);
    const distancia = parseFloat(document.getElementById('bitola-distancia').value);
    const resultContainer = document.getElementById('result-text-bitola');

    if (isNaN(potencia) || potencia <= 0 || isNaN(tensao) || tensao <= 0 || isNaN(distancia) || distancia <= 0) {
        resultContainer.innerHTML = `
            <div class="result-card" style="border-left-color: var(--danger-red);">
                <p style="color: var(--danger-red); font-weight: 600;">Preencha todos os parâmetros com valores positivos.</p>
            </div>
        `;
        return;
    }

    const fp = 0.95;
    const corrente = Math.ceil(potencia / (tensao * fp));
    const p = 0.0172;
    const queda = 0.04;
    const secaoTeorica = (2 * p * distancia * corrente) / (tensao * queda);

    let secaoComercial = 2.5;
    const tipoUso = currentBitolaUso === 'iluminacao' ? 'Iluminação' : 'Tomadas / Geral';

    if (secaoTeorica <= 1.5 && currentBitolaUso === 'iluminacao') {
        secaoComercial = 1.5;
    } else if (secaoTeorica <= 2.5) {
        secaoComercial = 2.5;
    } else if (secaoTeorica <= 4) {
        secaoComercial = 4;
    } else if (secaoTeorica <= 6) {
        secaoComercial = 6;
    } else if (secaoTeorica <= 10) {
        secaoComercial = 10;
    } else {
        secaoComercial = 'Consultar NBR NM 247-3 (> 10mm²)';
    }

    const resultadoFinal = typeof secaoComercial === 'number' ? `${secaoComercial} mm²` : secaoComercial;

    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-main-value">Seção: ${resultadoFinal}</div>
            <div class="result-detail-line"><strong>Circuito:</strong> ${nome} (${tipoUso})</div>
            <div class="result-detail-line"><strong>Corrente Calculada:</strong> ${corrente} A</div>
            <div class="result-detail-line"><strong>Distância:</strong> ${distancia} m | <strong>Queda Máx:</strong> 4%</div>
            <div class="result-actions">
                <button class="add-table-btn" onclick="salvarItemNaTabela('Bitola', '${nome}', '${potencia}W, ${distancia}m (${tipoUso})', '${resultadoFinal}')">
                    + Adicionar à Tabela
                </button>
            </div>
        </div>
    `;
}


// ==========================================================================
// GERENCIAMENTO DA TABELA DO PROJETO
// ==========================================================================

function salvarItemNaTabela(etapa, nome, entrada, resultado) {
    const novoItem = {
        id: Date.now(),
        etapa: etapa,
        nome: nome,
        entrada: entrada,
        resultado: resultado
    };

    tabelaItens.push(novoItem);
    salvarTabelaStorage();
    renderizarTabela();
    alert(`Item "${nome}" adicionado à Tabela do Projeto com sucesso!`);
}

function removerItemTabela(id) {
    tabelaItens = tabelaItens.filter(item => item.id !== id);
    salvarTabelaStorage();
    renderizarTabela();
}

function limparTodaTabela() {
    if (confirm('Deseja realmente limpar todos os itens da tabela do projeto?')) {
        tabelaItens = [];
        salvarTabelaStorage();
        renderizarTabela();
    }
}

function renderizarTabela() {
    const tbody = document.getElementById('tabela-projeto-corpo');
    if (!tbody) return;

    if (tabelaItens.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty-row">Nenhum cálculo adicionado à tabela ainda. Realize os dimensionamentos e clique em "+ Adicionar à Tabela".</td>
            </tr>
        `;
        return;
    }

    let html = '';
    tabelaItens.forEach((item, index) => {
        html += `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${item.etapa}</td>
                <td>${item.nome}</td>
                <td>${item.entrada}</td>
                <td><strong>${item.resultado}</strong></td>
                <td>
                    <button class="table-del-btn" onclick="removerItemTabela(${item.id})">Remover</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function salvarTabelaStorage() {
    try {
        localStorage.setItem('volt_calc_tabela', JSON.stringify(tabelaItens));
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}

function carregarTabelaStorage() {
    try {
        const dados = localStorage.getItem('volt_calc_tabela');
        if (dados) {
            tabelaItens = JSON.parse(dados);
        }
    } catch (e) {
        console.error('Erro ao carregar do localStorage:', e);
    }
    renderizarTabela();
}

function imprimirProjeto() {
    window.print();
}
