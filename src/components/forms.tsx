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

const formSchema = z.object({
  deckSize: z
    .number()
    .int()
    .min(40, 'Decks must be between 40 and 60 cards')
    .max(60, 'Decks must be between 40 and 60 cards'),

  handSize: z.number().int().min(1, 'Hand size must be at least 1'),

  desiredCards: z.number().int().min(1, 'Desired cards must be at least 1'),

  desiredCopies: z.number().int(),
});

type DeckFormValues = z.infer<typeof formSchema>;

export function DeckForm() {
  const deckSize = useDeckStore((state) => state.deckSize);
  const handSize = useDeckStore((state) => state.handSize);
  const desiredCards = useDeckStore((state) => state.desiredCards);
  const desiredCopies = useDeckStore((state) => state.desiredCopies);
  const setDeckState = useDeckStore((state) => state.setDeckState);

  const form = useForm<DeckFormValues>({
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
    <div className='flex justify-between items-center gap-8 px-8 flex-col md:flex-row md:items-stretch'>
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
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
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
              {`Chance to draw ${desiredCopies} or more copies of the desired card`}
            </h3>
            <p className='text-xl w-full'>{percentOdds.toFixed(2)}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
