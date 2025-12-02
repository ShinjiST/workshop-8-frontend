import { useMemo } from "react";

interface Rate {
  r_id: number;
  r_price_per_day: number;
}

export const useAgreementTotalCalculator = (
  rates: Array<Rate> | undefined,
  watchedRateId: number | undefined,
  watchedDuration: number | undefined
): number => {
  const calculatedTotal = useMemo(() => {
    if (!rates || !watchedRateId || !watchedDuration || watchedDuration < 1) {
      return 0;
    }

    const selectedRate = rates.find(r => r.r_id === watchedRateId);

    if (selectedRate) {
      const result = (selectedRate.r_price_per_day * watchedDuration);
      return Number(result.toFixed(2));
    }
    
    return 0;
  }, [rates, watchedRateId, watchedDuration]);

  return calculatedTotal;
};