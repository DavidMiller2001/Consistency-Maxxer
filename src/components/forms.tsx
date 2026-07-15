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
import { hypergeometricDistribution } from '@/lib/utils';
import { useEffect, useState } from 'react';

const requiredNumber = (message: string) =>
  z.union([z.number(), z.literal('')]).transform((value, context) => {
    if (value === '') {
      context.addIssue({
        code: 'custom',
        message,
      });

      return z.NEVER;
    }

    return value;
  });

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

export function DeckForm() {
  const deckSize = useDeckStore((state) => state.deckSize);
  const handSize = useDeckStore((state) => state.handSize);
  const desiredCards = useDeckStore((state) => state.desiredCards);
  const desiredCopies = useDeckStore((state) => state.desiredCopies);
  const setDeckState = useDeckStore((state) => state.setDeckState);

  const form = useForm<DeckFormInput, unknown, DeckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckSize: 40,
      handSize: 5,
      desiredCards: 3,
      desiredCopies: 1,
    },
  });

  function onSubmit(data: DeckFormValues) {
    setDeckState(
      data.deckSize,
      data.handSize,
      data.desiredCards,
      data.desiredCopies,
    );
  }

  const [percentOdds, setPercentOdds] = useState(0);

  useEffect(() => {
    setPercentOdds(
      100 *
        hypergeometricDistribution(
          deckSize,
          handSize,
          desiredCards,
          desiredCopies,
        ),
    );
  }, [desiredCards, deckSize, handSize, desiredCopies]);

  return (
    <div className='flex flex-col items-center justify-between gap-8 px-8 '>
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
                      onChange={(event) => {
                        const value = event.target.value;

                        field.onChange(value === '' ? '' : Number(value));
                      }}
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
                      onChange={(event) => {
                        const value = event.target.value;

                        field.onChange(value === '' ? '' : Number(value));
                      }}
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
                name='desiredCopies'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='deck-form-desired-copies'>
                      Desired Copies
                    </FieldLabel>

                    <Input
                      id='deck-form-desired-copies'
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value;

                        field.onChange(value === '' ? '' : Number(value));
                      }}
                      type='number'
                      min={0}
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
          <div className='flex flex-col items-center'>
            <h3 className='text-muted-foreground w-full'>
              Chance to draw {desiredCopies} or more copies of the desired card
            </h3>

            <p className='w-full text-xl'>{percentOdds.toFixed(2)}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
