// TODO fix FOV command not detecting argument

import { Players } from "@rbxts/services"
import { Controller, OnStart } from "@flamework/core"
import Settings from "./settings"
import CommandFunctions from "./commands"

@Controller({
  loadOrder: 1
})
export class Commands implements OnStart {
  onStart() {
    Players.LocalPlayer.Chatted.Connect((originalMessage) => {
      const lowerMessage = string.lower(originalMessage)
      const [prefixMatch, _] = string.match(lowerMessage, `^${Settings.prefix}`)

      if (!prefixMatch) return;

      const [message] = string.gsub(lowerMessage, prefixMatch as string, "", 1)
      
      const args: string[] = []

      // according to weird wizard magic this gets the arguments
      // please dont mess with this
      // stolen from that one emerald slash tutorial btw thanx u so much
      for (const [argument] of string.gmatch(message, "[^%s]+")) {
        args.push(argument as string)
      }

      const commandName = args[0] as keyof typeof CommandFunctions 
      const commandFunction = CommandFunctions[commandName]
      args.remove(0)

      if (!commandFunction) return;
      commandFunction(args as keyof typeof commandFunction)
    })
  }
} 
