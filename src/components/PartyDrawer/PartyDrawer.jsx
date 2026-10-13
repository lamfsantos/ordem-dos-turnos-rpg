import React, { useState } from 'react';
import { X, UserPlus, Users, Trash2, Shield, Heart, Dices, ArrowDownRight } from 'lucide-react';

export function PartyDrawer({
  isOpen,
  onClose,
  party,
  onAddMember,
  onRemoveMember,
  onLoadPartyIntoCombat,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [race, setRace] = useState('');
  const [hpMax, setHpMax] = useState(25);
  const [ac, setAc] = useState(15);
  const [dexModifier, setDexModifier] = useState(2);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMember({
      name: name.trim(),
      playerName: playerName.trim(),
      race: race.trim(),
      hpMax: Number(hpMax) || 20,
      ac: Number(ac) || 12,
      dexModifier: Number(dexModifier) || 0,
      notes: notes.trim(),
    });

    setName('');
    setPlayerName('');
    setRace('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Users size={22} color="#10b981" />
            <span>Grupo da Campanha</span>
          </div>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-success"
            style={{ flex: 1 }}
            onClick={() => {
              onLoadPartyIntoCombat(party);
              onClose();
            }}
          >
            <ArrowDownRight size={16} /> Carregar no Combate
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsAdding(!isAdding)}
          >
            <UserPlus size={16} /> {isAdding ? 'Fechar' : 'Novo Personagem'}
          </button>
        </div>

        <div className="modal-body" style={{ flex: 1 }}>
          {isAdding && (
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nome do Herói *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Gandalf"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nome do Jogador</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: André"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Raça / Classe</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Mago Humano"
                    value={race}
                    onChange={(e) => setRace(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PV Máx</label>
                  <input
                    type="number"
                    className="form-input"
                    value={hpMax}
                    onChange={(e) => setHpMax(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CA (Def)</label>
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
                  <label className="form-label">Mod. Destreza</label>
                  <input
                    type="number"
                    className="form-input"
                    value={dexModifier}
                    onChange={(e) => setDexModifier(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notas</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Talentos, itens"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.25rem' }}>
                Salvar no Grupo
              </button>
            </form>
          )}

          {party.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <Users size={36} className="empty-state-icon" />
              <p className="empty-state-title" style={{ fontSize: '1.1rem' }}>Nenhum jogador salvo</p>
              <p className="empty-state-desc">Cadastre os heróis da sua mesa para adicioná-los rapidamente em qualquer combate.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {party.map((hero) => (
                <div
                  key={hero.id}
                  style={{
                    background: 'rgba(20,25,36,0.7)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{hero.name}</span>
                      {hero.playerName && (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({hero.playerName})</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.6rem' }}>
                      {hero.race && <span>{hero.race}</span>}
                      <span>• CA: {hero.ac}</span>
                      <span>• PV: {hero.hp?.max || hero.hpMax || 20}</span>
                      <span>• DES: {hero.dexModifier >= 0 ? `+${hero.dexModifier}` : hero.dexModifier}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost btn-icon-only"
                    onClick={() => onRemoveMember(hero.id)}
                    title="Remover personagem do grupo salvo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
