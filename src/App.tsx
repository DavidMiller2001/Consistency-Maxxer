import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { DeckForm } from './components/forms';

import { create } from 'zustand';

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
  return (
    <div className='py-16 '>
      <main className='w-full max-w-5xl m-auto'>
        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle>
              <h1 className='text-foreground text-xl'>Consistency Maxxer</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeckForm />
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
