/* eslint-disable react-refresh/only-export-components */
import { Box, List, ThemeIcon } from '@mantine/core';
import useSWR from 'swr';
import './App.css';
import AddTodo from './components/AddTodo';
import { IconCheck } from '@tabler/icons-react';

export interface Todo {
  success: boolean;
  todos: [
    {
      id: number;
      title: string;
      body: string;
      isDone: boolean;
    }
  ];
}

export const BASEURL = 'http://localhost:8080';

const fetcher = (endpoint: string) =>
  fetch(`${BASEURL}/${endpoint}`).then(response => response.json());

function App() {
  const { data, mutate } = useSWR<Todo>('api/todos', fetcher);

  async function updateTodoMarkDone(id: number) {
    const updated = await fetch(`${BASEURL}/api/todos/${id}/done`, {
      method: 'PATCH',
    }).then(response => response.json());
    mutate(updated);
  }
  return (
    <>
      <section className="container">
        <Box
          sx={theme => ({
            padding: '2rem',
            width: '40%',
            backgroundColor: '#F0F0F0',
            borderRadius: '1.2rem',
          })}
        >
          <List spacing="xs" size="sm" mb={12} center>
            {data?.todos.map(todo => {
              return (
                <List.Item
                  onClick={() => updateTodoMarkDone(todo.id)}
                  key={`todo__list__${todo.id}`}
                  icon={
                    todo.isDone ? (
                      <ThemeIcon color="teal" size={24} radius="xl">
                        <IconCheck size={20} />
                      </ThemeIcon>
                    ) : (
                      <ThemeIcon color="gray" size={24} radius="xl">
                        <IconCheck size={20} />
                      </ThemeIcon>
                    )
                  }
                >
                  {todo.title}
                </List.Item>
              );
            })}
          </List>
          <AddTodo mutate={mutate} />
        </Box>
      </section>
    </>
  );
}

export default App;
