import { Pencil, Trash2, Check, X, Plus } from "lucide-react";

export const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all duration-300 text-sm";

export function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse" />
      ))}
    </div>
  );
}

export function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="text-center py-16 text-zinc-600">
      <div className="flex justify-center mb-4">{icon}</div>
      <p>{message}</p>
    </div>
  );
}

export function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label}{required && " *"}
      </label>
      {children}
    </div>
  );
}

export function AdminRowActions({
  onEdit,
  onDelete,
  deleting,
}: {
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        onClick={onEdit}
        className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function FormActions({
  saving,
  saveLabel,
  onCancel,
}: {
  saving: boolean;
  saveLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="md:col-span-2 flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60"
      >
        <Check className="w-4 h-4" />
        {saving ? "Saving..." : saveLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 px-6 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition-colors"
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
    </div>
  );
}

export function AdminSectionHeader({
  title,
  buttonLabel,
  onClick,
}: {
  title: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-bold rounded-xl hover:bg-amber-300 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {buttonLabel}
      </button>
    </div>
  );
}
