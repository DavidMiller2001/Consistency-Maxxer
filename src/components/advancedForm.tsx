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

const formSchema = z.object({
  cardName: z.string().nonempty({ error: 'Must enter a card name!' }),
  cardRole: z.string().nonempty({ error: 'Must enter card role!' }),
  cardCopies: z
    .number()
    .min(1, { error: 'Must have at least 1 copy' })
    .max(3, { error: 'No more than 3 copies' }),
});

type DeckFormInput = z.input<typeof formSchema>;
type DeckFormValues = z.output<typeof formSchema>;

type Card = {
  name: string;
  role: string;
  copiesInDeck: number;
};

interface AdvancedDeckState {
  deck: Card[];
  setAdvancedDeckState: (newDeck: Card[]) => void;
  increaseCopies: (cardName: string) => void;
  decreaseCopies: (cardName: string) => void;
}

export const useAdvancedDeckStore = create<AdvancedDeckState>((set) => ({
  deck: [],
  setAdvancedDeckState: (newDeck) =>
    set(() => ({
      deck: newDeck,
    })),

  increaseCopies: (cardName) => {
    set((state) => ({
      deck: state.deck.map((card) => {
        if (card.name === cardName && card.copiesInDeck < 3) {
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
        if (card.name === cardName && card.copiesInDeck > 1) {
          return {
            ...card,
            copiesInDeck: card.copiesInDeck - 1,
          };
        }
        return card;
      }),
    }));
  },
}));

export function AdvancedDeckForm() {
  const deck = useAdvancedDeckStore((state) => state.deck);
  const setAdvancedDeckState = useAdvancedDeckStore(
    (state) => state.setAdvancedDeckState,
  );

  const form = useForm<DeckFormInput, unknown, DeckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: '',
      cardRole: '',
      cardCopies: 3,
    },
  });

  function onSubmit(data: DeckFormValues) {
    const { cardName, cardRole, cardCopies } = data;
    form.reset();

    const cardAlreadyExists = deck.some(
      (card) =>
        card.name.trim().toLowerCase() === cardName.trim().toLowerCase(),
    );

    if (cardAlreadyExists) {
      alert('Card is already in the deck!');
      return;
    }

    setAdvancedDeckState([
      ...deck,
      {
        name: cardName,
        role: cardRole,
        copiesInDeck: cardCopies,
      },
    ]);
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Advanced Deck Configuration</CardTitle>
          <CardDescription>
            An advanced consistency calculator for drawing specific hands
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
                    <FieldLabel>Card Role</FieldLabel>
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
                    <FieldLabel>Card Copies</FieldLabel>
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Copies</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deck.map((card) => (
          <TableRow key={card.name}>
            <TableCell>{card.name}</TableCell>
            <TableCell>{card.role}</TableCell>
            <TableCell>
              <Button
                variant={'ghost'}
                onClick={() => decreaseCopies(card.name)}
              >
                -
              </Button>
              {card.copiesInDeck}
              <Button
                variant={'ghost'}
                onClick={() => increaseCopies(card.name)}
              >
                +
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
