import Rodux from "@rbxts/rodux";

export interface TaggedState {
	tagged: Array<Player>;
}

export type TaggedActions =
	| {
			type: "set_tagger";
			player: Player;
	  }
	| {
			type: "set_untagged";
			player: Player;
	  }
	| {
			type: "clear_tagged";
	  };

export const DefaultTaggedState = identity<TaggedState>({
	tagged: [],
});

export const TaggedReducer = Rodux.createReducer<TaggedState, TaggedActions>(DefaultTaggedState, {
	set_tagger: (state, action) => {
		const newState = { ...state };
		if (state.tagged.includes(action.player)) return newState;
		newState.tagged.push(action.player);
		return newState;
	},

	set_untagged: (state, action) => {
		const index = state.tagged.indexOf(action.player);
    const isTagged = index > -1
		const newState = { ...state };

    // weird check but it works
		if (isTagged) {
			newState.tagged.remove(index);
			return newState;
		} else {
			warn(`${action.player} was not tagged, so cant remove`);
			return newState;
		}
	},

	clear_tagged: (state) => {
		return { ...state, tagged: [] };
	},
});
