
// Cálculo de tomadas

const tomadasCalc = [];

function tomadasMinimas() {
    const entradaPerimetro = prompt("Informe o perímetro do ambiente (em metros): ");
    const perimetro = parseFloat(entradaPerimetro?.replace(",", "."));

    if (isNaN(perimetro) || perimetro <= 0) {
        alert("Perímetro inválido! Digite um número maior que zero.");
        return null;
    }

    const mensagemTipo =
        "Informe o tipo de ambiente (I/II/III): \n\n" +
        "I - Quartos e salas\n" +
        "II - Cozinha, copa e Área de serviçp\n" +
        "III - Ambiente com menos 6m²";

    const ambiente = prompt(mensagemTipo)?.trim().toUpperCase();
    let tomadas;

    if (ambiente === "I") {
        tomadas = Math.ceil(perimetro / 5);
    } else if (ambiente === "II") {
        tomadas = Math.ceil(perimetro / 3.5);
    } else if (ambiente === "III") {
        tomadas = 1;
    } else {
        alert("Tipo de ambiente inválido!");
        return null;
    }

    alert(`A quantidade mínima de tomadas é ${tomadas}`);
    return tomadas;
}

while (true) {
    const resultado = tomadasMinimas();

    if (resultado !== null) {
        tomadas.calc.push(resultado);
    }

    const continuar = prompt("Deseja calcular outro ambient? (S/N)")?.trim().toUpperCase();
    if (continuar === "N") {
        break;
    }
}

const totalTomadas = tomadasCalc.reduce((acumulador, atual) => acumulador + atual, 0);

console.log("Histórico de tomadas:0", tomadasCalc);
alert(`Cálculos encerrados!\nHistórico: [${tomadasCalc.join(", ")}]\nTotal de tomadas: ${totalTomadas}`);


// Cálculo de lumens e luminárias


const quantiLux = [];
const quantiLuminarias = [];

function lumens() {
    const mensagemTipo =
        "Informe o tipo de ambiente (I / II / III:\n\n" +
        "Tipo I: Quarto e sala\n" +
        "Tipo II: Cozinha, copa e Área de serviço\n" +
        "Tipo III: Escritórios";

    const tipo = prompt(mensagemTipo)?.trim().toUpperCase();
    const entradaArea = prompt("Informe a área do ambiente em metros: ");
    const area = parseFloat(entradaArea?.replace(",", "."));

    if (isNaN(area) || area <= 0) {
        alert("Área inválida! Digite um número maior que zero.")
        return null;
    }

    let lux;

    if (tipo === "I") {
        lux = area * 200;
    } else if (tipo === "II") {
        lux = area * 300;
    } else if (tipo === "III") {
        lux = area * 400;
    } else {
        alert("Entrada inválida!");
        return null;
    }

    quantiLux.push(lux);
    alert(`A quantidade de lumens é: ${lux}`);
    return lux;
}

function luminarias() {
    const entradaLux = prompt("Informe a quantidade de lumens necessária no ambiente (lm):");
    const lux = parseFloat(entradaLux?.replace(",", "."));

    const entradaLuxLum = prompt(
        "Informe a quantidade de lumens de luminária (lm):\n" +
        "(Pode ser identificada na caixa do produto)"
    );
    const LuxLum = parseFloat(entradaLuxLum?.replace(",", "."));

    if (isNaN(lux) || isNaN(luxLum) || lux <= 0 || luxLum <= 0) {
        alert("Valores inválidos! Digite apenas números maiores que zero.");
        return null;
    }

    const quantiLampadas = Math.ceil(lux / luxLum);
    quantiLuminarias.push(quantiLampadas);

    alert(`A quantidade mínima de lâmpadas é: ${quantiLampadas}`);
    return quantiLampadas;
}

while (true) {
    const luxCalculado = lumens();

    if (luxCalculado !== null) {
        luminarias();
    }
    const continuar = prompt("Deseja calcular outro ambiente? (S/N)")?.trim().toUpperCase();
    if (continuar === "N") {
        break;
    }
}

console.log("Histórico de Lumens: ", quantiLux);
console.log("Histórico de Luminárias:", quantiLuminarias);



// Cálculo de disjuntores


const potneciaCalc = [];
const circuito = [];
const disjuntores = [];

