// Define an Infusion component that represents your instrument.
fluid.defaults("myStuff.sinewaver", {
    gradeNames: ["flock.synth"],

    // Define the synthDef for your instrument.
    synthDef: {
        id: "carrier",
        ugen: "flock.ugen.sin",
        freq: 220,
        mul: 0.5
    }
});


// Define an Infusion component that represents your composition.
fluid.defaults("myStuff.composition", {
    gradeNames: ["fluid.component"],

    // This composition has two components:
    //  1. our sinewaver instrument (defined above)
    //  2. an instance of the Flocking environment
    components: {
        environment: {
            type: "flock.enviro"
        },

        instrument: {
            type: "myStuff.sinewaver"
        }
    },

    // This section registers listeners for our composition's "onCreate" event,
    // which is one of the built-in lifecycle events for Infusion.
    // When onCreate fires, we start the Flocking environment.
    listeners: {
        "onCreate.startEnvironment": {
            func: "{environment}.start"
        }
    }
});
