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
/*
1. [Mode Début] Phases par défaut

2. [Mode Début] Quand la position est disponible:
  2.1 On garde la position initiale en mémoire
  2.2 Fréquence de base = int(latitude) * 10 + longitude
  2.3 On passe au mode modulations

3. [Mode Modulations] Quand une nouvelle position est disponible:
  3.1 On vérifie si c’est la première position en mode modulations
    3.1.1 Si oui, on fait la différence entre la position initiale
    3.1.2 Si non, on fait la différence entre la dernière position et la nouvelle

4. On additionne les deux différences (latitude et longitude)

5. On fait un ratio entre le résultat et une constante

6. On multiplie le résultat avec la phase initiale

7. On avance le compteur de phase

*/
var geoSuccess = function(position) {

  console.log(position.coords.latitude);
  var latitude_element = document.getElementById('latitude');
  latitude_element.innerHTML = position.coords.latitude.toString();
  console.log(position.coords.longitude);
  var longitude_element = document.getElementById('longitude');
  longitude_element.innerHTML = position.coords.longitude.toString();

  switch(window.BoutonFlocage.getMode()) {
    case modes.DEBUT:
      window.BoutonFlocage.setPositionInitiale(position);
      frequence_base = int(Math.abs(position.coords.latitude)) * 10 + Math.abs(position.coord.longitude);
      window.BoutonFlocage.modulerFrequence(frequence_base);
      window.BoutonFlocage.setMode(modes.PREMIERE_MODULATION);
      break;
    case modes.PREMIERE_MODULATION:
      
      break;
  }

};
var geoError = function(error) {
  switch(error.code) {
    case error.TIMEOUT:
      break;
  }
};

const modes = {
    DEBUT: 'debut',
    PREMIERE_MODULATION: 'premier_modulation',
    MODULATIONS: 'modulations',
    ARRET: 'arret'
}

class BoutonFlocage {

    constructor() {
        this.status = "nouveau";
        this.sinewaver = null;
        this.teinte = false;
        this.position_initiale = null;
        this.positions = [];
        this.mode = modes.DEBUT;
        this.compteurModulation = 0;
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

    setPositionInitiale(position) {
      this.position_initiale = position;
    }
    getPositionInitiale() {
      return this.position_initiale;
    }

    setMode(mode) {
      this.mode = mode;
    }

    modulerFrequence(nouvelle_frequence) {
      var source_freq_values = this.sinewaver.get('carrier.source.freq.values');
      source_freq_values[this.compteurModulations] = nouvelle_frequence;
      this.sinewaver.set("carrier.source.freq.values", source_freq_values);
      this.compteurModulations = this.compteurModulations++ % source_freq_values.length;
    }

};

window.addEventListener("DOMContentLoaded", (event) => {
	window.BoutonFlocage = new BoutonFlocage();
});

