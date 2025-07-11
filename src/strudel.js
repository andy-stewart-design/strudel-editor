import { repl, evalScope } from "@strudel/core";
import {
  getAudioContext,
  webaudioOutput,
  initAudioOnFirstClick,
  registerSynthSounds,
  samples,
} from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";

async function prebake() {
  initAudioOnFirstClick();
  registerSynthSounds();

  evalScope(
    import("@strudel/core"),
    import("@strudel/mini"),
    import("@strudel/webaudio"),
    import("@strudel/tonal")
  );

  // load samples
  const ds = "https://raw.githubusercontent.com/felixroos/dough-samples/main/";
  await Promise.all([
    samples(`${ds}/tidal-drum-machines.json`),
    samples(`${ds}/piano.json`),
    samples(`${ds}/Dirt-Samples.json`),
    samples(`${ds}/EmuSP12.json`),
    samples(`${ds}/vcsl.json`),
    samples(`${ds}/mridangam.json`),
  ]);

  return repl({
    defaultOutput: webaudioOutput,
    getTime: () => getAudioContext().currentTime,
    transpiler,
  });
}

export { prebake };
