import math # Utilizado para fazer uso da função math.ceil

tomadas_calc = [] # lista que guarda os valores calculados das tomadas
def tomadas_minimas():  # função que faz o calculo das tomadas
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
while True: #repetição para pedir a função
    tomadas_minimas()
    continuar = input("\nDeseja calcular outr ambiente: (S/N)").upper() # parametro usado para parar o loop
    if continuar == "N":
        print(tomadas_calc)
        break
    