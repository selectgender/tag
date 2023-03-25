import { Players } from "@rbxts/services";
import { Controller, Dependency, OnStart } from "@flamework/core";
import { Components } from "@flamework/components";
import { Platforming } from "client/components/platforming";
import { promiseR6 } from "@rbxts/promise-character";

const components = Dependency<Components>();

const player = Players.LocalPlayer;

@Controller({
	loadOrder: 0,
})
export class Character implements OnStart {
	onStart() {
		const initializePlatforming = (character: Model) => {
			const platforming = components.addComponent<Platforming>(character);

			promiseR6(character).then((model) => {
				model.Humanoid.Died.Connect(() => {
					platforming.Destroy();
					components.removeComponent<Platforming>(character);
				});
			});
		};

		if (player.Character) initializePlatforming(player.Character);
		player.CharacterAdded.Connect(initializePlatforming);
	}
}
