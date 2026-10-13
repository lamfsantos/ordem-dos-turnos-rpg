/**
 * Camada de persistência em LocalStorage
 */

const STORAGE_KEYS = {
  PARTY: 'ordem_rpg_party_v1',
  ENCOUNTER: 'ordem_rpg_encounter_v1',
  PRESETS: 'ordem_rpg_presets_v1',
  SETTINGS: 'ordem_rpg_settings_v1',
};

const DEFAULT_PARTY = [
  {
    id: 'p_1',
    name: 'Thorin Escudo-de-Carvalho',
    playerName: 'Lucas',
    race: 'Anão da Colina',
    type: 'player',
    initiative: 14,
    dexModifier: 0,
    hp: { current: 38, max: 38, temp: 0 },
    ac: 18,
    notes: 'Guerreiro Nível 4. Proteção.',
    conditions: [],
    isDefeated: false,
  },
  {
    id: 'p_2',
    name: 'Elira Pés-Leves',
    playerName: 'Marina',
    race: 'Elfa da Floresta',
    type: 'player',
    initiative: 21,
    dexModifier: 4,
    hp: { current: 27, max: 27, temp: 0 },
    ac: 15,
    notes: 'Ladina Nível 4. Especialista em furtividade.',
    conditions: [],
    isDefeated: false,
  },
  {
    id: 'p_3',
    name: 'Ignis Solaris',
    playerName: 'Rafael',
    race: 'Humano',
    type: 'player',
    initiative: 16,
    dexModifier: 1,
    hp: { current: 22, max: 22, temp: 0 },
    ac: 12,
    notes: 'Mago Evocador Nível 4.',
    conditions: [],
    isDefeated: false,
  },
];

export function getSavedParty() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTY);
    if (!raw) return DEFAULT_PARTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PARTY;
  } catch (err) {
    console.error('Erro ao ler party do localStorage:', err);
    return DEFAULT_PARTY;
  }
}

export function saveParty(party) {
  try {
    localStorage.setItem(STORAGE_KEYS.PARTY, JSON.stringify(party));
  } catch (err) {
    console.error('Erro ao salvar party no localStorage:', err);
  }
}

export function getActiveEncounter() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENCOUNTER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler encontro ativo:', err);
    return null;
  }
}

export function saveActiveEncounter(encounter) {
  try {
    localStorage.setItem(STORAGE_KEYS.ENCOUNTER, JSON.stringify(encounter));
  } catch (err) {
    console.error('Erro ao salvar encontro:', err);
  }
}

export function exportAllData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    party: getSavedParty(),
    encounter: getActiveEncounter(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ordem-turnos-rpg-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.party && Array.isArray(data.party)) {
      saveParty(data.party);
    }
    if (data.encounter) {
      saveActiveEncounter(data.encounter);
    }
    return { success: true, data };
  } catch (err) {
    console.error('Falha ao importar JSON:', err);
    return { success: false, error: err.message };
  }
}
