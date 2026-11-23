import math

quanti_lux = []
quanti_luminarias = []

def lumens():
    print("Tipo I: Quarto e Sala")
    print("Tipo II: Cozinha, copa e Área de serviço")
    print("Tipo III: Escritórios")
    tipo = input("Informe o tipo de ambiente: (I/II/III)").upper()
    area = float(input("Informe a área do ambiente: (m²)"))
    if tipo == "I":
        lux = area * 200
        quanti_lux.append(lux)
        print(f"A quantidade de lumens é: {lux}")
    elif tipo == "II":
        lux = area * 300
        quanti_lux.append(lux)
        print(f"A quantidade de lumens é: {lux}")
    elif tipo =="III":
        lux = area * 400
        quanti_lux.append(lux)
        print(f"A quantidade de lumens é: {lux}")
    else:
        print("Entrada inválida")
    return

def luminarias():
    lux = float(input("Informe a quantidade de lumens: (lux)"))
    print("A quantidade de lumens da luminaria pode ser identificada pela caixa")
    lux_lum = float(input("Informe a quantidade de lumens da luminaria: (lux)"))
    quanti_lampadas = math.ceil(lux/lux_lum)
    quanti_luminarias.append(quanti_lampadas)
    print(f"A quantidade mínima de lâmpadas é: {quanti_lampadas}")
    return