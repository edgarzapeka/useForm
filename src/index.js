import React, { useEffect, useReducer, useRef, useCallback } from 'react'
import compose from './compose'

const SUBMIT = 'SUBMIT'
const ERROR = 'ERROR'
const CHANGE = 'CHANGE'

const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE:
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.name]: action.payload.value
        }
      }
    case SUBMIT:
      console.log(action.payload, `submit`)
      return {
        ...state,
        values: action.payload
      }
    case ERROR:
      return {
        ...state,
        errors: action.payload
      }
    default:
      return state
  }
}

function useForm (
  initialValues = {},
  {
    errors = {},
    middleware = [],
    listeners = {}
  }
) {
  const formRef = useRef()
  const [state, dispatch] = useReducer(reducer, { values: initialValues, errors })
  const onSubmit = useCallback(async evt => {
    evt.preventDefault()
    const fn = compose(middleware)
    const elements = evt.target.children

    const createContext = () => {
      const values = [...elements].reduce((acc, { name, value }) => {
        if (!name || !value) return acc
        return {
          ...acc,
          [name]: value
        }
      }, {})
      return {
        ...state,
        values: {
          ...state.values,
          ...values
        },
        evt
      }
    }

    const onSubmit = async () => {
      const ctx = createContext()
      handleSubmit(ctx, fn)
    }

    async function handleSubmit (ctx, fn) {
      try {
        const values = await fn(ctx, fn)
        dispatch({ type: SUBMIT, payload: values })
        return values
      } catch (error) {
        console.log(`error`, error)
        dispatch({ type: ERROR, payload: error })
        return error
      }
    }

    return onSubmit()
  }, [middleware, state.values])

  const onInputChange = useCallback(evt => {
    const { name, value } = evt.target
    if (value !== state.values[name]) {
      return undefined
    }
    const payload = { name, value }
    const hasListeners = listeners[name] && listeners[name].length > 0

    if (hasListeners) {
      listeners[name].forEach(notifyListener)
    }

    function notifyListener(listener) {
      return typeof listener === 'function' && listener({ type: evt.type, value })
    }

    dispatch({ type: CHANGE, payload })
  }, [listeners, state.values])

  const setFormRef = el => (formRef.current = el)

  useEffect(() => {
    const form = formRef.current
    const inputs = Array.from(form.children)
    form.addEventListener('submit', onSubmit)
    inputs.forEach(input => {
      input.addEventListener('input', onInputChange)
      input.addEventListener('blur', onInputChange)
      input.addEventListener('focus', onInputChange)
    })
    return () => {
      form.removeEventListener('submit', onSubmit)
      inputs.forEach(input => {
        input.removeEventListener('input', onInputChange)
        input.removeEventListener('blur', onInputChange)
        input.removeEventListener('focus', onInputChange)
      })
    }
  }, [])
  
  return [setFormRef, state]
}

export default useForm