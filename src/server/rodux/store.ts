import Rodux from "@rbxts/rodux";

import { VotingActions, VotingReducer, DefaultVotingState, VotingState } from "server/rodux/reducers/voting";
import { TaggedActions, TaggedReducer, DefaultTaggedState, TaggedState } from "server/rodux/reducers/tagged"

export interface State {
	voting: VotingState;
  tagged: TaggedState
}

export type Actions = VotingActions | TaggedActions;

/*
  * typescript wouldnt stop whining

const initialState = identity<State>({
	voting: DefaultVotingState,
  tagged: DefaultTaggedState,
});

*/

const reducer = Rodux.combineReducers({
	voting: VotingReducer,
  tagged: TaggedReducer,
});

export default new Rodux.Store<State, Actions>(reducer, undefined);
