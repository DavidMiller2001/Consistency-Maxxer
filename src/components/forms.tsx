import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useDeckStore } from '@/App';
import { hypergeometricDistributionCalculation } from '@/lib/utils';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  deckSize: z
    .number()
    .int()
    .min(40, 'Decks must be between 40 and 60 cards')
    .max(60, 'Decks must be between 40 and 60 cards'),

  handSize: z.number().int().min(1, 'Hand size must be at least 1'),

  desiredCards: z.number().int().min(1, 'Desired cards must be at least 1'),
});

type DeckFormValues = z.infer<typeof formSchema>;

export function DeckForm() {
  const deckSize = useDeckStore((state) => state.deckSize);
  const handSize = useDeckStore((state) => state.handSize);
  const desiredCards = useDeckStore((state) => state.desiredCards);
  const setDeckState = useDeckStore((state) => state.setDeckState);

  const form = useForm<DeckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckSize: 40,
      handSize: 5,
      desiredCards: 3,
    },
  });

  function onSubmit(data: DeckFormValues) {
    setDeckState(data.deckSize, data.handSize, data.desiredCards);
  }

  const [oneCopyDrawn, setoneCopyDrawn] = useState(0);
  const [twoCopiesDrawn, setTwoCopiesDrawn] = useState(0);
  const [threeCopiesDrawn, setThreeCopiesDrawn] = useState(0);
  const [zeroCopiesDrawn, setZeroCopiesDrawn] = useState(0);

  useEffect(() => {
    const zeroCopiesExactly = hypergeometricDistributionCalculation(
      deckSize,
      handSize,
      desiredCards,
      0,
    );
    const twoCopiesExactly = hypergeometricDistributionCalculation(
      deckSize,
      handSize,
      desiredCards,
      2,
    );
    const threeCopiesExactly = hypergeometricDistributionCalculation(
      deckSize,
      handSize,
      desiredCards,
      3,
    );

    setoneCopyDrawn(100 - zeroCopiesExactly);
    setTwoCopiesDrawn(twoCopiesExactly + threeCopiesExactly);
    setThreeCopiesDrawn(threeCopiesExactly);
    setZeroCopiesDrawn(zeroCopiesExactly);
  }, [desiredCards, deckSize, handSize]);

  return (
    <div className='flex justify-between px-8'>
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle>Deck Configuration</CardTitle>

          <CardDescription>
            Enter your deck and opening-hand information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id='deckForm' onSubmit={form.handleSubmit(onSubmit)}>
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
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
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

              <Controller
                name='handSize'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='deck-form-hand-size'>
                      Hand Size
                    </FieldLabel>

                    <Input
                      id='deck-form-hand-size'
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      type='number'
                      min={1}
                      aria-invalid={fieldState.invalid}
                      autoComplete='off'
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='desiredCards'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='deck-form-desired-cards'>
                      Desired Cards
                    </FieldLabel>

                    <Input
                      id='deck-form-desired-cards'
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      type='number'
                      min={1}
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

        <CardFooter>
          <Field orientation='horizontal'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
            >
              Reset
            </Button>

            <Button type='submit' form='deckForm'>
              Calculate
            </Button>
          </Field>
        </CardFooter>
      </Card>

      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='flex flex-col gap-2'>
            <li>
              <h3 className='text-muted-foreground'>
                Chance to draw 1 or more copies of the desired card
              </h3>
              <p className='text-xl'>{oneCopyDrawn}%</p>
            </li>
            <li>
              <h3 className='text-muted-foreground'>
                Chance to draw 2 or more copies of the desired card
              </h3>
              <p className='text-xl'>{twoCopiesDrawn}%</p>
            </li>
            <li>
              <h3 className='text-muted-foreground'>
                Chance to draw 3 copies of the desired card
              </h3>
              <p className='text-xl'>{threeCopiesDrawn}%</p>
            </li>
            <li>
              <h3 className='text-muted-foreground'>
                Chance to draw 0 copies of the desired card
              </h3>
              <p className='text-xl'>{zeroCopiesDrawn}%</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
