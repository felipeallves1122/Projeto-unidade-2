/**
 * VOLT CALC - Frontend Logic & Electrical Calculations
 * Focado exclusivamente nas telas do Figma (Desktop 1 a 12):
 * - Dimensionamento de Tomadas
 * - Dimensionamento de Luminárias
 * - Dimensionamento de Disjuntores
 */

// ==========================================================================
// ESTADO GLOBAL DA APLICAÇÃO
// ==========================================================================
let currentTomadasTipo = 'I';
let currentLuminariasTipo = 'I';
let currentDisjuntoresFase = 'bifasico';

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Define seleções iniciais refletindo o Figma
    selectTomadasTipo('I');
    selectLuminariasTipo('I');
    selectDisjuntoresFase('bifasico');
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

    if (currentTomadasTipo === 'I') {
        qtdTomadas = Math.ceil(perimetro / 5);
        tipoDesc = 'Quarto / Sala (Tipo I)';
    } else if (currentTomadasTipo === 'II') {
        qtdTomadas = Math.ceil(perimetro / 3.5);
        tipoDesc = 'Cozinha / Área de serviço (Tipo II)';
    } else if (currentTomadasTipo === 'III') {
        qtdTomadas = 1;
        tipoDesc = 'Menos de 6m² (Tipo III)';
    }

    const resultadoFinal = `${qtdTomadas} tomada(s) mínimas`;

    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-main-value">${resultadoFinal}</div>
            <div class="result-detail-line"><strong>Ambiente:</strong> ${nome} (${tipoDesc})</div>
            <div class="result-detail-line"><strong>Perímetro:</strong> ${perimetro.toFixed(2)} m</div>
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
        </div>
    `;
}
