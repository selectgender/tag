import { promiseR6 } from "@rbxts/promise-character";

export = function (character: Model): void {
	promiseR6(character).then((character) => {
		const explosion = new Instance("Explosion");
		explosion.Position = character.HumanoidRootPart.Position;
		explosion.Parent = character;
		task.wait(1);
		explosion.Destroy();
	});
};
