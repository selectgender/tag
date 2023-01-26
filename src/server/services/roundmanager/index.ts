import { OnStart, Service } from "@flamework/core"
import { Voting } from "server/services/voting"
import { gamemodes } from "server/gamemodes"
import settings from "./settings"

@Service({
  loadOrder: 0
})

export class RoundManager implements OnStart {
  constructor(private Voting: Voting) {}

  onStart() {
    const intermission = async () => {
      return Promise.delay(settings.intermissionLength)
        .then(() => this.Voting.StartVoting({ name: "gamemode", options: [ "testone", "testtwo", "testthree" ] }))
        .andThen(gamemodes.Normal)
    }

    while (true) {
      intermission().expect()
    }
  }
}
