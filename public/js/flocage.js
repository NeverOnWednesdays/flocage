// Define an Infusion component that represents your instrument.
fluid.defaults("flocage.sinewaver", {
    gradeNames: ["flock.synth"],

    // Define the synthDef for your instrument.
    synthDef: {
        id: "carrier",
        ugen: "flock.ugen.filter.moog",
        cutoff: {
            ugen: "flock.ugen.sinOsc",
            freq: 80,
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
                freq: 1,
                loop: 1,
                values: [222, 221 * 5/7, 120, 223 * 3/9, 220 * 4/5, 227],
                options: {
                    interpolation: "linear"
                }
            }
        },
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

var geoSuccess = function(position) {
  window.BoutonFlocage.setPosition(position);
  window.BoutonFlocage.modulerFrequence(position);
  console.log(position.coords.latitude);
  var latitude_element = document.getElementById('latitude');
  latitude_element.innerHTML = position.coords.latitude.toString();
  console.log(position.coords.longitude);
  var longitude_element = document.getElementById('longitude');
  longitude_element.innerHTML = position.coords.longitude.toString();
};
var geoError = function(error) {
  switch(error.code) {
    case error.TIMEOUT:
      break;
  }
};

class BoutonFlocage {

    constructor() {
        this.status = "nouveau";
        this.sinewaver = null;
        this.teinte = false;
        this.position = null;
    }

    basculer() {
        switch (this.status) {
            case "nouveau":
                //document.body.webkitRequestFullscreen();
                this.sinewaver = flocage.sinewaver();
                this.sinewaver.play();
                this.status = "joue";
                navigator.geolocation.watchPosition(geoSuccess, geoError);
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

    setPosition(position) {
      this.position = position;
    }

    modulerFrequence(position) {
      var source_freq_values = this.sinewaver.get('carrier.source.freq.values');
      this.sinewaver.set("carrier.source.freq.values", source_freq_values);
    }

    /*
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
 */
};

window.addEventListener("DOMContentLoaded", (event) => {
	window.BoutonFlocage = new BoutonFlocage();
});

