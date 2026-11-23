#teste de sft

ambientes = []
areas = []
def armazenar():
    ambiente = input("informe o ambiente: ")
    ambientes.append(ambiente)
    a = float(input("informe o 1º valor: "))
    b = float(input("informe o 2º valor: "))
    area = a*b
    areas.append(area)
    print(f"o ambiente {ambiente} tem área igual: {area}")
    return
while True:
    armazenar()
    continuar = input("Deseja continuar: (S/N)").upper()
    if continuar == "S":
        continue
    elif continuar =="N":
        print(f"Os ambientes {ambientes} tem área: {areas}")
        break
    else:
        print("entrada inválida")
        break
