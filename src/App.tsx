import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { DeckForm } from './components/forms';
import { create } from 'zustand';
import { hypergeometricDistributionCalculation } from './lib/utils';

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

  return (
    <div className='py-16 '>
      <main className='w-full max-w-5xl m-auto'>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className='text-foreground text-xl'>Consistency Maxxer</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeckForm />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </div>
  );
}


export default App;