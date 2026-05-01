export function LoadingSpinner({ label = 'Carregando...' }: { label?: string }) {
  return <div className="loading"><span className="spinner" />{label}</div>;
}
