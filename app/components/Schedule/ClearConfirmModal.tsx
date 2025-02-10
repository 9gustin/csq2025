type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function ClearConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card-background rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-foreground mb-4">
          ¿Estás seguro?
        </h3>
        <p className="text-foreground/60 mb-6">
          Esta acción eliminará todos los shows seleccionados de tu agenda.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-medium text-foreground border border-card-border"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="secondary-button"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
} 