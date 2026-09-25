import { stages, type Stage } from '@/lib/content';

/** The six stage chips. With `lit`, only those stages are on: where one service sits in the chain. */
export default function Stages({ lit, center }: { lit?: Stage[]; center?: boolean }) {
  return (
    <ol className={`stages${center ? ' stages--center' : ''}`}>
      {stages.map((label, i) => {
        const on = lit ? lit.includes(label) : i === stages.length - 1;
        return (
          <li key={label} className={`stage reveal${on ? ' stage--on' : ''}`}>
            <span className="stage__n">{String(i + 1).padStart(2, '0')}</span>
            <span className="stage__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
