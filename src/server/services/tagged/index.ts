import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import store from "server/rodux/store";
import randomtagger from "server/gamemodes/commonfunctions/randomtagger";

@Service({
	loadOrder: 2,
})
export class Tagged implements OnStart {
	onStart() {
		const highlights: Array<Highlight> = [];
    async function applyHighlight(player: Player) {
      if (!player.Character) return;
      const character = player.Character;

      const highlight = new Instance("Highlight");
      highlight.Adornee = character;
      highlight.FillColor = Color3.fromRGB(255, 0, 0);
      highlight.OutlineColor = Color3.fromRGB(139, 0, 0);
      highlight.Parent = character;
      highlights.push(highlight);
    }

		store.changed.connect((state) => {
			highlights.forEach((highlight) => highlight.Destroy());
			highlights.clear();

			state.tagged.tagged.forEach((tagged) => {
        applyHighlight(tagged)
        tagged.CharacterAdded.Connect(() => applyHighlight(tagged));
			});
		});

    Players.PlayerRemoving.Connect((player) => {
      const state = store.getState()
      const index = state.tagged.tagged.indexOf(player);
      const isTagged = index > -1

      // weird hacky check that 
      if (isTagged) {
        state.tagged.tagged.remove(index);
        randomtagger()
      }
    })
	}
}
