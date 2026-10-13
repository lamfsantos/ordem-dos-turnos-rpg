import React, { useState, useEffect, useCallback } from 'react';
import {
  Swords,
  Users,
  Plus,
  Trash2,
  Dices,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';
import { useEncounter } from './hooks/useEncounter';
import { useParty } from './hooks/useParty';
import { TopBar } from './components/TopBar/TopBar';
import { CombatTimeline } from './components/CombatTimeline/CombatTimeline';
import { CombatantCard } from './components/CombatantCard/CombatantCard';
import { AddCombatantModal } from './components/AddCombatantModal/AddCombatantModal';
import { ConditionSelector } from './components/ConditionSelector/ConditionSelector';
import { PartyDrawer } from './components/PartyDrawer/PartyDrawer';
import { HistoryLog } from './components/HistoryLog/HistoryLog';
import { ShortcutsHelp } from './components/ShortcutsHelp/ShortcutsHelp';

export function App() {
  const {
    combatants,
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
  } = useEncounter();

  const { party, addMember, removeMember } = useParty();

  // Modais e Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPartyDrawerOpen, setIsPartyDrawerOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [conditionTargetId, setConditionTargetId] = useState(null);

  // Combatente alvo para o seletor de condições
  const conditionTargetCombatant = combatants.find((c) => c.id === conditionTargetId);

  // Atalhos de teclado globais
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignora atalhos se o usuário estiver digitando em um campo de texto
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        nextTurn();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextTurn();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevTurn();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsAddModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setIsPartyDrawerOpen(false);
        setIsShortcutsOpen(false);
        setConditionTargetId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextTurn, prevTurn]);

  // Contadores rápidos para o resumo tático
  const playerCount = combatants.filter((c) => c.type === 'player').length;
  const monsterCount = combatants.filter((c) => c.type === 'monster').length;
  const activeMonsters = combatants.filter((c) => c.type === 'monster' && !c.isDefeated).length;

  const scrollToCombatant = (id) => {
    const el = document.getElementById(`combatant-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="app-container">
      {/* 1. Barra de Controle Superior */}
      <TopBar
        round={round}
        isCombatActive={isCombatActive}
        onStartCombat={startCombat}
        onNextTurn={nextTurn}
        onPrevTurn={prevTurn}
        onResetEncounter={resetEncounter}
        onRollMonsters={rollMonstersInitiative}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenPartyDrawer={() => setIsPartyDrawerOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onDataImported={() => window.location.reload()}
      />

      {/* 2. Fita / Linha do Tempo Horizontal de Turnos */}
      <CombatTimeline
        combatants={combatants}
        turnIndex={turnIndex}
        onSelectCombatant={scrollToCombatant}
      />

      {/* 3. Área Principal */}
      <main className="main-layout">
        {/* Coluna da Esquerda: Lista de Combatentes */}
        <section className="combat-roster">
          <div className="roster-header">
            <h2 className="roster-title">
              <Swords size={22} color="#f59e0b" />
              Combatentes
              <span className="roster-count-badge">{combatants.length}</span>
            </h2>

            <div className="roster-actions">
              {monsterCount > 0 && (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  onClick={clearMonsters}
                  title="Remover todos os monstros e manter os heróis"
                >
                  <Trash2 size={14} /> Limpar Monstros
                </button>
              )}
              {combatants.length > 0 && (
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                  onClick={clearAll}
                  title="Limpar todos os combatentes"
                >
                  Limpar Tudo
                </button>
              )}
            </div>
          </div>

          {/* Cards ou Estado Vazio */}
          {combatants.length === 0 ? (
            <div className="empty-state">
              <ShieldAlert size={48} className="empty-state-icon" />
              <h3 className="empty-state-title">Nenhum combatente no encontro</h3>
              <p className="empty-state-desc">
                Puxe o grupo de heróis salvo ou adicione monstros para iniciar a rolagem de iniciativa!
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  className="btn btn-success"
                  onClick={() => loadPartyIntoCombat(party)}
                >
                  <Users size={16} /> Carregar Grupo ({party.length} Heróis)
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={16} /> Adicionar Inimigos
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {combatants.map((combatant, idx) => (
                <CombatantCard
                  key={combatant.id}
                  combatant={combatant}
                  isActiveTurn={isCombatActive && idx === turnIndex}
                  onChangeHp={changeHp}
                  onUpdate={updateCombatant}
                  onToggleCondition={toggleCondition}
                  onRemove={removeCombatant}
                  onOpenConditionPicker={(id) => setConditionTargetId(id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Coluna da Direita: Painel Tático e Log de Histórico */}
        <aside className="sidebar-panel">
          {/* Card Resumo do Encontro */}
          <div className="panel-card">
            <h3 className="panel-title">
              <Flame size={16} color="#ef4444" />
              Situação da Batalha
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Heróis Vivos
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#10b981',
                  }}
                >
                  {playerCount}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Inimigos Vivos
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: activeMonsters > 0 ? '#ef4444' : '#64748b',
                  }}
                >
                  {activeMonsters} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {monsterCount}</span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas no Painel */}
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem' }}
                onClick={rollAllInitiative}
              >
                <Dices size={14} /> Rolar Iniciativa de Todos
              </button>
            </div>
          </div>

          {/* Histórico Recente de Ações */}
          <HistoryLog historyLog={historyLog} />
        </aside>
      </main>

      {/* Modais e Painéis Secundários */}
      <AddCombatantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSingle={addCombatant}
        onAddMultiple={addMultipleMonsters}
      />

      <ConditionSelector
        isOpen={Boolean(conditionTargetId)}
        targetCombatant={conditionTargetCombatant}
        onClose={() => setConditionTargetId(null)}
        onToggleCondition={toggleCondition}
      />

      <PartyDrawer
        isOpen={isPartyDrawerOpen}
        onClose={() => setIsPartyDrawerOpen(false)}
        party={party}
        onAddMember={addMember}
        onRemoveMember={removeMember}
        onLoadPartyIntoCombat={loadPartyIntoCombat}
      />

      <ShortcutsHelp
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}

export default App;
