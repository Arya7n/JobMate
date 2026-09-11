import type { FillResult } from '@/lib/autofill';
import type { PageScanSummary } from '@/lib/site';

export function AutofillPanel({
  open,
  scan,
  lastResult,
  onClose,
  onAutofill,
}: {
  open: boolean;
  scan: PageScanSummary;
  lastResult: FillResult | null;
  onClose: () => void;
  onAutofill: () => void;
}) {
  if (!open || (!scan.detected && !lastResult)) {
    return null;
  }

  const reviewCount = scan.medium + scan.low;

  return (
    <div
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 2147483646,
        width: '320px',
        fontFamily:
          '"Segoe UI", ui-sans-serif, system-ui, -apple-system, sans-serif',
        color: '#161513',
        background: '#ffffff',
        border: '1px solid #e6e2d8',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(22, 21, 19, 0.12)',
        padding: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <strong style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>
          JobMate
        </strong>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#6b6860',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Close
        </button>
      </div>

      <p
        style={{
          margin: '0 0 4px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#1f6b62',
        }}
      >
        Application detected
      </p>
      <p style={{ margin: '0 0 10px', fontSize: '13px' }}>
        {scan.total} fields found
      </p>

      {scan.labels.length > 0 ? (
        <ul
          style={{
            margin: '0 0 10px',
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gap: '4px',
            fontSize: '12px',
            color: '#1f6b62',
          }}
        >
          {scan.labels.map((label) => (
            <li key={label}>✓ {label}</li>
          ))}
        </ul>
      ) : null}

      {reviewCount > 0 ? (
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#8a6914' }}>
          ⚠ {reviewCount} field{reviewCount === 1 ? '' : 's'} need review
        </p>
      ) : null}

      {lastResult ? (
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#2d6a4f' }}>
          Filled {lastResult.filled.length} field
          {lastResult.filled.length === 1 ? '' : 's'}
          {lastResult.skipped.length > 0
            ? ` · skipped ${lastResult.skipped.length}`
            : ''}
        </p>
      ) : null}

      {lastResult?.skipped.some((item) => item.reason === 'No resume uploaded') ? (
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#8a6914' }}>
          Upload a resume in the dashboard to attach it here.
        </p>
      ) : null}

      <button
        type="button"
        onClick={onAutofill}
        style={{
          width: '100%',
          height: '36px',
          border: 'none',
          borderRadius: '10px',
          background: '#1f6b62',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Autofill {scan.high > 0 ? `${scan.high} fields` : 'application'}
      </button>
    </div>
  );
}
