import React, { useState } from 'react';
import {
  Shield,
  Heart,
  Skull,
  Trash2,
  Edit2,
  Plus,
  Minus,
  Sparkles,
  User,
} from 'lucide-react';
import { STANDARD_CONDITIONS } from '../../types/conditions';

export function CombatantCard({
  combatant,
  isActiveTurn,
  onChangeHp,
  onUpdate,
  onToggleCondition,
  onRemove,
  onOpenConditionPicker,
}) {
  const [customHpInput, setCustomHpInput] = useState('');
  const [isEditingIni, setIsEditingIni] = useState(false);
  const [iniValue, setIniValue] = useState(combatant.initiative);

  const hpPercent = Math.max(
    0,
    Math.min(100, Math.round((combatant.hp.current / combatant.hp.max) * 100))
  );

  const isLowHp = hpPercent <= 25;
  const isMidHp = hpPercent > 25 && hpPercent <= 60;

  const handleApplyCustomDamage = () => {
    const val = parseInt(customHpInput, 10);
    if (!isNaN(val) && val > 0) {
      onChangeHp(combatant.id, -val);
      setCustomHpInput('');
    }
  };

  const handleApplyCustomHeal = () => {
    const val = parseInt(customHpInput, 10);
    if (!isNaN(val) && val > 0) {
      onChangeHp(combatant.id, val);
      setCustomHpInput('');
    }
  };

  const handleSaveInitiative = () => {
    setIsEditingIni(false);
    const parsed = parseInt(iniValue, 10);
    if (!isNaN(parsed)) {
      onUpdate(combatant.id, { initiative: parsed });
    }
  };

  return (
    <div
      id={`combatant-${combatant.id}`}
      className={`combatant-card ${isActiveTurn ? 'is-active-turn' : ''} ${
        combatant.isDefeated ? 'is-defeated' : ''
      }`}
    >
      {/* 1. Bloco de Iniciativa */}
      <div className="card-initiative-box" title="Clique duas vezes para editar a iniciativa">
        <span className="card-initiative-label">Inic.</span>
        {isEditingIni ? (
          <input
            type="number"
            className="form-input"
            style={{ width: '50px', padding: '0.2rem', textAlign: 'center' }}
            value={iniValue}
            autoFocus
            onChange={(e) => setIniValue(e.target.value)}
            onBlur={handleSaveInitiative}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveInitiative()}
          />
        ) : (
          <span
            className="card-initiative-val"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsEditingIni(true)}
          >
            {combatant.initiative}
          </span>
        )}
        <span className="card-dex-mod">
          {combatant.dexModifier >= 0 ? `+${combatant.dexModifier}` : combatant.dexModifier} DES
        </span>
      </div>

      {/* 2. Informações Gerais */}
      <div className="card-info-col">
        <div className="card-header-row">
          <span className="card-name" title={combatant.name}>
            {combatant.name}
          </span>
          <span className={`badge-type ${combatant.type}`}>
            {combatant.type === 'player' ? 'Jogador' : 'Monstro'}
          </span>
          {combatant.isDefeated && (
            <span
              style={{
                fontSize: '0.65rem',
                color: '#ef4444',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              <Skull size={12} /> DERROTADO
            </span>
          )}
        </div>

        <div className="card-meta-text">
          {combatant.playerName && (
            <span>
              <User size={12} style={{ display: 'inline', marginRight: 2 }} />
              {combatant.playerName}
            </span>
          )}
          {combatant.race && <span>• {combatant.race}</span>}
          {combatant.notes && <span className="card-notes">• {combatant.notes}</span>}
        </div>

        {/* Condições Ativas */}
        <div className="card-conditions-row">
          {combatant.conditions.map((condId) => {
            const cond = STANDARD_CONDITIONS.find((c) => c.id === condId);
            if (!cond) return null;
            return (
              <span
                key={condId}
                className="condition-pill"
                style={{
                  backgroundColor: `${cond.color}22`,
                  borderColor: cond.color,
                  color: cond.color,
                }}
                title={`${cond.name}: ${cond.desc} (Clique para remover)`}
                onClick={() => onToggleCondition(combatant.id, condId)}
              >
                {cond.name} ×
              </span>
            );
          })}
          <button
            className="btn btn-ghost"
            style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}
            onClick={() => onOpenConditionPicker(combatant.id)}
            title="Adicionar Condição / Efeito"
          >
            <Sparkles size={12} /> + Condição
          </button>
        </div>
      </div>

      {/* 3. Bloco de Armadura / Defesa (CA) */}
      <div className="card-defense-badge" title="Classe de Armadura (Defesa)">
        <div className="defense-icon-val">
          <Shield size={16} />
          <span>{combatant.ac}</span>
        </div>
        <span className="defense-label">CA / Def</span>
      </div>

      {/* 4. Bloco de Vida / HP */}
      <div className="card-hp-section">
        <div className="hp-numeric-display">
          <Heart size={14} color="#ef4444" fill="#ef4444" />
          <span className={`hp-cur ${isLowHp ? 'is-low' : ''}`}>
            {combatant.hp.current}
          </span>
          <span className="hp-max">/ {combatant.hp.max}</span>
          {combatant.hp.temp > 0 && (
            <span className="hp-temp-badge">+{combatant.hp.temp} Temp</span>
          )}
        </div>

        {/* Barra Visual de HP */}
        <div className="hp-bar-container">
          <div
            className={`hp-bar-fill ${isLowHp ? 'is-low' : isMidHp ? 'is-mid' : ''}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        {/* Botões Rápidos e Input de Dano */}
        <div className="hp-quick-buttons">
          <button
            className="btn-hp damage"
            onClick={() => onChangeHp(combatant.id, -5)}
            title="Sofrer 5 de dano"
          >
            -5
          </button>
          <button
            className="btn-hp damage"
            onClick={() => onChangeHp(combatant.id, -1)}
            title="Sofrer 1 de dano"
          >
            -1
          </button>
          <button
            className="btn-hp heal"
            onClick={() => onChangeHp(combatant.id, 1)}
            title="Curar 1 PV"
          >
            +1
          </button>
          <button
            className="btn-hp heal"
            onClick={() => onChangeHp(combatant.id, 5)}
            title="Curar 5 PV"
          >
            +5
          </button>

          <input
            type="number"
            className="form-input"
            placeholder="Qtd"
            style={{ width: '48px', padding: '0.15rem 0.3rem', fontSize: '0.75rem', textAlign: 'center' }}
            value={customHpInput}
            onChange={(e) => setCustomHpInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyCustomDamage();
            }}
          />
          <button
            className="btn-hp damage"
            style={{ fontSize: '0.65rem', padding: '0.2rem 0.35rem' }}
            onClick={handleApplyCustomDamage}
            title="Aplicar Dano personalizado"
          >
            Dano
          </button>
          <button
            className="btn-hp heal"
            style={{ fontSize: '0.65rem', padding: '0.2rem 0.35rem' }}
            onClick={handleApplyCustomHeal}
            title="Aplicar Cura personalizada"
          >
            Cura
          </button>
        </div>
      </div>

      {/* 5. Ações do Card */}
      <div className="card-actions-col">
        <button
          className="btn btn-ghost btn-icon-only"
          onClick={() =>
            onUpdate(combatant.id, { isDefeated: !combatant.isDefeated })
          }
          title={combatant.isDefeated ? 'Reviver / Reativar' : 'Marcar como Derrotado'}
        >
          <Skull size={18} color={combatant.isDefeated ? '#10b981' : '#ef4444'} />
        </button>

        <button
          className="btn btn-ghost btn-icon-only"
          onClick={() => onRemove(combatant.id)}
          title="Remover do Combate"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
