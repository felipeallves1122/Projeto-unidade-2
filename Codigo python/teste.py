import math

tomadas_calc = []
def tomadas_minimas():
    perimetro = float(input("Informe o perímetro do ambiente: "))
    print("Ambiente tipo I: Quartos e salas")
    print("Ambiente tipo II: Cozinha, copa e Área de serviço")
    print("Ambiente tipo III: ambientes com menos de 6m²")
    ambiente = input("Informe o tipo de ambiente: (I/II/III)").upper()
    if ambiente == "I":
        tomadas = math.ceil(perimetro/5)
        print(f"A quantidade mínima de tomadas é {tomadas}")
        tomadas_calc.append(tomadas)
    elif ambiente == "II":
        tomadas = math.ceil(perimetro/3.5)
        print(f"A quantidade mínima de tomadas é {tomadas}")
        tomadas_calc.append(tomadas)
    elif ambiente == "III":
        tomadas = 1
        print(f"A quantidade mínima de tomadas é 1")
        tomadas_calc.append(tomadas)
    else:
        print("Tipo de ambiente invalido")
    return 
while True:
    tomadas_minimas()
    continuar = input("\nDeseja calcular outr ambiente: (S/N)").upper()
    if continuar == "N":
        print(tomadas_calc)
        break

potencias = []
def potencia_iluminação():
    area = float(input("Informe a área do ambiente: "))
    potencia_total = 0
    area_restante = 0
    blocos = 0
    fator_potencia = 0.92
    if area <= 6:
        potencia_total += 100
        potencia_real = potencia_total * fator_potencia
        potencias.append(potencia_real)
        print(f"A área tem como potência mínima: {potencia_real}W")
    elif area > 6:
        area_restante = area - 6
        blocos = math.ceil(area_restante/4)
        potencia_total = 100 + (blocos * 60)
        potencia_real = math.ceil(potencia_total * fator_potencia)
        potencias.append(potencia_real)
        print(f"A área tem potência mínima: {potencia_real}W ")
    else:
        print("Entrada invalida!")
    return

while True:
    potencia_iluminação()
    continuar = input("Deseja calular outro ambiente: (S/N)").upper()
    if continuar == "N":
        print(potencias)
        break


luminarias = []
def quant_luminarias():
    potencia_mínima = int(input("Informe a potência mínima do ambiente: "))
    quanti_lampadas = 0
    if potencia_mínima == 92:
        quanti_lampadas = 1
        luminarias.append(quanti_lampadas)
        print(f"A quantidade mínima de lâmpadas é: {quanti_lampadas}")
    else:
        potencia_lamp = int(input("Informe a potência da luminaria utilizada: "))
        quanti_lampadas = math.ceil(potencia_mínima/potencia_lamp)
        luminarias.append(quanti_lampadas)
        print(f"A quantidade mínima de lâmpadas é: {quanti_lampadas}")
    return

while True:
    quant_luminarias()
    continuar = input("Deseja continuar o calculo: (S/N)").upper()
    if continuar == "N":
        print(luminarias)
        break