import { Workspace } from "@rbxts/services"

export = (args: string[]): void => {
  const camera = Workspace.CurrentCamera
  if (!camera) return;

  const fov = args[0] || 70
  const numberFov = tonumber(fov)
  if (!numberFov) return;
  camera.FieldOfView = numberFov
}
