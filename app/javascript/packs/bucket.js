import App from './BucketApp'
import React from 'react'
import { render } from 'react-dom'
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'

import { appSlice, dataSlice, entitySlice } from './store'

import { filter, mapTo, take, finalize, distinctUntilChanged, share, tap, delay } from 'rxjs/operators'
import { createEpicMiddleware, combineEpics } from 'redux-observable'

import { ofType } from 'redux-observable'

import { from, of, concat } from 'rxjs'
import { debounceTime, map, switchMap, switchAll, mergeMap, startsWith, endsWith, delayWhen } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import axios from "axios"

const note = {
  bucketId: 5,
  createdAt: '2019-07-31T03:58:40.000Z',
  updatedAt: '2019-07-31T03:58:40.000Z',
  creatorId: 1,
  discardedAt: null,
  htmlBlob: '<p>My custom thing</p>',
  id: 999,
  tags: []
}

// const searchEpic1 = action$ =>
//   action$.pipe(
//     ofType('setQuery'),
//     debounceTime(1000),
//     switchMap(action =>
//       concat(
//         of({
//           type: 'addEntity',
//           payload: {
//             entityType: 'notes',
//             entity: note
//           }
//         }),
//         of({
//           type: 'addIndex',
//           payload: {
//             indexType: 'searchNoteIds',
//             entities: [note]
//           }
//         })
//       )
//     )
//   )

// const searchEpic2 = action$ =>
//   action$.pipe(
//     ofType('setQuery'),
//     debounceTime(1000),
//     switchMap(action => {
//       const query = action.payload
//       return ajax(`/api/buckets/5/search?query=${query}`).pipe(
//         map(ajaxResponse => ajaxResponse.response)
//       )
//     }),
//     switchMap(response =>
//       concat(
//         of(() => {
//             console.log('first', response)
//             return {action: ''}
//         }),
//         of({
//           type: 'addEntities',
//           payload: {
//             entityType: 'notes',
//             entities: response.results
//           }
//         }),
//         of({
//           type: 'clearIndex',
//           payload: {
//             indexType: 'searchNoteIds'
//           }
//         }),
//         of({
//           type: 'addIndex',
//           payload: {
//             indexType: 'searchNoteIds',
//             entities: response.results
//           }
//         })
//       )
//     )
//   )

const searchEpic3 = (action$, state$) =>
  action$.pipe(
    ofType('setQuery'),
    debounceTime(1000),
    switchMap(action => {
      const query = action.payload
      const tagId = state$.value.data.currentTagId || ''

      return ajax(`/api/buckets/5/search?query=${query}&tag_ids=${tagId}`).pipe(
        map(ajaxResponse => ajaxResponse.response)
      )
    }),
    switchMap(response =>
      concat(
        of(appSlice.actions.decrementRequestCounter('searches')),
        of(dataSlice.actions.addEntities({ entityType: 'notes', entities: response.results })),
        of(dataSlice.actions.clearIndex({ indexType: 'searchNoteIds' })),
        of(
          dataSlice.actions.addIndex({
            indexType: 'searchNoteIds',
            entities: response.results
          })
        )
      )
    )
  )

const ajaxRequestForSearchEpic4 = (action, state) => {
  const query = action.payload
  const tagId = state.value.data.currentTagId || ''

  return ajax(`/api/buckets/5/search?query=${query}&tag_ids=${tagId}`)
}

const searchEpic4 = (action$, state$) =>
  action$.pipe(
    ofType('setQuery'),
    debounceTime(1000),
    switchMap(action =>
      concat(
        of(appSlice.actions.incrementRequestCounter('searches')),
        from(
          ajaxRequestForSearchEpic4(action, state$).pipe(
            map(ajaxResponse => ajaxResponse.response),
            switchMap(response =>
              concat(
                of(
                  dataSlice.actions.addEntities({
                    entityType: 'notes',
                    entities: response.results
                  })
                ),
                of(dataSlice.actions.clearIndex({ indexType: 'searchNoteIds' })),
                of(
                  dataSlice.actions.addIndex({
                    indexType: 'searchNoteIds',
                    entities: response.results
                  })
                )
              )
            )
          )
        ),
        of(appSlice.actions.decrementRequestCounter('searches'))
      )
    )
  )

const ajaxRequestForSearchEpic5 = (action, state) => {
  const bucketId = state.value.data.currentBucketId
  const query = action.payload
  const tagId = state.value.data.currentTagId || ''

  return ajax(`/api/buckets/${bucketId}/search?query=${query}&tag_ids=${tagId}`)
}

