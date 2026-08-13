import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from room_manager import (
    create_room,
    join_room,
    get_room,
    remove_player,
    remove_room,
    request_restart,
    accept_restart,
    decline_restart,
    cancel_restart,
)

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    print("✅ Player Connected")

    current_room = None

    try:

        while True:

            # =================================================
            # RECEIVE MESSAGE
            # =================================================

            data = await websocket.receive_text()

            print("📩 Received:", data)

            message = json.loads(data)

            action = message.get("action")

            # =================================================
            # CREATE ROOM
            # =================================================

            if action == "create_room":

                room_id = await create_room(
                    message["player_name"],
                    websocket
                )

                current_room = room_id

                print(
                    f"🏠 Room Created: {room_id}"
                )

                await websocket.send_json({
                    "action": "room_created",
                    "room_id": room_id
                })

            # =================================================
            # JOIN ROOM
            # =================================================

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

                print(
                    f"✅ Player Joined Room: {current_room}"
                )

                players = [
                    {
                        "name": player["name"],
                        "symbol": player["symbol"]
                    }
                    for player in room["players"]
                ]

                print(
                    "Players being sent:",
                    players
                )

                # Send game_start to BOTH players
                for player in room["players"]:

                    await player["socket"].send_json({
                        "action": "game_start",
                        "room_id": current_room,
                        "players": players,
                        "turn": room["turn"]
                    })

            # =================================================
            # MOVE
            # =================================================

            elif action == "move":

                room = get_room(
                    message["room_id"]
                )

                if room is None:
                    continue

                # ---------------------------------------------
                # FIND CURRENT PLAYER
                # ---------------------------------------------

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

                # ---------------------------------------------
                # CHECK TURN
                # ---------------------------------------------

                if current_player["symbol"] != room["turn"]:

                    await websocket.send_json({
                        "action": "error",
                        "message": "It's not your turn."
                    })

                    continue

                # ---------------------------------------------
                # CHECK CELL
                # ---------------------------------------------

                index = message["index"]

                if room["board"][index] is not None:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Cell already occupied."
                    })

                    continue

                # ---------------------------------------------
                # MAKE MOVE
                # ---------------------------------------------

                room["board"][index] = (
                    current_player["symbol"]
                )

                # ---------------------------------------------
                # SWITCH TURN
                # ---------------------------------------------

                room["turn"] = (
                    "O"
                    if room["turn"] == "X"
                    else "X"
                )

                print(
                    f"{current_player['name']} played "
                    f"{current_player['symbol']} at {index}"
                )

                # ---------------------------------------------
                # BROADCAST BOARD
                # ---------------------------------------------

                for player in room["players"]:

                    await player["socket"].send_json({
                        "action": "update_board",
                        "board": room["board"],
                        "turn": room["turn"]
                    })

            # =================================================
            # EXIT GAME
            # =================================================

            elif action == "exit_game":

                room_id = message["room_id"]

                remaining_player = await remove_player(
                    room_id,
                    websocket
                )

                if remaining_player is not None:

                    await remaining_player["socket"].send_json({
                        "action": "opponent_left"
                    })

                current_room = None

            # =================================================
            # RESTART REQUEST
            # =================================================

            elif action == "restart_request":

                room_id = message["room_id"]

                room = get_room(room_id)

                if room is None:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Room not found."
                    })

                    continue

                result = request_restart(
                    room_id,
                    websocket
                )

                # ---------------------------------------------
                # ALREADY REQUESTED
                # ---------------------------------------------

                if result == "already_requested":

                    await websocket.send_json({
                        "action": "error",
                        "message": "You already requested a rematch."
                    })

                    continue

                # ---------------------------------------------
                # BOTH REQUESTED
                # ---------------------------------------------

                if result == "both_requested":

                    print(
                        f"🔄 Both players requested rematch: {room_id}"
                    )

                    accept_restart(room_id)

                    for player in room["players"]:

                        await player["socket"].send_json({
                            "action": "restart_game",
                            "board": room["board"],
                            "turn": room["turn"]
                        })

                    continue

                # ---------------------------------------------
                # FIRST PLAYER REQUESTED
                # ---------------------------------------------

                if result == "requested":

                    print(
                        f"🔄 Rematch requested: {room_id}"
                    )

                    # Notify opponent
                    for player in room["players"]:

                        if player["socket"] != websocket:

                            await player["socket"].send_json({
                                "action": "restart_request_received"
                            })

                            break

                    # -----------------------------------------
                    # 30 SECOND TIMEOUT
                    # -----------------------------------------

                    async def wait_for_restart_response():

                        await asyncio.sleep(30)

                        current_room_data = get_room(
                            room_id
                        )

                        if current_room_data is None:
                            return

                        # Check if request is still pending
                        if (
                            current_room_data["restart"]["pending"]
                            and
                            current_room_data["restart"]["requested_by"]
                            == websocket
                        ):

                            print(
                                f"⏰ Rematch expired: {room_id}"
                            )

                            # Notify BOTH players
                            for player in current_room_data["players"]:

                                try:

                                    await player["socket"].send_json({
                                        "action": "restart_expired"
                                    })

                                except Exception as e:

                                    print(
                                        "❌ Could not notify player:",
                                        e
                                    )

                            # Remove room
                            remove_room(room_id)

                    asyncio.create_task(
                        wait_for_restart_response()
                    )

            # =================================================
            # ACCEPT RESTART
            # =================================================

            elif action == "restart_accept":

                room_id = message["room_id"]

                room = get_room(room_id)

                if room is None:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Room not found."
                    })

                    continue

                success = accept_restart(
                    room_id
                )

                if not success:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Unable to restart game."
                    })

                    continue

                print(
                    f"🔄 Rematch accepted: {room_id}"
                )

                # Notify BOTH players
                for player in room["players"]:

                    await player["socket"].send_json({
                        "action": "restart_game",
                        "board": room["board"],
                        "turn": room["turn"]
                    })

            # =================================================
            # DECLINE RESTART
            # =================================================

            elif action == "restart_decline":

                room_id = message["room_id"]

                room = get_room(room_id)

                if room is None:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Room not found."
                    })

                    continue

                success = decline_restart(
                    room_id
                )

                if not success:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Unable to decline restart."
                    })

                    continue

                print(
                    f"❌ Rematch declined: {room_id}"
                )

                # Notify BOTH players
                for player in room["players"]:

                    await player["socket"].send_json({
                        "action": "restart_declined"
                    })

            # =================================================
            # CANCEL RESTART
            # =================================================

            elif action == "restart_cancel":

                room_id = message["room_id"]

                room = get_room(room_id)

                if room is None:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Room not found."
                    })

                    continue

                success = cancel_restart(
                    room_id,
                    websocket
                )

                if not success:

                    await websocket.send_json({
                        "action": "error",
                        "message": "Unable to cancel restart."
                    })

                    continue

                print(
                    f"❌ Rematch cancelled: {room_id}"
                )

                # Notify opponent
                for player in room["players"]:

                    if player["socket"] != websocket:

                        await player["socket"].send_json({
                            "action": "restart_cancelled"
                        })

                        break

    # =====================================================
    # PLAYER DISCONNECTED
    # =====================================================

    except WebSocketDisconnect:

        print("❌ Player Disconnected")

        # If player disconnects while inside a room,
        # notify the opponent.
        if current_room is not None:

            remaining_player = await remove_player(
                current_room,
                websocket
            )

            if remaining_player is not None:

                try:

                    await remaining_player["socket"].send_json({
                        "action": "opponent_left"
                    })

                except Exception as e:

                    print(
                        "❌ Could not notify opponent:",
                        e
                    )

    # =====================================================
    # OTHER ERRORS
    # =====================================================

    except Exception as e:

        print(
            "❌ WebSocket Error:",
            e
        )