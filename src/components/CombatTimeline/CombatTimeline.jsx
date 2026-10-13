import React from 'react';
import { Skull, User, Sparkles } from 'lucide-react';

export function CombatTimeline({ combatants, turnIndex, onSelectCombatant }) {
  if (!combatants || combatants.length === 0) return null;

  return (
    <div className="timeline-bar">
      <span className="timeline-label">
        <Sparkles size={14} color="#f59e0b" />
        Turnos:
      </span>
      {combatants.map((c, idx) => {
        const isActive = idx === turnIndex;
        const isNext = (turnIndex + 1) % combatants.length === idx;

        return (
          <button
            key={c.id}
            className={`timeline-pill ${isActive ? 'is-active' : ''} ${c.isDefeated ? 'is-defeated' : ''}`}
            onClick={() => onSelectCombatant && onSelectCombatant(c.id)}
            title={`Iniciativa: ${c.initiative} | ${c.type === 'player' ? 'Jogador' : 'Monstro'} ${isNext ? '(Próximo da fila)' : ''}`}
          >
            {c.isDefeated ? (
              <Skull size={13} color="#ef4444" />
            ) : c.type === 'player' ? (
              <User size={13} color="#10b981" />
            ) : (
              <span style={{ fontSize: '0.7rem' }}>⚔️</span>
            )}
            <span>{c.name}</span>
            <span className="timeline-pill-ini">{c.initiative}</span>
            {isNext && <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>›</span>}
          </button>
        );
      })}
    </div>
  );
}
