import { Notify } from 'quasar'

const handleError = (error) => {
  console.error('Full error object:', error)

  if (error.response?.data) {
    const errorData = error.response.data

    if (Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err) => {
        Notify.create({
          type: 'negative',
          message: `Error: ${err}`,
          position: 'top',
        })
      })
    } else {
      Notify.create({
        type: 'negative',
        message: `Error: ${errorData.message || 'Unknown error'}`,
        position: 'top',
      })
    }
  } else if (error.request) {
    console.error('No response received:', error.request)
    Notify.create({
      type: 'negative',
      message: 'Error: No response received from the server.',
      position: 'top',
    })
  } else {
    console.error('Error:', error.message)
    Notify.create({
      type: 'negative',
      message: `Error: ${error.message}`,
      position: 'top',
    })
  }
}

export default handleError