const searchEpic5 = (action$, state$) =>
  action$.pipe(
    ofType('setQuery'),
    debounceTime(1000),
    switchMap(action =>
      concat(
        of(appSlice.actions.incrementRequestCounter('searches')),
        from(
          ajaxRequestForSearchEpic5(action, state$).pipe(
            map(ajaxResponse => ajaxResponse.response),
            switchMap(response =>
              concat(
                of(
                  dataSlice.actions.addEntities({
                    entityType: 'notes',
                    entities: response.results
                  })
                ),
                of(dataSlice.actions.clearIndex({ indexType: 'searchNoteIds' })),
                of(
                  dataSlice.actions.addIndex({
                    indexType: 'searchNoteIds',
                    entities: response.results
                  })
                )
              )
            )
          )
        ),
        of(appSlice.actions.decrementRequestCounter('searches'))
      )
    )
  )

// const inputToSave$ = keyup$.pipe(
//   debounceTime(200),
//   map(e => e.target.value),
//   distinctUntilChanged(),
//   share()
// );
const inputToSaveEpic = (action$, state$) =>
  action$.pipe(
    ofType('editorKeyDown'),
    debounceTime(250),
    // tap(v => console.log('inputToSaveEpic', v)),
    map(action => {
      return {
        type: 'editorUpdated',
        payload: action.payload
      }
    }),
    distinctUntilChanged(),
    share()
  )

// const savesInProgress$ = inputToSave$.pipe(
//   mapTo(of('Saving')),
//   tap(_ => savesInProgress++)
// );
const savesInProgress = (action$, state$) =>
  action$.pipe(
    ofType('editorUpdated'),
    // tap(v => console.log('savesInProgress', v)),
    mapTo({ type: 'savesInProgress' })
  )

// const savesCompleted = (action$, state$) =>
//   action$.pipe(
//     ofType('foobar'),
//     mergeMap(action => {
//       const bucketId = state$.value.data.currentBucketId
//       const noteId = state$.value.data.currentNoteId
//       console.log('mergeMap', action, bucketId, noteId)
//       return ajax({
//         method: 'PUT',
//         url: `/api/buckets/${bucketId}/notes/${noteId}`,
//         headers: { 'Content-Type': 'application/json' },
//         body: {
//           note: {
//             textBlob: action.payload
//           }
//         }
//       }).pipe(
//         map(r => ({ type: 'done', payload: 'whatever'}))
//       )
//     })
//   )

const savesCompleted = (action$, state$) =>
  action$.pipe(
    ofType('editorUpdated'),
    mergeMap(action => {
      const bucketId = state$.value.data.currentBucketId
      const noteId = state$.value.data.currentNoteId

      return ajax({
        method: 'PUT',
        url: `/api/buckets/${bucketId}/notes/${noteId}`,
        headers: { 'Content-Type': 'application/json' },
        body: {
          note: {
            textBlob: action.payload.textBlob,
            tagList: action.payload.tagList,
          }
        }
      }).pipe(
        map(r => ({ type: 'savesComplete'  }))
      )
    })
  )

const both = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === 'savesInProgress' || action.type === 'savesComplete'),
    debounceTime(1500),
    // switchAll(),
    // tap(r => console.log('both', r)),
    // switchMap(r => r),
    // map(r => ({ type: 'theSaveState', payload: r })),
    switchMap(r => of({ type: 'theSaveState', payload: r }))
  )

// export const rootEpic = combineEpics(searchEpic5)
// export const rootEpic = combineEpics()
export const rootEpic = combineEpics(inputToSaveEpic, savesInProgress, savesCompleted, both)
const epicMiddleware = createEpicMiddleware()

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    data: dataSlice.reducer,
    entities: entitySlice.reducer
  },
  middleware: [...getDefaultMiddleware(), epicMiddleware]
})

epicMiddleware.run(rootEpic)

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('BucketApp')
  const props = JSON.parse(el.getAttribute('data-react'))

  const { currentUser, bucketId, tagId, query } = props

  store.dispatch(appSlice.actions.setCurrentUser(currentUser))
  store.dispatch(dataSlice.actions.openBucket(bucketId))
  store.dispatch(dataSlice.actions.openTag(tagId))
  store.dispatch(dataSlice.actions.setQuery(query))

  render(<App store={store} />, el)
})

store.dispatch({ type: 'PING' })
