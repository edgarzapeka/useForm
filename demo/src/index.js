import React from 'react'
import { render } from 'react-dom'

import useForm from '../../src'

const initialState = [...Array(65).fill(0)].reduce((acc, _, idx) => {
  acc[`name${idx}`] = ''
  return acc
}, { bio: '', name: '' })// { name: '', bio: '' }

function Demo () {
  const middleware = [
    async (ctx, fn) => {
      console.log(`hello world!`, ctx.values)
      fn()
    }
  ]
  const listeners = {
    name: [
      ({ type, value }) => {
        console.log(`type`, type)
        if (type === 'blur') {
          console.log(`this will only be shown on name#blur`)
        }
        console.log(`this will be shown every time a change happens on name`)
      }
    ]
  }
  const [form, { values }] = useForm(initialState, { middleware, listeners })
  return (
    <form ref={form}>
      {JSON.stringify(values)}
      <input type='text' name='name' />
      {[...Array(65).fill(0)].map((_, idx) => (<input key={idx} type='text' name={`name${idx}`} />))}
      <input type='text' name='bio' />
    </form>
  )
}

render(<Demo/>, document.querySelector('#demo'))
