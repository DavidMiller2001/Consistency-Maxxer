import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { requiredNumber } from '@/lib/utils';
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';

const formSchema = z
  .object({
    deckSize: requiredNumber('Deck size is required').pipe(
      z
        .number()
        .int('Deck size must be a whole number')
        .min(40, 'Decks must be between 40 and 60 cards')
        .max(60, 'Decks must be between 40 and 60 cards'),
    ),

    handSize: requiredNumber('Hand size is required').pipe(
      z
        .number()
        .int('Hand size must be a whole number')
        .min(1, 'Hand size must be at least 1'),
    ),

    desiredCards: requiredNumber('Desired cards is required').pipe(
      z
        .number()
        .int('Desired cards must be a whole number')
        .min(1, 'Desired cards must be at least 1'),
    ),

    desiredCopies: requiredNumber('Desired copies is required').pipe(
      z
        .number()
        .int('Desired copies must be a whole number')
        .min(0, 'Desired copies cannot be negative'),
    ),
  })
  .refine((data) => data.handSize <= data.deckSize, {
    path: ['handSize'],
    message: 'Hand size cannot exceed deck size',
  })
  .refine((data) => data.desiredCards <= data.deckSize, {
    path: ['desiredCards'],
    message: 'Desired cards cannot exceed deck size',
  })
  .refine(
    (data) => data.desiredCopies <= Math.min(data.desiredCards, data.handSize),
    {
      path: ['desiredCopies'],
      message:
        'Desired copies cannot exceed the desired card count or hand size',
    },
  );

type DeckFormInput = z.input<typeof formSchema>;
type DeckFormValues = z.output<typeof formSchema>;

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

  const form = useForm<DeckFormInput, unknown, DeckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckSize: 40,
      handSize: 5,
      desiredCards: 3,
      desiredCopies: 1,
    },
  });

  function onSubmit(data: DeckFormValues) {}

  return (
    <div>
      <Card>
        <CardContent>
          <form id='cardForm' onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name='deckSize'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='deck-form-deck-size'>
                      Deck Size
                    </FieldLabel>

                    <Input
                      id='deck-form-deck-size'
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value;

                        field.onChange(value === '' ? '' : Number(value));
                      }}
                      type='number'
                      min={40}
                      max={60}
                      aria-invalid={fieldState.invalid}
                      autoComplete='off'
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
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
        <CardFooter>
          <Field orientation='horizontal'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
            >
              Reset
            </Button>

            <Button type='submit' form='simpleDeckForm'>
              Calculate
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
