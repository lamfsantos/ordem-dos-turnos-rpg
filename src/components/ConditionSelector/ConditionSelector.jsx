import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { STANDARD_CONDITIONS } from '../../types/conditions';

export function ConditionSelector({
  isOpen,
  onClose,
  targetCombatant,
  onToggleCondition,
}) {
  if (!isOpen || !targetCombatant) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} color="#a855f7" />
            <span>Condições: {targetCombatant.name}</span>
          </div>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '0.6rem',
            }}
          >
            {STANDARD_CONDITIONS.map((cond) => {
              const isSelected = targetCombatant.conditions.includes(cond.id);

              return (
                <div
                  key={cond.id}
                  onClick={() => onToggleCondition(targetCombatant.id, cond.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? cond.color : 'rgba(255,255,255,0.08)'}`,
                    backgroundColor: isSelected ? `${cond.color}25` : 'rgba(20,25,36,0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isSelected ? cond.color : '#f8fafc',
                      }}
                    >
                      {cond.name}
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: '0.75rem', color: cond.color, fontWeight: 800 }}>✓</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem', lineHeight: '1.2' }}>
                    {cond.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
