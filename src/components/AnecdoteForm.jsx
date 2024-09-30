import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNotification } from '../NotificationContext'

const AnecdoteForm = () => {
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const newAnecdoteMutation = useMutation({
    mutationFn: (newAnecdote) => axios.post('http://localhost:3001/anecdotes', newAnecdote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: `Anecdote "${content}" added` } })
      setContent('')
    },
  })

  const onSubmit = (event) => {
    event.preventDefault()
    if (content.length < 5) {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Too short anecdote, must have lenght 5 or more' } })
    }
    const generateId = () => (Math.floor(Math.random() * 90000) + 10000).toString()

    const newAnecdote = { 
      content,
      id: generateId(),
      votes: 0
    }

    newAnecdoteMutation.mutate(newAnecdote)
  }

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onSubmit}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
