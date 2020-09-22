// Define an Infusion component that represents your instrument.
fluid.defaults("flocage.sinewaver", {
    gradeNames: ["flock.synth"],

    // Define the synthDef for your instrument.
    synthDef: {
        id: "carrier",
        ugen: "flock.ugen.audioIn",
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
        this.teinte = false;
    }

    basculer() {
        switch (this.status) {
            case "nouveau":
		        document.body.webkitRequestFullscreen();
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

    moduler(event) {
        // Desktop version
	    if (event.clientX) {
            // normalize position to max brightness 
            var normalized_touch = event.clientX / screen.width;
            if (this.teinte) {
                fetch("http://127.0.0.1:5000/bri?luminosite=" + Math.floor(normalized_touch*255).toString());
            }
            this.sinewaver.set("carrier.freq", normalized_touch*800);
        }
        // Mobile version
	    else if (event.touches) {
            var normalized_touch = event.touches[0].clientX / screen.width;
		    console.log(normalized_touch);
            if (this.teinte) {
                fetch("http://127.0.0.1:5000/bri?luminosite=" + Math.floor(normalized_touch*255).toString());
            }
            this.sinewaver.set("carrier.freq", Math.floor(normalized_touch*800));
	    }
    }

};

window.addEventListener("DOMContentLoaded", (event) => {
	window.BoutonFlocage = new BoutonFlocage();
});
