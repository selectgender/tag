import { UserInputService } from "@rbxts/services"
import { OnStart } from "@flamework/core"
import { Component, BaseComponent } from "@flamework/components"
import { promiseR6 } from "@rbxts/promise-character"
import { Character } from "client/controllers/character"

interface Attributes {
  dashSpeed: number
  walkSpeed: number
}

@Component({
  defaults: {
    dashSpeed: 20,
    walkSpeed: 24
  },
  refreshAttributes: false
})
export class Platforming extends BaseComponent<Attributes, Model> implements OnStart {
  private mass = promiseR6(this.instance)
    .then((character) => character.GetChildren()
      .filter((part): part is BasePart => part.IsA("BasePart"))
      .reduce((sum, part) => sum + part.GetMass(), 0)).expect()

  private async Dash() {
    const character = await promiseR6(this.instance)
    const rootpart = character.HumanoidRootPart
    const humanoid = character.Humanoid
    const lookvector = rootpart.CFrame.LookVector

    if (humanoid.Sit) return;

    humanoid.Sit = true
    rootpart.ApplyImpulse(lookvector.mul(this.mass * this.attributes.dashSpeed))
  }

  onStart() {
    promiseR6(this.instance).then((character) => {
        character.Humanoid.WalkSpeed = this.attributes.walkSpeed
        character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Ragdoll, false)
        character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Physics, false)
      })

    UserInputService.InputBegan.Connect((input, gameProcessed) => {
      if (gameProcessed) return;
      if (input.KeyCode === Enum.KeyCode.E) this.Dash();
    })
  }
}
