var mod = 270;



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

  var latitude_element = document.getElementById('latitude');
  latitude_element.innerHTML = position.coords.latitude.toString();
  var longitude_element = document.getElementById('longitude');
  longitude_element.innerHTML = position.coords.longitude.toString();

  switch(window.BoutonFlocage.getMode()) {
    case modes.DEBUT:
      window.BoutonFlocage.setPositionInitiale(position);
      frequence_base = Math.floor(Math.abs(position.coords.latitude)) * 10 + Math.abs(position.coords.longitude);
      window.BoutonFlocage.modulerFrequence(frequence_base);
      window.BoutonFlocage.setMode(modes.PREMIERE_MODULATION);
      break;
    case modes.PREMIERE_MODULATION:
      window.BoutonFlocage.ajouterPosition(position);
      var position_initiale = window.BoutonFlocage.getPositionInitiale();
      var diff_longitude = Math.abs(position.coords.longitude - position_initiale.coords.longitude);
      var diff_latitude = Math.abs(position.coords.latitude - position_initiale.coords.latitude);
      var diff = diff_longitude + diff_latitude;
      var abs_sum = Math.abs(position.coords.longitude + position_initiale.coords.latitude)/50;
      window.BoutonFlocage.modulerFrequenceSequenceur(abs_sum);
      var ratio = diff / 0.0001;
      var ratio_element = document.getElementById('ratio');
      longitude_element.innerHTML = ratio.toString();
      window.BoutonFlocage.multiplierFrequence(ratio);
      window.BoutonFlocage.setMode(modes.MODULATIONS);
      break;
    case modes.MODULATIONS:
      var derniere_position = window.BoutonFlocage.getDernierePosition();
      var diff_longitude = Math.abs(position.coords.longitude - derniere_position.coords.longitude);
      var diff_latitude = Math.abs(position.coords.latitude - derniere_position.coords.latitude);
      var diff = diff_longitude + diff_latitude;
      var ratio = diff / 0.0001;
      var ratio_element = document.getElementById('ratio');
      ratio_element.innerHTML = ratio.toString();
      window.BoutonFlocage.multiplierFrequence(ratio);
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
        this.synths = [];
        this.teinte = false;
        this.position_initiale = null;
        this.positions = [];
        this.mode = modes.DEBUT;
        this.compteurModulations = 0;
        this.enviro = null;
        this.barfcore = null;    }

    ajouterPosition(position) {
      this.positions.push(position);
    }

    getDernierePosition() {
      return this.positions[this.positions.length - 1];
    }

    basculer() {
        switch (this.status) {
            case "nouveau":
              console.log("nouveau");
                //document.body.webkitRequestFullscreen();
              this.barfcore = flock.synth({
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
              this.drone = flock.synth({
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

                this.synths = [this.barfcore, this.drone];
                this.status = "joue";
                navigator.geolocation.watchPosition(geoSuccess, geoError);
                this.enviro = flock.init();
                this.enviro.start();
                var i;
                for (i = 0; i < this.synths.length; i++) {
                  this.synths[i].play();
                }
                break;
            case "joue":
                var i;
                for (i = 0; i < this.synths.length; i++) {
                  this.synths[i].pause();
                }
                this.status = "pause";
                break;
            case "pause":
                var i;
                for (i = 0; i < this.synths.length; i++) {
                  this.synths[i].play();
                }
                this.status = "joue";
                break;
        }
    }

    getMode() {
      return this.mode;
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
      var source_freq_values = this.synths[0].get('carrier.source.freq.values');
      source_freq_values[this.compteurModulations++ % source_freq_values.length] = nouvelle_frequence;
      this.synths[0].set("carrier.source.freq.values", source_freq_values);
    }

    modulerFrequenceSequenceur(nouvelle_frequence) {
      this.synths[0].set("carrier.source.freq.freq", nouvelle_frequence);
    }

    multiplierFrequence(multiplicateur) {
      if (multiplicateur < 0.5) {
        multiplicateur = 0.5;
      }
      else if (multiplicateur > 2.0) {
        multiplicateur = 2.0;
      }
      var source_freq_values = this.synths[0].get('carrier.source.freq.values');
      var frequence_actuelle = source_freq_values[this.compteurModulations];
      frequence_actuelle = frequence_actuelle * multiplicateur;
      source_freq_values[this.compteurModulations++ % source_freq_values.length] = frequence_actuelle;
      this.synths[0].set("carrier.source.freq.values", source_freq_values);

    }

};

window.addEventListener("DOMContentLoaded", (event) => {
	window.BoutonFlocage = new BoutonFlocage();
});

