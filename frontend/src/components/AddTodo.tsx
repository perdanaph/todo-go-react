import { useState } from 'react';
import { useForm } from '@mantine/form';
import { Modal, Group, Button, TextInput, Textarea } from '@mantine/core';
import { BASEURL, Todo } from '../App';
import { KeyedMutator } from 'swr';

function AddTodo({ mutate }: { mutate: KeyedMutator<Todo> }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      body: '',
    },
  });

  async function createTodo(values: { title: string; body: string }) {
    const updated = await fetch(`${BASEURL}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then(response => response.json());

    mutate(updated);
    form.reset();
    setOpen(false);
  }
  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)} title={'Create Todo'}>
        <form onSubmit={form.onSubmit(createTodo)}>
          <TextInput
            required
            mb={12}
            label="Todo"
            placeholder="What do yo want to do?"
            {...form.getInputProps('title')}
          />
          <Textarea
            required
            mb={12}
            label="Body"
            placeholder="Descripe what you want to do"
            {...form.getInputProps('body')}
          />

          <Button type="submit">Create Todo</Button>
        </form>
      </Modal>
      <Group position="center">
        <Button fullWidth mt={24} onClick={() => setOpen(true)}>
          Add Todo
        </Button>
      </Group>
    </>
  );
}

export default AddTodo;
