import random
import string

rooms = {}


def generate_room_id():
    while True:
        room_id = "".join(
            random.choices(
                string.ascii_uppercase + string.digits,
                k=6
            )
        )

        if room_id not in rooms:
            return room_id


async def create_room(player_name, websocket):
    room_id = generate_room_id()

    rooms[room_id] = {
        "players": [
            {
                "name": player_name,
                "socket": websocket,
                "symbol": "X",
            }
        ],

        "board": [None] * 9,

        "turn": "X",

        "winner": None,

        "game_started": False,
    }

    return room_id


async def join_room(room_id, player_name, websocket):

    if room_id not in rooms:
        return False

    room = rooms[room_id]

    if len(room["players"]) >= 2:
        return False

    room["players"].append(
        {
            "name": player_name,
            "socket": websocket,
            "symbol": "O",
        }
    )

    room["game_started"] = True

    return True


def get_room(room_id):
    return rooms.get(room_id)


async def remove_player(room_id, websocket):

    if room_id not in rooms:
        return None

    room = rooms[room_id]

    current_player = None

    for player in room["players"]:
        if player["socket"] == websocket:
            current_player = player
            break

    if current_player is None:
        return None

    room["players"].remove(current_player)

    if len(room["players"]) == 0:
        del rooms[room_id]
        return None

    return room["players"][0]