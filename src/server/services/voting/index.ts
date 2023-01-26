import { OnStart, Service } from "@flamework/core";
import { Events } from "server/network";
import store from "server/rodux/store";
import { TopicFormat } from "shared/Types";

@Service({
	loadOrder: 1,
})
export class Voting implements OnStart {
	onStart() {
		Events.CastVote.connect((player, vote) => {
			store.dispatch({ type: "cast_vote", player: player, vote: vote });
			print(`player ${player} has voted for ${vote}`);
		});
	}

	public StartVoting(topic: TopicFormat) {
		store.dispatch({ type: "start_vote" });
		store.dispatch({ type: "create_topic", topic: topic });
		Events.BeginVote.broadcast();
		print("voting started!");

		task.wait(15);

		store.dispatch({ type: "stop_vote" });
		Events.StopVote.broadcast();
		print("voting ended!");

		print("votes:");
		const votes = store.getState().voting.votes;
		for (const [key, value] of pairs(votes)) {
			print(key, value);
		}
	}
}
