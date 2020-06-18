import App from './BucketApp'
import React from 'react'
import { render } from 'react-dom'
import { configureStore } from 'redux-starter-kit'

import { appSlice, dataSlice, entitySlice } from './store'

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    data: dataSlice.reducer,
    entities: entitySlice.reducer
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('BucketApp')
  const props = JSON.parse(el.getAttribute('data-react'))

  const { currentUser, bucketId, tagId, query } = props

  store.dispatch(appSlice.actions.setCurrentUser(currentUser))
  store.dispatch(dataSlice.actions.openBucket(bucketId))
  store.dispatch(dataSlice.actions.openTag(tagId))
  store.dispatch(dataSlice.actions.setQuery(query))

  render(<App store={store} />, el)
}, { passive: true })
