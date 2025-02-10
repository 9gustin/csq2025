import { SearchIcon, CloseIcon } from './icons';

type Props = {
  value: string;
  onChange: (value: string) => void;
  resultsCount?: number;
};

export function SearchInput({ value, onChange, resultsCount }: Props) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Buscar banda..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-3 border border-card-border rounded-lg 
                   bg-card-background text-foreground placeholder-foreground/40
                   focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary
                   text-base"
      />
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          {resultsCount !== undefined && (
            <span className="text-sm text-foreground/40 mr-2">
              {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
            </span>
          )}
          <button
            onClick={() => onChange('')}
            className="pr-3 flex items-center text-foreground/40 hover:text-foreground transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
} 