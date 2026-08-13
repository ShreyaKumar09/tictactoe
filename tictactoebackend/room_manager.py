import random
import string
import asyncio


rooms = {}


# =========================================================
# ROOM ID
# =========================================================

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


# =========================================================
# CREATE ROOM
# =========================================================

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

        "restart": {
            "requested_by": None,
            "pending": False,
            "task": None,
        },
    }

    return room_id


# =========================================================
# JOIN ROOM
# =========================================================

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


# =========================================================
# GET ROOM
# =========================================================

def get_room(room_id):
    return rooms.get(room_id)


# =========================================================
# REMOVE PLAYER
# =========================================================

async def remove_player(room_id, websocket):

    room = rooms.get(room_id)

    if room is None:
        return None

    current_player = None

    for player in room["players"]:
        if player["socket"] == websocket:
            current_player = player
            break

    if current_player is None:
        return None

    room["players"].remove(current_player)

    # Cancel restart timer
    task = room["restart"].get("task")

    if task is not None and not task.done():
        task.cancel()

    # No players left
    if len(room["players"]) == 0:
        del rooms[room_id]
        return None

    # One player remains
    return room["players"][0]


# =========================================================
# REQUEST RESTART
# =========================================================

def request_restart(room_id, websocket):

    room = rooms.get(room_id)

    if room is None:
        return None

    current_player = None

    for player in room["players"]:
        if player["socket"] == websocket:
            current_player = player
            break

    if current_player is None:
        return None

    # Same player clicked restart again
    if (
        room["restart"]["pending"]
        and room["restart"]["requested_by"] == websocket
    ):
        return "already_requested"

    # Opponent already requested
    if (
        room["restart"]["pending"]
        and room["restart"]["requested_by"] != websocket
    ):
        return "both_requested"

    # First request
    room["restart"]["requested_by"] = websocket
    room["restart"]["pending"] = True

    return "requested"


# =========================================================
# ACCEPT RESTART
# =========================================================

def accept_restart(room_id):

    room = rooms.get(room_id)

    if room is None:
        return False

    room["board"] = [None] * 9
    room["turn"] = "X"
    room["winner"] = None
    room["game_started"] = True

    room["restart"]["requested_by"] = None
    room["restart"]["pending"] = False

    task = room["restart"].get("task")

    if task is not None and not task.done():
        task.cancel()

    room["restart"]["task"] = None

    return True


# =========================================================
# DECLINE RESTART
# =========================================================

def decline_restart(room_id):

    room = rooms.get(room_id)

    if room is None:
        return False

    room["restart"]["requested_by"] = None
    room["restart"]["pending"] = False

    task = room["restart"].get("task")

    if task is not None and not task.done():
        task.cancel()

    room["restart"]["task"] = None

    return True


# =========================================================
# CANCEL RESTART
# =========================================================

def cancel_restart(room_id, websocket):

    room = rooms.get(room_id)

    if room is None:
        return False

    if room["restart"]["requested_by"] != websocket:
        return False

    room["restart"]["requested_by"] = None
    room["restart"]["pending"] = False

    task = room["restart"].get("task")

    if task is not None and not task.done():
        task.cancel()

    room["restart"]["task"] = None

    return True


# =========================================================
# REMOVE ROOM
# =========================================================

def remove_room(room_id):

    if room_id in rooms:
        del rooms[room_id]
        return True

    return False