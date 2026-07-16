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
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { create } from 'zustand';
import { Minus, Plus, X } from 'lucide-react';

const MIN_CARD_COPIES = 1;
const MAX_CARD_COPIES = 3;

const formSchema = z.object({
  cardName: z.string().trim().min(1, { error: 'Must enter a card name!' }),

  cardRole: z.string().trim().min(1, { error: 'Must enter a card role!' }),

  cardCopies: z
    .number({ error: 'Card copies must be a number' })
    .int({ error: 'Card copies must be a whole number' })
    .min(MIN_CARD_COPIES, {
      error: 'Must have at least 1 copy',
    })
    .max(MAX_CARD_COPIES, {
      error: 'No more than 3 copies',
    }),
});

type DeckFormInput = z.input<typeof formSchema>;
type DeckFormValues = z.output<typeof formSchema>;

type DeckCard = {
  name: string;
  role: string;
  copiesInDeck: number;
};

interface AdvancedDeckState {
  deck: DeckCard[];

  addCard: (card: DeckCard) => boolean;
  increaseCopies: (cardName: string) => void;
  decreaseCopies: (cardName: string) => void;
  removeCard: (cardName: string) => void;
}

function normalizeCardName(cardName: string) {
  return cardName.trim().toLowerCase();
}

export const useAdvancedDeckStore = create<AdvancedDeckState>((set, get) => ({
  deck: [
    {
      name: 'Elemental Hero Stratos',
      role: 'Normal Summon',
      copiesInDeck: 3,
    },
  ],

  addCard: (newCard) => {
    const normalizedNewCardName = normalizeCardName(newCard.name);

    const cardAlreadyExists = get().deck.some(
      (card) => normalizeCardName(card.name) === normalizedNewCardName,
    );

    if (cardAlreadyExists) {
      return false;
    }

    set((state) => ({
      deck: [
        ...state.deck,
        {
          ...newCard,
          name: newCard.name.trim(),
          role: newCard.role.trim(),
        },
      ],
    }));

    return true;
  },

  increaseCopies: (cardName) => {
    set((state) => ({
      deck: state.deck.map((card) => {
        if (card.name === cardName && card.copiesInDeck < MAX_CARD_COPIES) {
          return {
            ...card,
            copiesInDeck: card.copiesInDeck + 1,
          };
        }

        return card;
      }),
    }));
  },

  decreaseCopies: (cardName) => {
    set((state) => ({
      deck: state.deck.map((card) => {
        if (card.name === cardName && card.copiesInDeck > MIN_CARD_COPIES) {
          return {
            ...card,
            copiesInDeck: card.copiesInDeck - 1,
          };
        }

        return card;
      }),
    }));
  },

  removeCard: (cardName) => {
    set((state) => ({
      deck: state.deck.filter((card) => card.name !== cardName),
    }));
  },
}));

export function AdvancedDeckForm() {
  const addCard = useAdvancedDeckStore((state) => state.addCard);

  const form = useForm<DeckFormInput, unknown, DeckFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      cardName: '',
      cardRole: '',
      cardCopies: 3,
    },
  });

  function onSubmit(data: DeckFormValues) {
    const cardWasAdded = addCard({
      name: data.cardName,
      role: data.cardRole,
      copiesInDeck: data.cardCopies,
    });

    if (!cardWasAdded) {
      form.setError('cardName', {
        type: 'manual',
        message: 'This card is already in the deck',
      });

      return;
    }

    form.reset({
      cardName: '',
      cardRole: '',
      cardCopies: 3,
    });
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Advanced Deck Configuration</CardTitle>

          <CardDescription>
            An advanced consistency calculator for drawing specific hands.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id='cardForm' onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name='cardName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='card-form-card-name'>
                      Card Name
                    </FieldLabel>

                    <Input
                      id='card-form-card-name'
                      {...field}
                      type='text'
                      aria-invalid={fieldState.invalid}
                      autoComplete='off'
                      placeholder='Elemental Hero Stratos'
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='cardRole'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='card-form-card-role'>
                      Card Role
                    </FieldLabel>

                    <Input
                      id='card-form-card-role'
                      {...field}
                      type='text'
                      aria-invalid={fieldState.invalid}
                      autoComplete='off'
                      placeholder='Starter'
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='cardCopies'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='card-form-card-copies'>
                      Card Copies
                    </FieldLabel>

                    <Input
                      id='card-form-card-copies'
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value;

                        field.onChange(value === '' ? '' : Number(value));
                      }}
                      type='number'
                      min={MIN_CARD_COPIES}
                      max={MAX_CARD_COPIES}
                      step={1}
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
            <Button type='submit' form='cardForm'>
              Add Card
            </Button>
          </Field>
        </CardFooter>
      </Card>

      <DeckTable />
    </div>
  );
}

function DeckTable() {
  const deck = useAdvancedDeckStore((state) => state.deck);

  const increaseCopies = useAdvancedDeckStore((state) => state.increaseCopies);

  const decreaseCopies = useAdvancedDeckStore((state) => state.decreaseCopies);

  const removeCard = useAdvancedDeckStore((state) => state.removeCard);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role(s)</TableHead>
          <TableHead>Copies</TableHead>
          <TableHead>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {deck.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className='h-24 text-center text-muted-foreground'
            >
              No cards have been added.
            </TableCell>
          </TableRow>
        ) : (
          deck.map((card) => (
            <TableRow key={card.name}>
              <TableCell>{card.name}</TableCell>

              <TableCell>{card.role}</TableCell>

              <TableCell>
                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    disabled={card.copiesInDeck <= MIN_CARD_COPIES}
                    onClick={() => decreaseCopies(card.name)}
                    aria-label={`Decrease copies of ${card.name}`}
                  >
                    <Minus />
                  </Button>

                  <span className='min-w-6 text-center'>
                    {card.copiesInDeck}
                  </span>

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    disabled={card.copiesInDeck >= MAX_CARD_COPIES}
                    onClick={() => increaseCopies(card.name)}
                    aria-label={`Increase copies of ${card.name}`}
                  >
                    <Plus />
                  </Button>
                </div>
              </TableCell>

              <TableCell>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeCard(card.name)}
                  aria-label={`Remove ${card.name}`}
                >
                  <X />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
