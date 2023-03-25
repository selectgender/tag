import { OnStart, Service } from "@flamework/core";
import { Voting } from "server/services/voting";
import { gamemodes } from "server/gamemodes";
import settings from "./settings";
import { Players, ServerStorage, Workspace } from "@rbxts/services";

@Service({
	loadOrder: 0,
})
export class RoundManager implements OnStart {
	constructor(private Voting: Voting) {}

	onStart() {
		const assets = ServerStorage.assets;
		const maps = assets.maps;

    // I know this code is abominable but I like my promises
		const intermission = async () => {
			return Promise.delay(0.1)
				.then(() => {
					const lobby = assets.lobby.Clone();
					lobby.Parent = Workspace;
					return lobby;
				})
				.tap(() => task.wait(settings.intermissionLength))
				.tap(() => this.Voting.StartVoting({ name: "gamemode", options: ["testone", "testtwo", "testthree"] }))
				.then((lobby) => lobby.Destroy())
				.then(() => {
					const mapsArray = maps.GetChildren();
          const chosen = mapsArray[math.random(0, mapsArray.size() - 1)].Clone();
          chosen.Parent = Workspace
					return chosen
				})
				.tap(gamemodes.Normal)
				.then((map) => map.Destroy());
		};

		while (true) {
      // do task.wait(1); while (!(Players.GetPlayers().size() >= 2)) // actual gameplay stuffz
      do task.wait(1); while (!(Players.GetPlayers().size() >= 1)) // this is for testing
			intermission().expect();
		}
	}
}
