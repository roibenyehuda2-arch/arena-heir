import {BASIC,act,distance} from './engine.mjs';

export const basicRange = state => state.hero === 'suri' ? 2 : 1;
export const guardAmount = state => state.hero === 'tovin' ? 14 : 12;

export function actionDescription(state, id) {
  const range = basicRange(state);
  const reach = `Range ${range}.`;
  if (id === 'attack') return `${state.hero === 'suri' ? 8 : 10} base damage, plus weapon and next-hit bonuses. ${reach} Recover 1 energy.`;
  if (id === 'power') return `${state.hero === 'tovin' ? 20 : 17} base damage, plus weapon and next-hit bonuses. ${reach} Cuts enemy guard in half.`;
  if (id === 'guard') return `Block ${guardAmount(state)} damage this turn. Recover 1 energy. Fully blocking all incoming hits primes +${state.hero === 'miri' ? 3 : 2} next-hit damage; a stronger bonus is kept.`;
  if (id === 'dodge') return `Evade the first incoming hit. Prime +${state.hero === 'suri' ? 5 : 4} next-hit damage; a stronger bonus is kept. Unavailable for the next 2 turns.`;
  if (id === 'forward') return 'Jump forward up to 2 spaces. Prime +3 next-hit damage; a stronger bonus is kept.';
  return BASIC[id]?.desc || '';
}

export function actionForecast(state, id) {
  const copy = structuredClone(state), events = [];
  if (!act(copy, id, events)) return '';
  const sum = (type, side, key = 'actor') => events.filter(event => event.type === type && event[key] === side).reduce((total, event) => total + event.damage, 0);
  const dealt = sum('hit', 'player'), taken = sum('hit', 'enemy');
  const poison = sum('poison', 'player', 'target'), recoil = sum('recoil', 'player', 'target');
  return [dealt ? `${dealt} damage` : '', taken ? `Take ${taken}` : 'No hit taken', poison ? `Poison costs ${poison} health` : '', recoil ? `Recoil costs ${recoil} health` : '', copy.bonus ? `Next +${copy.bonus}` : ''].filter(Boolean).join(' · ');
}

export function rangeHint(state) {
  return distance(state) <= basicRange(state) ? 'Your Strike and Crush are in reach. Read their tell.' : 'Close the gap—or make them come to you.';
}
