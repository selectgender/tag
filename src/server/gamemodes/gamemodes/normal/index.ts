import settings from "./settings";
import store from "server/rodux/store";
import explode from "server/gamemodes/commonfunctions/explode";
import randomtagger from "server/gamemodes/commonfunctions/randomtagger";
import { Players } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { promiseR6 } from "@rbxts/promise-character";

async function winCondition() {
	store.dispatch({ type: "clear_tagged" });

	function touched(touched: BasePart) {
		const character = touched.Parent;
		if (!character?.FindFirstChild("Humanoid")) return;

		const taggedPlayer = Players.GetPlayerFromCharacter(character);
		if (!taggedPlayer) return;

		const currentTagger = store.getState().tagged.tagged[0];
		store.dispatch({ type: "set_untagged", player: currentTagger });
		store.dispatch({ type: "set_tagger", player: taggedPlayer });
	}

	const obliterator = new Janitor();

	async function connectTouched(player: Player) {
    if (!player.Character) return;
    const tagger = await promiseR6(player.Character)
    task.wait(1);
    obliterator.Add(tagger.Torso.Touched.Connect(touched));
	}

	const signal = store.changed.connect((state) => {
		obliterator.Cleanup();
		state.tagged.tagged.forEach((tagged) => {
      connectTouched(tagged)
      obliterator.Add(tagged.CharacterAdded.Connect(() => connectTouched(tagged)))
    });
	});

  randomtagger()

	task.wait(settings.roundLength);

	const taggedPlayer = store.getState().tagged.tagged[0];
	const character = taggedPlayer.Character;

	store.dispatch({ type: "clear_tagged" });
	signal.disconnect();
	obliterator.Destroy();
	if (!character) return;
	explode(character);
}

export = winCondition;
