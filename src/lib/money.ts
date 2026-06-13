/** Format an amount in kuruş as Turkish lira, e.g. 109900 -> "₺1.099" */
export function formatTRY(kurus: number): string {
  const lira = kurus / 100;
  const hasFraction = kurus % 100 !== 0;
  return (
    "₺" +
    lira.toLocaleString("tr-TR", {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: hasFraction ? 2 : 0,
    })
  );
}
