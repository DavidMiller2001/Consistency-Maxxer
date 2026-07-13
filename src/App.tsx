import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

function App() {
  const DECK_SIZE = 40;
  const HAND_SIZE = 5;
  const DESIRED_CARDS = 2;

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
                    DECK_SIZE,
                    HAND_SIZE,
                    DESIRED_CARDS,
                  ),
                );
              }}
            >
              Calculate
            </button>
            <p className='text-muted-foreground'>{output}%</p>
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

  return Number((100 * (1 - nMinusKChooseH / nChooseH)).toFixed(1));
}

export default App;
