import { Players } from "@rbxts/services"
import store from "server/rodux/store"

export = function(): Player {
  const player_array = Players.GetPlayers()
  const random_player = player_array[math.random(0, player_array.size() - 1)]

  store.dispatch({ type: "set_tagger", player: random_player })
  return random_player;
}
