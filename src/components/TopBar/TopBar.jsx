import React from 'react';
import {
  Swords,
  Play,
  SkipForward,
  SkipBack,
  RotateCcw,
  Users,
  Dices,
  Plus,
  Download,
  Upload,
  Keyboard,
} from 'lucide-react';
import { exportAllData, importAllData } from '../../storage/storageAdapter';

export function TopBar({
  round,
  isCombatActive,
  onStartCombat,
  onNextTurn,
  onPrevTurn,
  onResetEncounter,
  onRollMonsters,
  onOpenAddModal,
  onOpenPartyDrawer,
  onOpenShortcuts,
  onDataImported,
}) {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          const res = importAllData(text);
          if (res.success) {
            alert('Backup restaurado com sucesso!');
            if (onDataImported) onDataImported();
          } else {
            alert('Erro ao carregar arquivo de backup: ' + res.error);
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Swords className="topbar-logo-icon" size={28} />
        <div>
          <h1 className="topbar-title">
            ORDEM DOS TURNOS
            <span className="topbar-title-sub">D&D 5e</span>
          </h1>
        </div>
      </div>

      {/* Controles Centrais de Combate */}
      <div className="round-control-group">
        <div className="round-badge">
          <span className="round-label">Rodada</span>
          <span className="round-number">{round}</span>
        </div>

        <button
          className="btn btn-secondary btn-icon-only"
          onClick={onPrevTurn}
          disabled={!isCombatActive || round === 1}
          title="Turno Anterior (Seta Esquerda)"
        >
          <SkipBack size={18} />
        </button>

        {!isCombatActive ? (
          <button className="btn btn-primary" onClick={onStartCombat}>
            <Play size={18} />
            Iniciar Combate
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onNextTurn} title="Avançar Turno (Espaço)">
            <SkipForward size={18} />
            Próximo Turno
            <span className="kbd-shortcut">Espaço</span>
          </button>
        )}

        <button
          className="btn btn-ghost btn-icon-only"
          onClick={onResetEncounter}
          title="Resetar Ordem de Combate"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Ações e Ferramentas */}
      <div className="topbar-actions">
        <button className="btn btn-success" onClick={onOpenAddModal}>
          <Plus size={16} />
          Adicionar
          <span className="kbd-shortcut">N</span>
        </button>

        <button className="btn btn-secondary" onClick={onRollMonsters} title="Rolar iniciativa d20 dos monstros">
          <Dices size={16} />
          Inic. Monstros
        </button>

        <button className="btn btn-secondary" onClick={onOpenPartyDrawer} title="Gerenciar grupo fixo de jogadores">
          <Users size={16} />
          Grupo
        </button>

        <button className="btn btn-ghost btn-icon-only" onClick={exportAllData} title="Exportar Backup (JSON)">
          <Download size={18} />
        </button>

        <button className="btn btn-ghost btn-icon-only" onClick={handleImportClick} title="Importar Backup (JSON)">
          <Upload size={18} />
        </button>

        <button className="btn btn-ghost btn-icon-only" onClick={onOpenShortcuts} title="Atalhos do Teclado">
          <Keyboard size={18} />
        </button>
      </div>
    </header>
  );
}
