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
        freq: 34,
        mul: {
            ugen: "flock.ugen.sinOsc",
            freq: 1,
            mul: Math.floor(flock.PI)
        },
        add: 3
      },
      mul: 500,
      add: 700
      },
      resonance: {
        ugen: "flock.ugen.sinOsc",
        freq: 1,
        mul: 1,
        add: 1
      },
      source: {
        ugen: "flock.ugen.lfSaw",
        freq: {
          ugen: "flock.ugen.sequence",
          freq: Math.floor(mod / 50),
          loop: 1,
          values: [Math.floor(mod + 13), Math.floor(221 * 5/7), Math.floor(mod), Math.floor((mod + 20) * 3/9), Math.floor(220 * 4/5), Math.floor(227), Math.floor(mod), Math.floor(mod * 3)],
          options: {
              interpolation: "linear"
          }
        }
      },
      mul: 1
    },
    addToEnvironment: false
  });
let drone = flock.synth({
  synthDef: {
    id: "carrier",
    ugen: "flock.ugen.sinOsc",
    freq: 500
    },
    addToEnvironment: false
});
