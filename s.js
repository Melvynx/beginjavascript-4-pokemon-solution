import { prompt } from './prompt.js';

class Pokemon {
  constructor(name, emoji, health, attacks) {
    this.name = name;
    this.emoji = emoji;
    this.health = health;
    this.maximalHealth = health;
    this.attacks = attacks;
  }

  randomAttack() {
    return this.attacks[Math.floor(Math.random() * this.attacks.length)];
  }

  logPokemon() {
    console.log(
      `Pokemon : ${this.name} ${this.emoji}

❤️ Health : ${this.health}
💥 Attacks :`
    );
    this.attacks.forEach((attack, i) => {
      attack.logAttack();
    });
  }

  logAttacks() {
    this.attacks.forEach((attack, i) => {
      attack.logAttack();
    });
  }

  getHealth() {
    let health = '';
    let copyHealth = this.health;

    for (let i = 0; i < 10; i++) {
      health += copyHealth > 0 ? '🟩' : '🟥';
      copyHealth -= this.maximalHealth / 10;
    }

    return health;
  }
}

class Attack {
  constructor(name, power, stability) {
    this.name = name;
    this.power = power;
    this.stability = stability;
  }

  performAttack() {
    const stabilityPowerRemove =
      Math.floor(Math.random() * this.power) * (1 - this.stability);
    return this.power - stabilityPowerRemove;
  }

  logAttack() {
    console.log(
      `${this.name} - Power ⚡️ : ${this.power} - Stability 💥 : ${this.stability}`
    );
  }
}

const pikachu = new Pokemon('Pikachu', '⚡️', 1, [
  new Attack('Thunderbolt', 30, 0.2),
  new Attack('Electro Ball', 20, 0.4),
  new Attack('Quick Attack', 10, 0.8),
]);

const bulbasaur = new Pokemon('Bulbasaur', '🍃', 110, [
  new Attack('Vine Whip', 25, 0.3),
  new Attack('Seed Bomb', 20, 0.5),
  new Attack('Tackle', 10, 0.8),
]);

const charmander = new Pokemon('Charmander', '🔥', 90, [
  new Attack('Flamethrower', 35, 0.2),
  new Attack('Ember', 25, 0.3),
  new Attack('Scratch', 15, 0.75),
]);

class Game {
  static pokemons = [pikachu, bulbasaur, charmander];

  static async wait5Secondes() {
    await new Promise((resolve) => {
      let i = 0;

      const interval = setInterval(() => {
        i++;
        if (i === 5) {
          clearInterval(interval);
          resolve('');
        }
        console.log(`... ${i}`);
      }, 1000);
    });
  }

  constructor() {
    this.playerPokemon = this.choosePokemon();
    this.opponentPokemon = Game.pokemons.filter((p) => p !== this.playerPokemon)[
      Math.floor(Math.random() * 2)
    ];
  }

  start() {
    this.battle();
  }

  async battle() {
    this.logBattle();
    if (this.playerPokemon.health <= 0 || this.opponentPokemon.health <= 0) {
      this.finish();
      return;
    }

    this.playerPokemon.logAttacks();
    const attackChoice = Number(prompt('Choose your attack: '));

    if (attackChoice > 3 || attackChoice < 1 || Number.isNaN(attackChoice)) {
      console.log('Please choose a number between 1 and 3');
      return this.battle();
    }

    const playerAttack = this.playerPokemon.attacks[attackChoice - 1];
    const playerAttackDamage = playerAttack.performAttack();
    const opponentAttack = this.opponentPokemon.randomAttack();
    const opponentAttackDamage = opponentAttack.performAttack();

    console.log(
      `💥 Play Attack use ${playerAttack.name} and made ${playerAttackDamage} dommage and opponentAttack use ${opponentAttack.name} made ${opponentAttackDamage} dommage.`
    );

    this.opponentPokemon.health -= playerAttackDamage;
    this.playerPokemon.health -= opponentAttackDamage;

    await Game.wait5Secondes();

    this.battle();
  }

  finish() {
    if (this.playerPokemon.health <= 0) {
      console.log(
        `${this.playerPokemon.name} is out of health. ${this.opponentPokemon.name} wins the battle!`
      );
    } else {
      console.log(
        `${this.opponentPokemon.name} is out of health. ${this.playerPokemon.name} wins the battle!`
      );
    }
  }

  choosePokemon() {
    const userChoice = Number(
      prompt(
        'Choose your Pokemon: \n1. Pikachu ⚡️ \n2. Bulbasaur 🍃 \n3. Charmander 🔥\n'
      )
    );

    if (userChoice > 3 || userChoice < 1 || Number.isNaN(userChoice)) {
      console.log('Please choose a number between 1 and 3');
      return this.choosePokemon();
    }

    return Game.pokemons[userChoice - 1];
  }

  logBattle() {
    console.log(`---
Battle: 

${this.playerPokemon.getHealth()}
${this.playerPokemon.name} ${this.playerPokemon.emoji}

⚡️ VS ⚡️

${this.opponentPokemon.getHealth()}
${this.opponentPokemon.name} ${this.opponentPokemon.emoji}`);
    console.log('\n\n');
  }
}

const game = new Game();

game.start();
