import Rodux from "@rbxts/rodux"

export interface TaggedState {
  tagged: Array<Player>
}

export type TaggedActions =
  | {
    type: "set_tagger";
    player: Player;
  }
  | {
    type: "clear_tagged"
  }

export const DefaultTaggedState = identity<TaggedState>({
  tagged: [],
})

export const TaggedReducer = Rodux.createReducer<TaggedState, TaggedActions>(DefaultTaggedState, {
  set_tagger: (state, action) => {
    const newState = { ...state }
    newState.tagged.push(action.player)
    return newState
  },

  clear_tagged: (state) => {
    const newState = { ...state }
    newState.tagged.clear()
    return newState
  }
})
