import React from 'react'
import { render } from 'react-dom'

import useForm from '../../src'

const initialState = { name: '', bio: '' }

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
      <input type='text' name='name' value={values.name} />
      <input type='text' name='bio' value={values.bio} />
    </form>
  )
}

render(<Demo/>, document.querySelector('#demo'))
