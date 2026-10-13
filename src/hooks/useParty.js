import { useState, useEffect, useCallback } from 'react';
import { getSavedParty, saveParty } from '../storage/storageAdapter';
import { generateId } from '../domain/combatRules';

export function useParty() {
  const [party, setParty] = useState(() => getSavedParty());

  useEffect(() => {
    saveParty(party);
  }, [party]);

  const addMember = useCallback((memberData) => {
    const newMember = {
      id: generateId(),
      name: memberData.name.trim() || 'Aventureiro',
      playerName: memberData.playerName?.trim() || '',
      race: memberData.race?.trim() || '',
      type: 'player',
      initiative: Number(memberData.initiative) || 10,
      dexModifier: Number(memberData.dexModifier) || 0,
      hp: {
        current: Number(memberData.hpMax) || 25,
        max: Number(memberData.hpMax) || 25,
        temp: 0,
      },
      ac: Number(memberData.ac) || 14,
      notes: memberData.notes?.trim() || '',
      conditions: [],
      isDefeated: false,
    };

    setParty((prev) => [...prev, newMember]);
  }, []);

  const updateMember = useCallback((id, updates) => {
    setParty((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const removeMember = useCallback((id) => {
    setParty((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    party,
    addMember,
    updateMember,
    removeMember,
  };
}
