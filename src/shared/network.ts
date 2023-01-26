import { Networking } from "@flamework/networking";

// Client -> Server events
interface ServerEvents {
  CastVote(vote: string): void
}

// Server -> Client events
interface ClientEvents {
  BeginVote(): void;
  StopVote(): void;
}

// Client -> Server functions
interface ServerFunctions {}

// Server -> Client functions
interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
