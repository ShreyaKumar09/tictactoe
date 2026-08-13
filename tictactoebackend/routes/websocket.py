from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from room_manager import( create_room, join_room, get_room ,remove_player)
import json

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()
    print("✅ Player Connected")

    current_room = None

    try:
        while True:

            # Receive data
            data = await websocket.receive_text()
            print("📩 Received:", data)

            message = json.loads(data)
            action = message.get("action")

            # -------------------------------------------------
            # CREATE ROOM
            # -------------------------------------------------
            if action == "create_room":

                room_id = await create_room(
                    message["player_name"],
                    websocket
                )

                current_room = room_id

                print(f"🏠 Room Created: {room_id}")

                await websocket.send_json({
                    "action": "room_created",
                    "room_id": room_id
                })

            # -------------------------------------------------
            # JOIN ROOM
            # -------------------------------------------------
            elif action == "join_room":

                success = await join_room(
                    message["room_id"],
                    message["player_name"],
                    websocket
                )

                if not success:
                    await websocket.send_json({
                        "action": "error",
                        "message": "Room is full or does not exist."
                    })
                    continue

                current_room = message["room_id"]

                room = get_room(current_room)

                print(f"✅ Player Joined Room: {current_room}")

                players = [
                    {
                        "name": player["name"],
                        "symbol": player["symbol"]
                    }
                    for player in room["players"]
                ]
                print("Players being sent:", players)

                # Notify both players that the game has started
                for player in room["players"]:
                    await player["socket"].send_json({
                        "action": "game_start",
                        "room_id": current_room,
                        "players": players,
                        "turn": room["turn"]
                    })

            # -------------------------------------------------
            # MOVE
            # -------------------------------------------------
            elif action == "move":

                room = get_room(message["room_id"])

                if room is None:
                    continue

                # -----------------------------------------
                # Identify which player sent this move
                # -----------------------------------------

                current_player = None

                for player in room["players"]:
                    if player["socket"] == websocket:
                        current_player = player
                        break

                if current_player is None:
                    await websocket.send_json({
                        "action": "error",
                        "message": "Player not found."
                    })
                    continue

                # -----------------------------------------
                # Check if it's this player's turn
                # -----------------------------------------

                if current_player["symbol"] != room["turn"]:
                    await websocket.send_json({
                        "action": "error",
                        "message": "It's not your turn."
                    })
                    continue

                # -----------------------------------------
                # Check if cell is already occupied
                # -----------------------------------------

                index = message["index"]

                if room["board"][index] is not None:
                    await websocket.send_json({
                        "action": "error",
                        "message": "Cell already occupied."
                    })
                    continue

                # -----------------------------------------
                # Make move
                # -----------------------------------------

                room["board"][index] = current_player["symbol"]

                # Switch turn

                room["turn"] = (
                    "O"
                    if room["turn"] == "X"
                    else "X"
                )

                print(
                    f"{current_player['name']} played "
                    f"{current_player['symbol']} at {index}"
                )

                # -----------------------------------------
                # Broadcast updated board
                # -----------------------------------------

                for player in room["players"]:
                    await player["socket"].send_json({
                        "action": "update_board",
                        "board": room["board"],
                        "turn": room["turn"]
                    })
                
            # -------------------------------------------------
            # EXIT GAME
            # -------------------------------------------------
                
            elif action == "exit_game":
                 remaining_player = await remove_player(
                    message["room_id"],
                     websocket
                )
                 if remaining_player is not None:
                    await remaining_player["socket"].send_json({
                        "action": "opponent_left"
                    })

    except WebSocketDisconnect:
        print("❌ Player Disconnected")

    except Exception as e:
        print("❌ WebSocket Error:", e)