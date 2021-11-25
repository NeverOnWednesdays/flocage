let mod = 270;
let barfcore = flock.synth({
    synthDef: {
      id: "carrier",
      ugen: "flock.ugen.filter.moog",
      cutoff: {
      ugen: "flock.ugen.sinOsc",
      freq: 80,
      phase: {
        id: "mod",
        ugen: "flock.ugen.sinOsc",
        freq: 34.0,
        mul: {
            ugen: "flock.ugen.sinOsc",
            freq: 1 / mod,
            mul: flock.PI
        },
        add: flock.PI
      },
      mul: 5000,
      add: 7000
      },
      resonance: {
        ugen: "flock.ugen.sinOsc",
        freq: 1,
        mul: 1.5,
        add: 1.5
      },
      source: {
        ugen: "flock.ugen.lfSaw",
        freq: {
          ugen: "flock.ugen.sequence",
          freq: mod / 50,
          loop: 1,
          values: [mod + 13, 221 * 5/7, mod, (mod + 20) * 3/9, 220 * 4/5, 227, mod, mod * 3],
          options: {
              interpolation: "linear"
          }
        }
      },
      mul: 0.35
    },
    addToEnvironment: false
  });
let drone = flock.synth({
  synthDef: {
    id: "carrier",
    ugen: "flock.ugen.sinOsc",
    freq: mod * 1.5,
    phase: {
      id: "mod",
      ugen: "flock.ugen.sinOsc",
      freq: mod * 0.5,
      mul: {
        ugen: "flock.ugen.sinOsc",
        freq: 1 / (mod / 5),
        mul: flock.PI
      },
      add: flock.PI
    },
    mul: 0.5
    },
    addToEnvironment: false
});
