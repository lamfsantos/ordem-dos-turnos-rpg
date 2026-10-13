import React, { useState } from 'react';
import { X, Dices, UserPlus, Users, Shield, Heart } from 'lucide-react';
import { rollD20 } from '../../domain/combatRules';

export function AddCombatantModal({ isOpen, onClose, onAddSingle, onAddMultiple }) {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'batch'

  // Estado para combatente individual
  const [name, setName] = useState('');
  const [type, setType] = useState('monster');
  const [playerName, setPlayerName] = useState('');
  const [race, setRace] = useState('');
  const [initiative, setInitiative] = useState(10);
  const [dexModifier, setDexModifier] = useState(0);
  const [ac, setAc] = useState(12);
  const [hpMax, setHpMax] = useState(15);
  const [notes, setNotes] = useState('');

  // Estado para lote de monstros
  const [batchName, setBatchName] = useState('Goblin');
  const [batchQuantity, setBatchQuantity] = useState(3);
  const [batchHp, setBatchHp] = useState(7);
  const [batchAc, setBatchAc] = useState(15);
  const [batchDexMod, setBatchDexMod] = useState(2);
  const [rollIndividualIni, setRollIndividualIni] = useState(true);

  if (!isOpen) return null;

  const handleRollSingleIni = () => {
    const res = rollD20(dexModifier);
    setInitiative(res.total);
  };

  const handleSubmitSingle = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSingle({
      name: name.trim(),
      type,
      playerName: type === 'player' ? playerName.trim() : '',
      race: race.trim(),
      initiative: Number(initiative) || 0,
      dexModifier: Number(dexModifier) || 0,
      ac: Number(ac) || 10,
      hpMax: Number(hpMax) || 10,
      hpCurrent: Number(hpMax) || 10,
      notes: notes.trim(),
    });

    // Resetar campos básicos
    setName('');
    setNotes('');
    onClose();
  };

  const handleSubmitBatch = (e) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    onAddMultiple(
      {
        name: batchName.trim(),
        type: 'monster',
        ac: Number(batchAc) || 10,
        hpMax: Number(batchHp) || 10,
        hpCurrent: Number(batchHp) || 10,
        dexModifier: Number(batchDexMod) || 0,
        initiative: 10,
        notes: '',
      },
      batchQuantity,
      rollIndividualIni
    );

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className={`btn ${activeTab === 'single' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('single')}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              <UserPlus size={16} /> Individual
            </button>
            <button
              className={`btn ${activeTab === 'batch' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('batch')}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              <Users size={16} /> Lote de Monstros
            </button>
          </div>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {activeTab === 'single' ? (
          <form onSubmit={handleSubmitSingle}>
            <div className="modal-body">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nome do Personagem *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Thorin ou Esqueleto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="monster">Monstro / Inimigo</option>
                    <option value="player">Jogador (PC)</option>
                    <option value="npc">NPC Aliado</option>
                  </select>
                </div>
              </div>

              {type === 'player' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Nome do Jogador</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Lucas"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Raça / Classe</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Anão Guerreiro"
                      value={race}
                      onChange={(e) => setRace(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Iniciativa</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <input
                      type="number"
                      className="form-input"
                      value={initiative}
                      onChange={(e) => setInitiative(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon-only"
                      onClick={handleRollSingleIni}
                      title="Rolar d20 + Des"
                    >
                      <Dices size={16} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bônus DES</label>
                  <input
                    type="number"
                    className="form-input"
                    value={dexModifier}
                    onChange={(e) => setDexModifier(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CA (Defesa)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={ac}
                    onChange={(e) => setAc(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Pontos de Vida (HP Max)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={hpMax}
                    onChange={(e) => setHpMax(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notas / Habilidades</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Visão no Escuro, Ataque Duplo"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Adicionar Combatente
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitBatch}>
            <div className="modal-body">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nome do Monstro *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Goblin, Zumbi, Orc"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-input"
                    value={batchQuantity}
                    onChange={(e) => setBatchQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">HP de Cada</label>
                  <input
                    type="number"
                    className="form-input"
                    value={batchHp}
                    onChange={(e) => setBatchHp(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CA (Defesa)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={batchAc}
                    onChange={(e) => setBatchAc(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bônus de DES</label>
                  <input
                    type="number"
                    className="form-input"
                    value={batchDexMod}
                    onChange={(e) => setBatchDexMod(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="rollIndividual"
                  checked={rollIndividualIni}
                  onChange={(e) => setRollIndividualIni(e.target.checked)}
                />
                <label htmlFor="rollIndividual" style={{ fontSize: '0.85rem', color: '#f8fafc', cursor: 'pointer' }}>
                  Rolar iniciativa d20 automaticamente para cada um
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Criar {batchQuantity}x Monstros
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
