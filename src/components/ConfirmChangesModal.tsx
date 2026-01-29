import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChangeRecord {
  rowId: number;
  field: string;
  oldValue: string;
  newValue: string;
}

interface ConfirmChangesModalProps {
  isOpen: boolean;
  changes: ChangeRecord[];
  onConfirm: () => void;
  onCancel: () => void;
  tableTitle: string;
}

export const ConfirmChangesModal: React.FC<ConfirmChangesModalProps> = ({
  isOpen,
  changes,
  onConfirm,
  onCancel,
  tableTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Confirm Changes</h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Review the changes you're about to make to <span className="font-semibold">{tableTitle}</span>:
          </p>

          {/* Changes List */}
          <div className="space-y-3">
            {changes.map((change, idx) => (
              <div
                key={idx}
                className="bg-muted/50 rounded-lg p-4 border border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Row #{change.rowId} - {change.field}
                    </p>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Old Value</p>
                        <p className="text-sm bg-background px-3 py-2 rounded border border-border text-foreground font-mono break-words">
                          {change.oldValue || '(empty)'}
                        </p>
                      </div>
                      <div className="flex items-center justify-center text-muted-foreground font-semibold">→</div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">New Value</p>
                        <p className="text-sm bg-background px-3 py-2 rounded border border-secondary/50 text-foreground font-mono break-words">
                          {change.newValue || '(empty)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {changes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No changes detected.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={changes.length === 0}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
