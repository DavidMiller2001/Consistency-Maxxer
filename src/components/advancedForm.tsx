import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export function AdvancedDeckForm() {
  type Card = {
    name: string;
    role: string;
    copiesInDeck: number;
  };

  const [deck, setDeck] = useState<Card[]>([
    {
      name: 'White Albaz',
      role: 'Starter',
      copiesInDeck: 2,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Deck Configuration</CardTitle>
        <CardDescription>
          An advanced consistency calculator for drawing specific hands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {deck.map((card) => (
            <li key={card.name} className='flex gap-2'>
              <h4>{card.name}</h4>
              <p>{card.copiesInDeck}x</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
