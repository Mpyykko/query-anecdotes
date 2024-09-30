import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const AnecdoteForm = () => {
  const [content, setContent] = useState('')

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: (newAnecdote) => axios.post('http://localhost:3001/anecdotes', newAnecdote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const onSubmit = (event) => {
    event.preventDefault()
    if (content.length < 5) {
      alert('Anecdote must be at least 5 characters long')
      return
    }
    const generateId = () => (Math.floor(Math.random() * 90000) + 10000).toString()

    const newAnecdote = { 
      content,
      id: generateId(),
      votes: 0
      
    }

 
    newAnecdoteMutation.mutate(newAnecdote)
    setContent('')
  }

  return (
    <div>
      <h3>create new</h3>
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
