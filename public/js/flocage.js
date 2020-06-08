// Define an Infusion component that represents your instrument.
fluid.defaults("flocage.sinewaver", {
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
fluid.defaults("flocage.composition", {
    gradeNames: ["fluid.component"],

    // This composition has two components:
    //  1. our sinewaver instrument (defined above)
    //  2. an instance of the Flocking environment
    components: {
        environment: {
            type: "flock.enviro"
        },

        instrument: {
            type: "flocage.sinewaver"
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

class BoutonFlocage {

    constructor() {
        this.status = "nouveau";
        this.sinewaver = null;
    }

    basculer() {
        switch (this.status) {
            case "nouveau":
                this.sinewaver = flocage.sinewaver();
                this.sinewaver.play();
                this.status = "joue";
                break;
            case "joue":
                this.sinewaver.pause();
                this.status = "pause";
                break;
            case "pause":
                this.sinewaver.play();
                this.status = "joue";
                break;
        }
    }

};

window.BoutonFlocage = new BoutonFlocage();