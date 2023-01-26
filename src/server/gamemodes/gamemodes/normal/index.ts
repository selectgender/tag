import settings from "./settings"

async function winCondition() {
  return Promise.delay(settings.roundLength)
    .then(() => print("havent implemented tagger system yet... do it now!!!"))
}

export = winCondition
