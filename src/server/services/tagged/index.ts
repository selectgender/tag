import { OnStart, Service } from "@flamework/core";
import store from "server/rodux/store";

@Service({
  loadOrder: 3,
})

export class Tagged implements OnStart {
  onStart() {
    const highlights: Array<Highlight> = []

    store.changed.connect(() => {
      highlights.forEach((highlight) => highlight.Destroy())
      highlights.clear()

      store.getState()
        .tagged.tagged
        .forEach((tagged) => {
          const highlight = new Instance("Highlight")
          highlight.Adornee = tagged.Character
          highlight.FillColor = Color3.fromRGB(255, 0, 0)
          highlight.Parent = tagged.Character
          highlights.push(highlight)
        })
    })
  }
}
