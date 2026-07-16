import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { create } from 'zustand';
import { Minus, Pencil, Plus, X } from 'lucide-react';
import z from 'zod';

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
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

const MIN_CARD_COPIES = 1;
const MAX_CARD_COPIES = 3;

const formSchema = z.object({
  cardName: z.string().trim().min(1, { error: 'Must enter a card name!' }),

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
  roles: string[];
  copiesInDeck: number;
};

interface AdvancedDeckState {
  deck: DeckCard[];
  addCard: (card: DeckCard) => boolean;
  updateCard: (originalCardName: string, updatedCard: DeckCard) => boolean;
  increaseCopies: (cardName: string) => void;
  decreaseCopies: (cardName: string) => void;
  removeCard: (cardName: string) => void;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export const useAdvancedDeckStore = create<AdvancedDeckState>((set, get) => ({
  deck: [
    {
      name: 'Elemental Hero Stratos',
      roles: ['Starter', 'Normal Summon'],
      copiesInDeck: 3,
    },
  ],

  addCard: (newCard) => {
    const normalizedNewCardName = normalizeText(newCard.name);

    const cardAlreadyExists = get().deck.some(
      (card) => normalizeText(card.name) === normalizedNewCardName,
    );

    if (cardAlreadyExists) {
      return false;
    }

    set((state) => ({
      deck: [
        ...state.deck,
        {
          name: newCard.name.trim(),
          roles: newCard.roles.map((role) => role.trim()),
          copiesInDeck: newCard.copiesInDeck,
        },
      ],
    }));

    return true;
  },

  updateCard: (originalCardName, updatedCard) => {
    const normalizedUpdatedName = normalizeText(updatedCard.name);

    const nameBelongsToAnotherCard = get().deck.some(
      (card) =>
        card.name !== originalCardName &&
        normalizeText(card.name) === normalizedUpdatedName,
    );

    if (nameBelongsToAnotherCard) {
      return false;
    }

    set((state) => ({
      deck: state.deck.map((card) =>
        card.name === originalCardName
          ? {
              name: updatedCard.name.trim(),
              roles: updatedCard.roles.map((role) => role.trim()),
              copiesInDeck: updatedCard.copiesInDeck,
            }
          : card,
      ),
    }));

    return true;
  },

  increaseCopies: (cardName) => {
    set((state) => ({
      deck: state.deck.map((card) =>
        card.name === cardName && card.copiesInDeck < MAX_CARD_COPIES
          ? {
              ...card,
              copiesInDeck: card.copiesInDeck + 1,
            }
          : card,
      ),
    }));
  },

  decreaseCopies: (cardName) => {
    set((state) => ({
      deck: state.deck.map((card) =>
        card.name === cardName && card.copiesInDeck > MIN_CARD_COPIES
          ? {
              ...card,
              copiesInDeck: card.copiesInDeck - 1,
            }
          : card,
      ),
    }));
  },

  removeCard: (cardName) => {
    set((state) => ({
      deck: state.deck.filter((card) => card.name !== cardName),
    }));
  },
}));

export function AdvancedDeckForm() {
  const deck = useAdvancedDeckStore((state) => state.deck);

  const addCard = useAdvancedDeckStore((state) => state.addCard);

  const updateCard = useAdvancedDeckStore((state) => state.updateCard);

  const removeCard = useAdvancedDeckStore((state) => state.removeCard);

  const [editingCardName, setEditingCardName] = useState<string | null>(null);

  const [roleInput, setRoleInput] = useState('');
  const [roles, setRoles] = useState<string[]>([]);

  const [roleError, setRoleError] = useState<string | null>(null);

  const form = useForm<DeckFormInput, unknown, DeckFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      cardName: '',
      cardCopies: 3,
    },
  });

  function resetForm() {
    setEditingCardName(null);

    form.reset({
      cardName: '',
      cardCopies: 3,
    });

    setRoleInput('');
    setRoles([]);
    setRoleError(null);
  }

  function addRole() {
    const trimmedRole = roleInput.trim();

    if (!trimmedRole) {
      setRoleError('Enter a role before adding it');
      return;
    }

    const roleAlreadyExists = roles.some(
      (role) => normalizeText(role) === normalizeText(trimmedRole),
    );

    if (roleAlreadyExists) {
      setRoleError('This role has already been added');
      return;
    }

    setRoles((currentRoles) => [...currentRoles, trimmedRole]);

    setRoleInput('');
    setRoleError(null);
  }

  function removeRole(roleToRemove: string) {
    setRoles((currentRoles) =>
      currentRoles.filter((role) => role !== roleToRemove),
    );

    setRoleError(null);
  }

  function startEditingCard(cardName: string) {
    const cardToEdit = deck.find((card) => card.name === cardName);

    if (!cardToEdit) {
      return;
    }

    setEditingCardName(cardToEdit.name);

    form.reset({
      cardName: cardToEdit.name,
      cardCopies: cardToEdit.copiesInDeck,
    });

    setRoles([...cardToEdit.roles]);
    setRoleInput('');
    setRoleError(null);
  }

  function handleRemoveCard(cardName: string) {
    removeCard(cardName);

    if (editingCardName === cardName) {
      resetForm();
    }
  }

  function onSubmit(data: DeckFormValues) {
    if (roles.length === 0) {
      setRoleError('Add at least one card role');
      return;
    }

    const cardData: DeckCard = {
      name: data.cardName,
      roles,
      copiesInDeck: data.cardCopies,
    };

    if (editingCardName) {
      const cardWasUpdated = updateCard(editingCardName, cardData);

      if (!cardWasUpdated) {
        form.setError('cardName', {
          type: 'manual',
          message: 'Another card with this name is already in the deck',
        });

        return;
      }
    } else {
      const cardWasAdded = addCard(cardData);

      if (!cardWasAdded) {
        form.setError('cardName', {
          type: 'manual',
          message: 'This card is already in the deck',
        });

        return;
      }
    }

    resetForm();
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>
            {editingCardName
              ? `Editing ${editingCardName}`
              : 'Advanced Deck Configuration'}
          </CardTitle>

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

              <Field data-invalid={Boolean(roleError)}>
                <FieldLabel htmlFor='card-form-card-role'>
                  Card Roles
                </FieldLabel>

                <div className='flex gap-2'>
                  <Input
                    id='card-form-card-role'
                    value={roleInput}
                    onChange={(event) => {
                      setRoleInput(event.target.value);

                      if (roleError) {
                        setRoleError(null);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addRole();
                      }
                    }}
                    type='text'
                    aria-invalid={Boolean(roleError)}
                    autoComplete='off'
                    placeholder='Starter'
                  />

                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={addRole}
                    aria-label='Add card role'
                  >
                    <Plus className='size-4' />
                  </Button>
                </div>

                {roles.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {roles.map((role) => (
                      <Badge
                        key={role}
                        variant='secondary'
                        className='inline-flex items-center gap-1 pr-1'
                      >
                        <span className='leading-none'>{role}</span>

                        <button
                          type='button'
                          onClick={() => removeRole(role)}
                          className='inline-flex size-4 items-center justify-center rounded-sm hover:bg-muted'
                          aria-label={`Remove ${role} role`}
                        >
                          <X className='size-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {roleError && (
                  <p className='text-sm text-destructive'>{roleError}</p>
                )}
              </Field>

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
            {editingCardName && (
              <Button type='button' variant='outline' onClick={resetForm}>
                Cancel
              </Button>
            )}

            <Button type='submit' form='cardForm'>
              {editingCardName ? 'Save Changes' : 'Add Card'}
            </Button>
          </Field>
        </CardFooter>
      </Card>

      <DeckTable
        onEditCard={startEditingCard}
        onRemoveCard={handleRemoveCard}
      />
    </div>
  );
}

type DeckTableProps = {
  onEditCard: (cardName: string) => void;
  onRemoveCard: (cardName: string) => void;
};

function DeckTable({ onEditCard, onRemoveCard }: DeckTableProps) {
  const deck = useAdvancedDeckStore((state) => state.deck);

  const increaseCopies = useAdvancedDeckStore((state) => state.increaseCopies);

  const decreaseCopies = useAdvancedDeckStore((state) => state.decreaseCopies);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role(s)</TableHead>

          <TableHead className='text-center'>Copies</TableHead>

          <TableHead className='text-right'>
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

              <TableCell>
                <div className='flex flex-wrap gap-1'>
                  {card.roles.map((role) => (
                    <Badge key={role} variant='secondary'>
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              <TableCell>
                <div className='flex items-center justify-center gap-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    disabled={card.copiesInDeck <= MIN_CARD_COPIES}
                    onClick={() => decreaseCopies(card.name)}
                    aria-label={`Decrease copies of ${card.name}`}
                  >
                    <Minus className='size-4' />
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
                    <Plus className='size-4' />
                  </Button>
                </div>
              </TableCell>

              <TableCell>
                <div className='flex items-center justify-end gap-1'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => onEditCard(card.name)}
                    aria-label={`Edit ${card.name}`}
                  >
                    <Pencil className='size-4' />
                  </Button>

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => onRemoveCard(card.name)}
                    aria-label={`Remove ${card.name}`}
                  >
                    <X className='size-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
