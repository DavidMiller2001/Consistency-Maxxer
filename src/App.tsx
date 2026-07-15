import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { SimpleDeckForm } from './components/simpleForm';

import { create } from 'zustand';
import { Button } from './components/ui/button';
import { useState } from 'react';
import { cn } from './lib/utils';
import { AdvancedDeckForm } from './components/advancedForm';

interface DeckState {
  deckSize: number;
  handSize: number;
  desiredCards: number;
  desiredCopies: number;
  setDeckState: (
    newDeckSize: number,
    newHandSize: number,
    newDesiredCards: number,
    newDesiredCopies: number,
  ) => void;
}

export const useDeckStore = create<DeckState>((set) => ({
  deckSize: 40,
  handSize: 5,
  desiredCards: 3,
  desiredCopies: 1,
  setDeckState: (
    newDeckSize: number,
    newHandSize: number,
    newDesiredCards: number,
    newDesiredCopies: number,
  ) =>
    set(() => ({
      deckSize: newDeckSize,
      handSize: newHandSize,
      desiredCards: newDesiredCards,
      desiredCopies: newDesiredCopies,
    })),
}));

function App() {
  const pageComplexityOptions = ['simple', 'advanced'] as const;

  type pageComplexityType = (typeof pageComplexityOptions)[number];

  const [pageComplexity, setPageComplexity] =
    useState<pageComplexityType>('simple');

  return (
    <div className='py-16 '>
      <main className='w-full max-w-5xl m-auto'>
        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle>
              <nav className='flex justify-between items-center'>
                <h1 className='text-foreground text-xl'>Consistency Maxxer</h1>
                <ul className='flex'>
                  <li>
                    <Button
                      variant={'link'}
                      onClick={() => {
                        setPageComplexity('simple');
                      }}
                      className={cn(
                        pageComplexity === 'simple' ? 'underline' : '',
                      )}
                    >
                      Simple
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={'link'}
                      onClick={() => {
                        setPageComplexity('advanced');
                      }}
                      className={cn(
                        pageComplexity === 'advanced' ? 'underline' : '',
                      )}
                    >
                      Advanced
                    </Button>
                  </li>
                </ul>
              </nav>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pageComplexity === 'simple' ? (
              <SimpleDeckForm />
            ) : (
              <AdvancedDeckForm />
            )}
          </CardContent>
          <CardFooter>
            <p className='text-center text-muted-foreground w-full'>
              &copy; David Miller 2026
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default App;
