export default function ProgressBar({
  label,
  value,
  helperText,
}: {
  label: string;
  value: number;
  helperText?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-body-s flex items-start gap-2">
        <p className="flex-1 text-neutral-800">{label}</p>
        <p className="text-subtitle-s text-neutral-900">{value}%</p>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-clip rounded-full bg-neutral-100"
      >
        <div
          className="bg-brand-700 h-full rounded-full transition-[width]"
          style={{ width: `${value}%` }}
        />
      </div>
      {helperText && (
        <p className="text-body-xs text-neutral-600">{helperText}</p>
      )}
    </div>
  );
}
