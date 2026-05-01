export type ToastState = { message: string; type?: 'success' | 'error' | 'info' } | null;

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  return <div className={`toast toast-${toast.type || 'info'}`}>{toast.message}</div>;
}
