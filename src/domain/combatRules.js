/**
 * Regras puras de combate e iniciativa de RPG
 */

export function generateId() {
  return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

export function rollD20(modifier = 0) {
  const roll = Math.floor(Math.random() * 20) + 1;
  const modNum = Number(modifier) || 0;
  return {
    roll,
    modifier: modNum,
    total: roll + modNum,
    isCrit: roll === 20,
    isFumble: roll === 1,
  };
}

/**
 * Ordena combatentes por iniciativa decrescente.
 * Desempate:
 * 1. Maior modificador de Destreza.
 * 2. Jogadores têm prioridade sobre Monstros.
 * 3. Ordem estável.
 */
export function sortCombatants(combatants) {
  return [...combatants].sort((a, b) => {
    const iniA = Number(a.initiative) || 0;
    const iniB = Number(b.initiative) || 0;
    if (iniB !== iniA) {
      return iniB - iniA;
    }

    const dexA = Number(a.dexModifier) || 0;
    const dexB = Number(b.dexModifier) || 0;
    if (dexB !== dexA) {
      return dexB - dexA;
    }

    // Jogadores antes de monstros em empate
    if (a.type === 'player' && b.type !== 'player') return -1;
    if (b.type === 'player' && a.type !== 'player') return 1;

    return (a.name || '').localeCompare(b.name || '');
  });
}

export function createCombatant({
  id = generateId(),
  name = 'Combatente',
  type = 'monster', // 'player' | 'monster' | 'npc'
  playerName = '',
  race = '',
  initiative = 10,
  dexModifier = 0,
  hpCurrent = 10,
  hpMax = 10,
  tempHp = 0,
  ac = 10,
  notes = '',
  conditions = [],
  isDefeated = false,
  hidden = false,
} = {}) {
  const parsedMax = Math.max(1, Number(hpMax) || 10);
  const parsedCur = Number(hpCurrent) !== undefined ? Number(hpCurrent) : parsedMax;

  return {
    id,
    name: name.trim() || 'Sem Nome',
    type,
    playerName: playerName.trim(),
    race: race.trim(),
    initiative: Number(initiative) || 0,
    dexModifier: Number(dexModifier) || 0,
    hp: {
      current: parsedCur,
      max: parsedMax,
      temp: Number(tempHp) || 0,
    },
    ac: Number(ac) || 10,
    notes: notes.trim(),
    conditions: Array.isArray(conditions) ? conditions : [],
    isDefeated: Boolean(isDefeated),
    hidden: Boolean(hidden),
  };
}

export function duplicateMonsters(baseMonster, quantity = 1, rollInitiativeNow = false) {
  const qty = Math.max(1, Math.min(20, Number(quantity) || 1));
  const created = [];

  for (let i = 1; i <= qty; i++) {
    const name = qty === 1 ? baseMonster.name : `${baseMonster.name} #${i}`;
    let initiative = baseMonster.initiative;

    if (rollInitiativeNow) {
      initiative = rollD20(baseMonster.dexModifier).total;
    }

    created.push(
      createCombatant({
        ...baseMonster,
        id: generateId(),
        name,
        initiative,
      })
    );
  }

  return created;
}

export function applyHpChange(combatant, delta) {
  const numDelta = Number(delta) || 0;
  const current = combatant.hp.current;
  const max = combatant.hp.max;
  let temp = combatant.hp.temp || 0;

  let newCurrent = current;
  let newTemp = temp;

  if (numDelta < 0) {
    // Dano: absorve no Temp HP primeiro se houver
    let damage = Math.abs(numDelta);
    if (newTemp > 0) {
      if (newTemp >= damage) {
        newTemp -= damage;
        damage = 0;
      } else {
        damage -= newTemp;
        newTemp = 0;
      }
    }
    newCurrent = Math.max(0, newCurrent - damage);
  } else {
    // Cura: recupera HP atual até o máximo
    newCurrent = Math.min(max, newCurrent + numDelta);
  }

  const isDefeated = newCurrent <= 0 && combatant.type !== 'player';

  return {
    ...combatant,
    isDefeated: isDefeated || combatant.isDefeated,
    hp: {
      ...combatant.hp,
      current: newCurrent,
      temp: newTemp,
    },
  };
}
