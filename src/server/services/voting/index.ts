import { OnStart, Service } from "@flamework/core";
import { Events } from "server/network";
import { TopicFormat } from "shared/Types";
import store from "server/rodux/store";
import Settings from "./settings"

@Service({
	loadOrder: 1,
})
export class Voting implements OnStart {
	onStart() {
		Events.CastVote.connect((player, vote) => {
			store.dispatch({ type: "cast_vote", player: player, vote: vote });
		});
	}

	public StartVoting(topic: TopicFormat) {
		store.dispatch({ type: "start_vote" });
		store.dispatch({ type: "create_topic", topic: topic });
		Events.BeginVote.broadcast();

		task.wait(Settings.votingLength);

		store.dispatch({ type: "stop_vote" });
		Events.StopVote.broadcast();

		// const votes = store.getState().voting.votes;
		// for (const [key, value] of pairs(votes)) {
			// print(key, value);
		// }
	}
}
