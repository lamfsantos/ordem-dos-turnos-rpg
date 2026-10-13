import { useState, useEffect, useCallback } from 'react';
import {
  sortCombatants,
  createCombatant,
  duplicateMonsters,
  applyHpChange,
  rollD20,
} from '../domain/combatRules';
import {
  getActiveEncounter,
  saveActiveEncounter,
  getSavedParty,
} from '../storage/storageAdapter';

export function useEncounter() {
  const [combatants, setCombatants] = useState(() => {
    const saved = getActiveEncounter();
    if (saved && Array.isArray(saved.combatants)) {
      return saved.combatants;
    }
    // Carrega o grupo padrão salvo na primeira inicialização
    const party = getSavedParty();
    return party.map((p) => createCombatant(p));
  });

  const [round, setRound] = useState(() => {
    const saved = getActiveEncounter();
    return saved?.round || 1;
  });

  const [turnIndex, setTurnIndex] = useState(() => {
    const saved = getActiveEncounter();
    return saved?.turnIndex || 0;
  });

  const [isCombatActive, setIsCombatActive] = useState(() => {
    const saved = getActiveEncounter();
    return saved?.isCombatActive || false;
  });

  const [historyLog, setHistoryLog] = useState(() => {
    const saved = getActiveEncounter();
    return saved?.historyLog || [
      { id: 'h_init', time: new Date().toLocaleTimeString(), text: 'Rastreador de combate iniciado.', type: 'info' }
    ];
  });

  const addLog = useCallback((text, type = 'info') => {
    setHistoryLog((prev) => [
      {
        id: 'h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        type,
      },
      ...prev.slice(0, 49), // Mantém até 50 eventos
    ]);
  }, []);

  // Persiste sempre que o estado muda
  useEffect(() => {
    saveActiveEncounter({
      combatants,
      round,
      turnIndex,
      isCombatActive,
      historyLog,
    });
  }, [combatants, round, turnIndex, isCombatActive, historyLog]);

  const activeCombatant = combatants[turnIndex] || null;

  // Iniciar Combate
  const startCombat = useCallback(() => {
    if (combatants.length === 0) return;
    const sorted = sortCombatants(combatants);
    setCombatants(sorted);
    setRound(1);
    setTurnIndex(0);
    setIsCombatActive(true);
    addLog(`Combate iniciado! Rodada 1 começou com ${sorted[0]?.name}.`, 'round');
  }, [combatants, addLog]);

  // Avançar Turno
  const nextTurn = useCallback(() => {
    if (combatants.length === 0) return;

    if (!isCombatActive) {
      startCombat();
      return;
    }

    setTurnIndex((currIndex) => {
      const nextIndex = currIndex + 1;
      if (nextIndex >= combatants.length) {
        // Nova Rodada
        setRound((currRound) => {
          const nextRound = currRound + 1;
          addLog(`Início da Rodada ${nextRound}!`, 'round');
          return nextRound;
        });
        const first = combatants[0];
        addLog(`Turno de ${first?.name}.`, 'turn');
        return 0;
      } else {
        const current = combatants[nextIndex];
        addLog(`Turno de ${current?.name}.`, 'turn');
        return nextIndex;
      }
    });
  }, [combatants, isCombatActive, startCombat, addLog]);

  // Voltar Turno
  const prevTurn = useCallback(() => {
    if (combatants.length === 0 || !isCombatActive) return;

    setTurnIndex((currIndex) => {
      if (currIndex <= 0) {
        if (round > 1) {
          setRound((r) => r - 1);
          return combatants.length - 1;
        }
        return 0;
      }
      return currIndex - 1;
    });
  }, [combatants.length, isCombatActive, round]);

  // Adicionar Combatente Individual
  const addCombatant = useCallback((data) => {
    const newCombatant = createCombatant(data);
    setCombatants((prev) => {
      const updated = [...prev, newCombatant];
      return isCombatActive ? sortCombatants(updated) : updated;
    });
    addLog(`${newCombatant.name} entrou no combate. (Iniciativa: ${newCombatant.initiative})`, 'add');
  }, [isCombatActive, addLog]);

  // Adicionar Múltiplos Monstros
  const addMultipleMonsters = useCallback((baseMonster, quantity, rollNow = true) => {
    const list = duplicateMonsters(baseMonster, quantity, rollNow);
    setCombatants((prev) => {
      const updated = [...prev, ...list];
      return isCombatActive ? sortCombatants(updated) : updated;
    });
    addLog(`Adicionados ${list.length}x ${baseMonster.name} ao combate.`, 'add');
  }, [isCombatActive, addLog]);

  // Carregar Jogadores da Party Salva
  const loadPartyIntoCombat = useCallback((party) => {
    setCombatants((prev) => {
      // Evita duplicatas se o personagem já estiver na lista pelo nome
      const existingNames = new Set(prev.map((c) => c.name.toLowerCase()));
      const toAdd = party
        .filter((p) => !existingNames.has(p.name.toLowerCase()))
        .map((p) => createCombatant({ ...p, type: 'player' }));

      if (toAdd.length === 0) return prev;
      const updated = [...prev, ...toAdd];
      return isCombatActive ? sortCombatants(updated) : updated;
    });
    addLog(`Grupo de aventureiros carregado no combate.`, 'info');
  }, [isCombatActive, addLog]);

  // Modificar HP (dano / cura)
  const changeHp = useCallback((id, delta) => {
    setCombatants((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = applyHpChange(c, delta);
        const action = delta < 0 ? `sofreu ${Math.abs(delta)} de dano` : `recuperou ${delta} PV`;
        addLog(`${c.name} ${action}. (${updated.hp.current}/${updated.hp.max} PV)`, delta < 0 ? 'damage' : 'heal');
        return updated;
      })
    );
  }, [addLog]);

  // Atualizar Atributos (Nome, Iniciativa, CA, etc.)
  const updateCombatant = useCallback((id, updates) => {
    setCombatants((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      if ('initiative' in updates || 'dexModifier' in updates) {
        return sortCombatants(updated);
      }
      return updated;
    });
  }, []);

  // Alternar Condição / Efeito
  const toggleCondition = useCallback((id, conditionId) => {
    setCombatants((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const exists = c.conditions.includes(conditionId);
        const newConditions = exists
          ? c.conditions.filter((item) => item !== conditionId)
          : [...c.conditions, conditionId];
        return { ...c, conditions: newConditions };
      })
    );
  }, []);

  // Remover Combatente
  const removeCombatant = useCallback((id) => {
    setCombatants((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target) {
        addLog(`${target.name} foi removido do combate.`, 'remove');
      }
      const updated = prev.filter((c) => c.id !== id);
      return updated;
    });
    setTurnIndex((idx) => (idx > 0 ? idx - 1 : 0));
  }, [addLog]);

  // Rolar Iniciativa Automática para Monstros
  const rollMonstersInitiative = useCallback(() => {
    setCombatants((prev) => {
      const updated = prev.map((c) => {
        if (c.type === 'monster') {
          const roll = rollD20(c.dexModifier);
          return { ...c, initiative: roll.total };
        }
        return c;
      });
      return isCombatActive ? sortCombatants(updated) : updated;
    });
    addLog(`Iniciativas dos monstros roladas automaticamente.`, 'dice');
  }, [isCombatActive, addLog]);

  // Rolar Iniciativa para Todos
  const rollAllInitiative = useCallback(() => {
    setCombatants((prev) => {
      const updated = prev.map((c) => {
        const roll = rollD20(c.dexModifier);
        return { ...c, initiative: roll.total };
      });
      return isCombatActive ? sortCombatants(updated) : updated;
    });
    addLog(`Todas as iniciativas foram roladas novamente.`, 'dice');
  }, [isCombatActive, addLog]);

  // Resetar / Limpar
  const resetEncounter = useCallback(() => {
    setIsCombatActive(false);
    setRound(1);
    setTurnIndex(0);
    addLog(`Ordem de combate resetada.`, 'info');
  }, [addLog]);

  const clearMonsters = useCallback(() => {
    setCombatants((prev) => prev.filter((c) => c.type === 'player'));
    setTurnIndex(0);
    setRound(1);
    setIsCombatActive(false);
    addLog(`Monstros removidos. Apenas os jogadores permaneceram.`, 'info');
  }, [addLog]);

  const clearAll = useCallback(() => {
    setCombatants([]);
    setTurnIndex(0);
    setRound(1);
    setIsCombatActive(false);
    addLog(`Todos os combatentes foram limpos.`, 'info');
  }, [addLog]);

  return {
    combatants,
    activeCombatant,
    turnIndex,
    round,
    isCombatActive,
    historyLog,
    startCombat,
    nextTurn,
    prevTurn,
    addCombatant,
    addMultipleMonsters,
    loadPartyIntoCombat,
    changeHp,
    updateCombatant,
    toggleCondition,
    removeCombatant,
    rollMonstersInitiative,
    rollAllInitiative,
    resetEncounter,
    clearMonsters,
    clearAll,
  };
}
