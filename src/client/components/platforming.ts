import { ContextActionService } from "@rbxts/services"
import { Component, BaseComponent } from "@flamework/components"
import { OnStart } from "@flamework/core"
import { promiseR6 } from "@rbxts/promise-character"
import { Janitor } from "@rbxts/janitor"

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
  private obliterator = new Janitor()
  
  private mass = promiseR6(this.instance)
    .then((character) => character.GetChildren()
      .filter((part): part is BasePart => part.IsA("BasePart"))
      .reduce((sum, part) => sum + part.GetMass(), 0)).expect()

  private DashParticle() {
    const obliterator = new Janitor();

    const attachment0 = obliterator.Add(new Instance("Attachment"), "Destroy")
    const attachment1 = obliterator.Add(new Instance("Attachment"), "Destroy")
    const trail = obliterator.Add(new Instance("Trail"), "Destroy")

    attachment0.Position = new Vector3(0, -1, 0.5) 
    attachment1.Position = new Vector3(0, 1, 0.5) 
    trail.Attachment0 = attachment0
    trail.Attachment1 = attachment1

    trail.Lifetime = 0.2
    trail.WidthScale = new NumberSequence([
      new NumberSequenceKeypoint(0, 1),
      new NumberSequenceKeypoint(1, 0),
    ])

    promiseR6(this.instance).then((character) => {
      const rootpart = character.HumanoidRootPart
      attachment0.Parent = rootpart
      attachment1.Parent = rootpart
      trail.Parent = rootpart

      task.wait(1)
      obliterator.Destroy()
    })
  }

  private async Dash() {
    const character = await promiseR6(this.instance)
    const humanoid = character.Humanoid

    if (humanoid.Sit) return;

    const rootpart = character.HumanoidRootPart
    const lookvector = rootpart.CFrame.LookVector

    humanoid.Sit = true
    rootpart.ApplyImpulse(lookvector.mul(this.mass * this.attributes.dashSpeed))
    this.DashParticle()
  }

  async onStart() {
    const character = await promiseR6(this.instance)
    const humanoid = character.Humanoid
    humanoid.WalkSpeed = this.attributes.walkSpeed

    const disable_ragdolling = () => {
      humanoid.SetStateEnabled(Enum.HumanoidStateType.Physics, false)
      humanoid.SetStateEnabled(Enum.HumanoidStateType.Ragdoll, false)
      humanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, false)
    }

    disable_ragdolling()

    this.obliterator.Add(humanoid.StateChanged.Connect(disable_ragdolling))
    ContextActionService.BindAction("Dash", () => this.Dash(), true, Enum.KeyCode.E, Enum.KeyCode.ButtonR1)
    ContextActionService.SetTitle("Dash", "Dash")
    ContextActionService.SetPosition("Dash", new UDim2(1, -70, 0, 10))
  }

  public Destroy() {
    this.obliterator.Destroy()
    ContextActionService.UnbindAction("Dash")
  }
}
