import React from 'react';
import { X, Keyboard } from 'lucide-react';

export function ShortcutsHelp({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Barra de Espaço', desc: 'Avançar para o próximo turno' },
    { key: 'Seta Direita (→)', desc: 'Avançar para o próximo turno' },
    { key: 'Seta Esquerda (←)', desc: 'Voltar ao turno anterior' },
    { key: 'N', desc: 'Abrir modal para adicionar combatente' },
    { key: 'Esc', desc: 'Fechar qualquer janela ou modal aberto' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Keyboard size={20} color="#f59e0b" />
            <span>Atalhos do Teclado</span>
          </div>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            Controle a iniciativa rapidamente durante a sessão sem precisar do mouse:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{s.desc}</span>
                <span className="kbd-shortcut" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>
                  {s.key}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
