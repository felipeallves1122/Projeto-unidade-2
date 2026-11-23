import math

potencia_calc = []
def potencia():
    potencia_total = 0
    while True:
        potencia_aparente = float(input("Informe a potência"))
        potencia_total += potencia_aparente
        continuar = input("Adicionar mais uma potencia: (S/N)").upper()
        if continuar == "S":
            continue
        elif continuar == "N":
            print(f"potência total: {potencia_total}")
            potencia_calc.append(potencia_total)
            break
        else:
            print("Entrada inválida")
            break
    return
circuito = []
disjuntores = []
def disjuntor_mono():
    circuit = input("Informe o nome do circuíto: ")
    circuito.append(circuit)
    disjuntor = 0
    potencia_aparente = float(input("Informe a potência total: "))
    tensao = float(input("Informe a tensão usada: "))
    corrente = potencia_aparente/tensao
    if corrente <= 10:
        disjuntor = 10
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 10 and corrente <= 16:
        disjuntor = 16
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 16 and corrente <= 20:
        disjuntor = 20
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 20 and corrente <= 25:
        disjuntor = 25
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 25 and corrente <= 32:
        disjuntor = 32
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 32 and corrente <= 40:
        disjuntor = 40
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 40 and corrente <= 50:
        disjuntor = 50
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 50 and corrente <= 63:
        disjuntor = 63
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    else:
        disjuntor = corrente
        disjuntores.append(disjuntor)
        print(f"O disjuntor deve ter {disjuntor}A")
    return

def disjuntor_tri():
    disjuntor = 0
    potencia_aparente = float(input("Informe a potência total: "))
    tensao = float(input("Informe a tensão usada: "))
    corrente = potencia_aparente/(tensao*math.sqrt(3))
    if corrente <= 10:
        disjuntor = 10
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 10 and corrente <= 16:
        disjuntor = 16
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 16 and corrente <= 20:
        disjuntor = 20
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 20 and corrente <= 25:
        disjuntor = 25
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 25 and corrente <= 32:
        disjuntor = 32
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 32 and corrente <= 40:
        disjuntor = 40
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 40 and corrente <= 50:
        disjuntor = 50
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    elif corrente > 50 and corrente <= 63:
        disjuntor = 63
        disjuntores.append(disjuntor)
        print(f"O disjuntor é de {disjuntor}A")
    else:
        disjuntor = corrente
        disjuntores.append(disjuntor)
        print(f"O disjuntor deve ter {disjuntor}A")
    return

while True:
    potencia()
    print("Tipo 1: Disjuntor monofásico")
    print("Tipo 2: Disjuntor trifásico")
    disjuntor_es = int(input("Informe o tipo de disjuntor: "))
    if disjuntor_es == 1:
        while True:
            disjuntor_mono()
            continuar = input("Deseja continuar: (S/N)").upper()
            if continuar == "S":
                continue
            elif continuar == "N":
                print(f"O valor dos disjuntores: {disjuntores}")
                break
            else:
                print("Entrada inválida")
                break
    elif disjuntor_es == 2:
        while True:
            disjuntor_tri()
            continuar = input("Deseja continuar: (S/N)").upper()
            if continuar == "S":
                continue
            elif continuar == "N":
                print(f"O valor dos disjuntores: {disjuntores}")
                break
            else:
                print("Entrada inválida")
                break
    else:
        print("Entrada inválida")
        break
