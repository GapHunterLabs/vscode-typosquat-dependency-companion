/**
 * Pure logic -- no `vscode` dependency. New niche (not a port from
 * the Kotlin catalog). Evidence: real cited case (Sonatype/security
 * write-ups) of "a typo (@utils_core instead of @utils-core) quietly
 * pulled in a malicious lookalike package during a CI/CD run", and a
 * well-documented edit-distance detection technique (SpellBound,
 * USENIX 2020 paper, "achieving a 0.5% false positive rate") --
 * confirmed absent as a VS Code extension applying edit distance
 * against a project's OWN dependency names (existing extensions
 * cover "malicious VS Code extensions", a different problem).
 */

export function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const distances: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i++) distances[i][0] = i;
  for (let j = 0; j < cols; j++) distances[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      distances[i][j] = Math.min(distances[i - 1][j] + 1, distances[i][j - 1] + 1, distances[i - 1][j - 1] + cost);
    }
  }

  return distances[rows - 1][cols - 1];
}

export interface TyposquatSuspect {
  dependencyName: string;
  similarTo: string;
  distance: number;
}

const MAX_DISTANCE = 2;
const MIN_LENGTH_TO_CHECK = 4; // very short names have too many legitimate 1-2-edit neighbors to be a useful signal

/** Flags a dependency name that's a near-miss (edit distance 1-2) of
 * a well-known popular package -- an exact match is fine (that IS
 * the popular package); only a close-but-different name is
 * suspicious. */
export function findTyposquatSuspects(dependencyNames: string[], popularPackages: readonly string[]): TyposquatSuspect[] {
  const popularSet = new Set(popularPackages);
  const suspects: TyposquatSuspect[] = [];

  for (const name of dependencyNames) {
    if (name.length < MIN_LENGTH_TO_CHECK) continue;
    if (popularSet.has(name)) continue; // it IS the popular package

    let closest: { name: string; distance: number } | null = null;
    for (const popular of popularPackages) {
      if (Math.abs(popular.length - name.length) > MAX_DISTANCE) continue; // cheap pre-filter
      const distance = levenshteinDistance(name, popular);
      if (distance > 0 && distance <= MAX_DISTANCE && (closest === null || distance < closest.distance)) {
        closest = { name: popular, distance };
      }
    }

    if (closest) {
      suspects.push({ dependencyName: name, similarTo: closest.name, distance: closest.distance });
    }
  }

  return suspects;
}
