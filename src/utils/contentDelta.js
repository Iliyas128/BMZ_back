/**
 * Минимальный объект отличий merged от defaults (для хранения в БД).
 * mergeDeep(HOME_DEFAULTS, delta) восстанавливает полный контент для редактора.
 */
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === undefined || b === undefined || a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  if (typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

function computeDelta(merged, defaults) {
  if (merged === undefined) return undefined;
  if (defaults === undefined) return merged;
  if (deepEqual(merged, defaults)) return undefined;

  if (Array.isArray(merged) || Array.isArray(defaults)) {
    return deepEqual(merged, defaults) ? undefined : merged;
  }
  if (typeof merged !== "object" || merged === null || typeof defaults !== "object" || defaults === null) {
    return merged === defaults ? undefined : merged;
  }

  const out = {};
  for (const k of Object.keys(merged)) {
    const d = computeDelta(merged[k], defaults[k]);
    if (d !== undefined) out[k] = d;
  }
  return Object.keys(out).length ? out : undefined;
}

module.exports = { computeDelta, deepEqual };
