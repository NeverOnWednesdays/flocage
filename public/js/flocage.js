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
              var canvas = document.getElementById('canvas');

                this.synths = [drone];
                this.status = "joue";
                this.enviro = flock.init();
                this.enviro.start();
                for (let i = 0; i < this.synths.length; i++) {
                  this.synths[i].play();
                }
                break;
            case "joue":
                for (let i = 0; i < this.synths.length; i++) {
                  this.synths[i].pause();
                }
                this.status = "pause";
                break;
            case "pause":
                for (let i = 0; i < this.synths.length; i++) {
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
      console.log(source_freq_values);
      source_freq_values[this.compteurModulations++ % source_freq_values.length] = nouvelle_frequence;
      this.synths[0].set("carrier.source.freq.values", source_freq_values);
    }

    modulerFrequenceSequenceur(nouvelle_frequence) {
      this.synths[0].set("carrier.source.freq.freq", nouvelle_frequence);
    }
    
    moduler_y(event) {

      let y = event.clientY || event.touches[0].clientY;
      let position_initiale, diff, ratio, ratio_element, frequence_base, derniere_position;

  switch(window.BoutonFlocage.getMode()) {
    case modes.DEBUT:
      window.BoutonFlocage.setPositionInitiale(y);
      frequence_base = Math.floor(Math.abs(y)) * 10;
      window.BoutonFlocage.modulerFrequence(y);
      window.BoutonFlocage.setMode(modes.PREMIERE_MODULATION);
      break;
    case modes.PREMIERE_MODULATION:
      window.BoutonFlocage.ajouterPosition(y);
      position_initiale = window.BoutonFlocage.getPositionInitiale();
      diff = Math.abs(y - position_initiale);
      ratio = diff / 0.0001;
      ratio_element = document.getElementById('ratio');
      ratio_element.innerHTML = ratio.toString();
      window.BoutonFlocage.multiplierFrequence(ratio);
      window.BoutonFlocage.setMode(modes.MODULATIONS);
      break;
    case modes.MODULATIONS:
      derniere_position = window.BoutonFlocage.getDernierePosition();
      diff = Math.abs(y - derniere_position);
      ratio = diff / 0.0001;
      ratio_element = document.getElementById('ratio');
      ratio_element.innerHTML = ratio.toString();
      window.BoutonFlocage.multiplierFrequence(ratio);
      break;
  }

}

    multiplierFrequence(multiplicateur) {
      if (multiplicateur < 0.5) {
        multiplicateur = 0.5;
      }
      else if (multiplicateur > 2.0) {
        multiplicateur = 2.0;
      }
      var source_freq_values = this.synths[0].get('carrier.source.freq.values');
      console.log(source_freq_values);
      var frequence_actuelle = source_freq_values[this.compteurModulations];
      frequence_actuelle = frequence_actuelle * multiplicateur;
      source_freq_values[this.compteurModulations++ % source_freq_values.length] = frequence_actuelle;
      this.synths[0].set("carrier.source.freq.values", source_freq_values);

    }

};

window.addEventListener("DOMContentLoaded", (event) => {
	window.BoutonFlocage = new BoutonFlocage();
});

