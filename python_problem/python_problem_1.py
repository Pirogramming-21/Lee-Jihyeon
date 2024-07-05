num = 0

def get_valid_input():
    while True:
        try:
            count = int(input("부를 숫자의 개수를 입력하세요(1, 2, 3만 입력 가능) : "))
            if count not in [1, 2, 3]:
                print("1, 2, 3 중 하나를 입력하세요")
                continue
            return count
        except ValueError:
            print("정수를 입력하세요")

def player_turn(player, num):
    count = get_valid_input()
    for i in range(count):
        num += 1
        print(f"{player} : {num}")
        if num == 31:
            if player == "playerA":
                print("playerB win!")
            else:
                print("playerA win!")
            return num, True
    return num, False

def brGame():
    num = 0
    while num < 31:
        num, finished = player_turn("playerA", num)
        if finished:
            break
        num, finished = player_turn("playerB", num)
        if finished:
            break

brGame()