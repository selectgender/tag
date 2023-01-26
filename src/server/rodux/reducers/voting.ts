import Rodux from "@rbxts/rodux"
import { TopicFormat } from "shared/Types";

export interface VotingState {
  voting: boolean;
  votes: Record<string, string>;
  topic: TopicFormat | undefined;
}

export type VotingActions =
  | {
    type: "start_vote";
  }
  | {
    type: "stop_vote";
  }
  | {
    type: "cast_vote";
    player: Player;
    vote: string;
  }
  | {
    type: "create_topic";
    topic: TopicFormat;
  }

export const DefaultVotingState = identity<VotingState>({
  voting: false,
  votes: {},
  topic: undefined,
})

export const VotingReducer = Rodux.createReducer<VotingState, VotingActions>(DefaultVotingState, {
  start_vote: (state) => {
    return { ...state,
      voting: true,
      votes: {},
    }
  },

  stop_vote: (state) => {
    return { ...state, voting: false }
  },

  cast_vote: (state, action) => {
    if (!state.voting) {
      warn("voting has not yet started")
      return state
    }

    if (!state.topic) {
      warn("no topic has been chosen")
      return state
    }

    if (!state.topic.options.includes(action.vote)) {
      warn(`${action.vote} is not a valid vote option`)
      return state
    }

    const newState = { ...state }
    newState.votes[action.player.Name] = action.vote
    return newState
  },
  
  create_topic: (state, action) => {
    return {
      ...state,
      topic: action.topic,
    }
  }
})
