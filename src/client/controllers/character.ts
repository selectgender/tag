import { Players } from "@rbxts/services"
import { Controller, Dependency, OnStart } from "@flamework/core"
import { Components } from "@flamework/components"
import { Platforming } from "client/components/platforming";

const components = Dependency<Components>();

const player = Players.LocalPlayer

@Controller({
  loadOrder: 0
})
export class Character implements OnStart {
  onStart() {
    const initializePlatforming = (character: Model) => {
      components.addComponent<Platforming>(character);
    }

    if (player.Character) initializePlatforming(player.Character);
    player.CharacterAdded.Connect(initializePlatforming)
  }
} 
