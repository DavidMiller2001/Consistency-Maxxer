import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chooseCalculation(deckSize: number, handSize: number): number {
  // N! / ( (H!) * (N-H)! )
  // deck size = n
  // hand size = h

  if (handSize < 0 || handSize > deckSize) {
    return 0;
  }

  const nFactorial = factorial(deckSize);
  const hFactorial = factorial(handSize);
  const nMinusHFactorial = factorial(deckSize - handSize);

  return nFactorial / (hFactorial * nMinusHFactorial);
}

export function factorial(n: number): number {
  if (n > 1) {
    return n * factorial(n - 1);
  } else {
    return 1;
  }
}

export function hypergeometricDistributionCalculation(
  deckSize: number,
  handSize: number,
  desiredCards: number,
  desiredCopies: number,
): number {
  // deckSize = n
  // desiredCards = k
  // handSize = h
  // desiredCopies = x

  const kChooseX = chooseCalculation(desiredCards, desiredCopies);

  const nMinusKChooseHMinusX = chooseCalculation(
    deckSize - desiredCards,
    handSize - desiredCopies,
  );

  const nChooseH = chooseCalculation(deckSize, handSize);

  const result = (kChooseX * nMinusKChooseHMinusX) / nChooseH;
  const formattedResult = Number((100 * result).toFixed(1));
  return formattedResult;
}
