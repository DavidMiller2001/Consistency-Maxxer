import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { DeckForm } from './components/forms';
import { create } from 'zustand';

interface DeckState {
  deckSize: number;
  handSize: number;
  desiredCards: number;
  setDeckState: (
    newDeckSize: number,
    newHandSize: number,
    newDesiredCards: number,
  ) => void;
}

export const useDeckStore = create<DeckState>((set) => ({
  deckSize: 40,
  handSize: 5,
  desiredCards: 3,
  setDeckState: (
    newDeckSize: number,
    newHandSize: number,
    newDesiredCards: number,
  ) =>
    set((state) => ({
      deckSize: newDeckSize,
      handSize: newHandSize,
      desiredCards: newDesiredCards,
    })),
}));

function App() {
  const deckSize = useDeckStore((state) => state.deckSize);
  const handSize = useDeckStore((state) => state.handSize);
  const desiredCards = useDeckStore((state) => state.desiredCards);

  const [output, setOutput] = useState(0);

  return (
    <div className='py-16'>
      <main className='w-full max-w-5xl m-auto'>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className='text-foreground text-xl'>Consistency Maxxer</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => {
                setOutput(
                  hypergeometricDistributionCalculation(
                    deckSize,
                    handSize,
                    desiredCards,
                  ),
                );
              }}
            >
              Calculate
            </button>
            <p className='text-muted-foreground'>{output}%</p>

            <DeckForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function factorial(n: number): number {
  if (n > 1) {
    return n * factorial(n - 1);
  } else {
    return 1;
  }
}

function chooseCalculation(deckSize: number, handSize: number): number {
  // N! / ( (H!) * (N-H)! )
  // deck size = n
  // hand size = h

  const nFactorial = factorial(deckSize);
  const hFactorial = factorial(handSize);
  const nMinusHFactorial = factorial(deckSize - handSize);

  return nFactorial / (hFactorial * nMinusHFactorial);
}

function hypergeometricDistributionCalculation(
  deckSize: number,
  handSize: number,
  desiredCards: number,
): number {
  const nMinusKChooseH = chooseCalculation(deckSize - desiredCards, handSize);
  const nChooseH = chooseCalculation(deckSize, handSize);

  const result = 1 - nMinusKChooseH / nChooseH;
  const formattedResult = Number((100 * result).toFixed(1));
  return formattedResult;
}

export default App;
