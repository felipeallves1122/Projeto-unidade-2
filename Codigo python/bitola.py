import math

corrente_calc = []
circuito = []
bitola = []
def calc_corrente():
    num_circuito = input("Informe o nome do circuito: ")
    circuito.append(num_circuito)
    potencia = float(input("Informe a potência: "))
    tensao = float(input("Informe a tensão na rede: "))
    fator_potencia = 0.95
    corrente = math.ceil(potencia / (tensao*fator_potencia))
    corrente_calc.append(corrente)
    print(f"A corrente do circuito é: {corrente}A")
    return

def bilota():
    p = 0.0172
    l = float(input("Informe a distância entre o quadro e a carga: (m)"))
    i = float(input("Informe a corrente calculada: "))
    v = float(input("Informe a tensão na rede: "))
    queda = 0.04
    secao = math.ceil((2*p*l*i)/(v*queda))
    tipo_circuto = input("Informe o uso do circuito: ").upper()
    if secao <= 1.5 and tipo_circuto == "ILUMINAÇÃO":
        secao_calc = 1.5
        bitola.append(secao_calc)
        print(f"A seção para o circuito é: {secao_calc}mm²")
    elif secao <= 2.5 and tipo_circuto != "ILUMINAÇÃO":
        secao_calc = 2.5
        bitola.append(secao_calc)
        print(f"A seção para o circuito é: {secao_calc}mm²")
    elif secao <= 4:
        secao_calc = 4
        bitola.append(secao_calc)
        print(f"A seção para o circuito é: {secao_calc}mm²")
    elif secao <= 6:
        secao_calc = 6
        bitola.append(secao_calc)
        print(f"A seção para o circuito é: {secao_calc}mm²")
    elif secao <= 10:
        secao_calc = 10
        bitola.append(secao_calc)
        print(f"A seção para o circuito é: {secao_calc}mm²")
    else:
        print("Conferir na tabela da NBR NM 247-3, pois trata-se de um" \
        "condutor industrial")

while True:
    calc_corrente()
    bilota()
    continuar = input("Deseja continuar: (S/N)").upper()
    if continuar == "S":
        continue
    elif continuar == "N":
        print(f"O circuíto {circuito} tem seção {bitola}")
        break
    else:
        print("Entrada ínvalida")
        break