function potencia() {
    let potenciaTotal = 0;

    while (true) {
        const entradaPotencia = prompt("Informe a potência (VA ou W): ");
        const potenciaAparente = parseFloat(entradaPotencia?.replace(",", "."));

        if (isNaN(potenciaAparente) || potenciaAparente <= 0) {
            alert("valor inválido! Digite apenas números maiores que zero.");
            return null;
        }

        potenciaTotal += potenciaAparente;

        const continuar = prompt("Adicionar mais uma potência? (S/N)")?.trim().toUpperCase();
        if (continuar === "S") {
            continue;
        } else if (continuar === "N") {
            alert(`Potência total: ${potenciaTotal}`);
            potenciaCalc.push(potenciaTotal);
            return potenciaTotal;
        } else {
            alert("Entrada inválida");
            return null;
        }
    }
}function escolherDisjuntor(corrente) {
    const padroes = [10, 16, 20, 25, 32, 40, 50, 63];

    for (const disjuntor of padroes_) {
        if (corrente <= disjuntor) {
            disjuntores.push(disjuntor);
            alert(`Disjuntor escolhido: ${disjuntor}A`);
            return disjuntor;
        }
    }

    const disjuntorCustom = math.ceil(corrente);
    disjuntores.push(disjuntorCustom);
    alert(`O disjuntor deve ter ${disjuntorCustom}A`);
    return disjuntorCustom;
}

function disjuntorMono() {
    const nomeCircuito = prompt("Informe o nome do circuito: ")
    circuito.push(nomeCircuito);

    const potenciaAparente = parseFloat(prompt("Informe a potência total: ")?.replace(",", "."));
    const tensao = parseFloat(prompt("Informe a tensão usada (V): ")?.replace(",", "."));

    if (isNaN(potenciaAparente) || isNaN(tensao) || potenciaAparente <= 0 || tensao <= 0) {
        alert("Valores inválidos! Digite apenas números maiores que zero.");
        return null;
    }

    const corrente = potenciaAparente / tensao;
    return escolherDisjuntor(corrente);
}

function disjuntorTri() {
    const potenciaAparente = parseFloat(prompt("Informe a potência total: ")?.replace(",", "."));
    const tensao = parseFloat(prompt("Informe a tensão usada (V): ")?.replace(",", "."));

    if (isNaN(potenciaAparente) || isNaN(tensao) || potenciaAparente <= 0 || tensao <=0) {
        alert("Valores inválidos! Digite apenas números maiores que zero.");
        return null;
    }

    const corrente = potenciaAparente / (tensao * math.sqrt(3));
    return escolherDisjuntor(corrente);
}

while (true) {
    const potCalculada = potencia();

    if (potCalculada !== null) {
        const disjuntorEs = prompt(
            "Informe o tipo de disjuntor: \n" +
            "Tipo I: Disjuntor monofásico\n" +
            "Tipo II: Disjuntor trifásico"
        )?.trim();

        if (disjuntorEs === "I") {
            while (true) {
                disjutnorMono();
                const continuar = prompt("Deseja calcular outro disjuntor monofásico? (S/N")?.trim().toUpperCase();
                if (continuar === "S") {
                    continue;
                } else if (continuar === "N") {
                    alert(`O valor dos disjuntores: ${disjuntores.join(", ")}`);
                    break;
                } else {
                    alert("Entrada inválida!");
                }
            }
        } else if (disjuntorEs === "II") {
            while (true) {
                disjuntorTri();
                const continuar = prompt("Deseja calcular outro disjuntor trifásico? (S/N)")?.trim().toUpperCase();
                if (continuar === "S") {
                    continue;
                } else if (continuar === "N") {
                    alert(`O valor dos disjuntores: ${disjuntores.join(", ")}`);
                    break;
                } else {
                    alert("Entrada inválida!");
                    break;
                }
            }
        }

        const repetir = prompt("Deseja calcular outro circuito? (S/N)")?.trim().toUpperCase();
        if (repetir === "S") {
            continue;
        } else if (repetir === "N") {
            break;
        } else {
            alert("Entrada inválida!");
            break;
        }
    }
}

console.log("Histórico de Potências: ", potenciaCalc);
console.log("Histórico de Disjuntores: ", disjuntores);
console.log("Histórico de Circuitos: ", circuito);