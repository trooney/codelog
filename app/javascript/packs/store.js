import { createSlice, createSelector } from 'redux-starter-kit'
import { original } from 'immer'
import axios from 'axios'

export const appSlice = createSlice({
  initialState: {
    currentUser: null,
    hasLoaded: false,
    creationPending: false,
    requestCounters: {
      buckets: 0,
      tags: 0,
      searches: 0,
      starrings: 0
    }
  },
  reducers: {
    appLoaded: state => {
      state.appLoaded = true
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    incrementRequestCounter: (state, action) => {
      const type = action.payload || 'default'

      if (typeof state.requestCounters[type] === 'undefined') {
        state.requestCounters[type] = 0
      }

      state.requestCounters[type] += 1
    },
    decrementRequestCounter: (state, action) => {
      const type = action.payload || 'default'

      if (typeof state.requestCounters[type] === 'undefined') {
        state.requestCounters[type] = 0
      }

      state.requestCounters[type] -= 1
    },
    setCreationPending: (state, action) => {
      state.creationPending = action.payload
    }
  }
})

export const dataSlice = createSlice({
  initialState: {
    currentBucketId: null,
    currentTagId: null,
    currentNoteId: null,
    query: ''
  },
  reducers: {
    openBucket: (state, action) => {
      const { bucketId, tagId, noteId, query } = action.payload
      state.currentBucketId = action.payload
      state.currentTagId = null
      state.currentNoteId = null
    },
    openTag: (state, action) => {
      state.currentTagId = action.payload
    },
    closeTag: state => {
      state.currentTagId = null
    },
    openNote: (state, action) => {
      state.currentNoteId = action.payload
    },
    newNote: state => {
      state.currentNoteId = null
    },
    closeNote: state => {
      state.currentNoteId = null
    },
    setQuery: (state, action) => {
      state.query = action.payload
    },
    clearQuery: state => {
      state.query = ''
    }
  }
})

export const entitySlice = createSlice({
  initialState: {
    buckets: {},
    tags: {},
    notes: {},
    indexes: {
      starredNoteIds: [],
      searchNoteIds: []
    }
  },
  reducers: {
    addEntity: (state, action) => {
      const { entityType, entity } = action.payload

      state[entityType][entity.id] = entity
    },
    addEntities: (state, action) => {
      const { entityType, entities } = action.payload

      entities.forEach(entity => {
        state[entityType][entity.id] = entity
      })
    },
    removeEntity: (state, action) => {
      const { entityType, entityId } = action.payload

      delete state[entityType][entityId]
    },
    removeEntities: (state, action) => {
      const { entityType, entityIds } = action.payload

      entityIds.forEach(id => {
        delete state[entityType][id]
      })
    },
    replaceEntities: (state, action) => {
      const { entityType, entities } = action.payload

      state[entityType] = []

      entities.forEach(entity => {
        state[entityType][entity.id] = entity
      })
    },
    clearEntities: (state, action) => {
      const { entityType } = action.payload

      state[entityType] = []
    },
    addIndex: (state, action) => {
      const { indexType, entities } = action.payload

      entities.forEach(entity => {
        if (!state.indexes[indexType].includes(entity.id)) {
          state.indexes[indexType].unshift(entity.id)
        }
      })
    },
    clearIndex: (state, action) => {
      const indexType = action.payload

      state.indexes[indexType] = []
    },
    replaceIndex: (state, action) => {
      const { indexType, entities } = action.payload

      state.indexes[indexType] = entities.map(entity => entity.id)
    },
    addToIndex: (state, action) => {
      const { indexType, entityId } = action.payload

      if (!state.indexes[indexType].includes(entityId)) {
        state.indexes[indexType].unshift(entityId)
      }
    },
    removeFromIndex: (state, action) => {
      const { indexType, entityId } = action.payload

      const idx = state.indexes[indexType].indexOf(entityId)

      if (idx !== -1) {
        state.indexes[indexType].splice(idx, 1)
      }
    }
  }
})

function requestSemaphore(dispatch, name, fn) {
  dispatch(appSlice.actions.incrementRequestCounter(name))
  const promise = fn()

  promise.finally(() => {
    dispatch(appSlice.actions.decrementRequestCounter(name))
  })

  return promise
}

export const initializeStore = ({ currentUser, bucketId, tagId, query }) => {
  return async function(dispatch, _getState) {
    dispatch(appSlice.actions.setCurrentUser(currentUser))
    dispatch(dataSlice.actions.openBucket(bucketId))
    dispatch(dataSlice.actions.openTag(tagId))
    dispatch(dataSlice.actions.setQuery(query))
  }
}

export const fetchAllBuckets = () => {
  return async dispatch => {
    requestSemaphore(dispatch, 'buckets', () => {
      return axios.get(`/api/buckets/`)
    }).then(res => {
      dispatch(
        entitySlice.actions.replaceEntities({
          entityType: 'buckets',
          entities: res.data.buckets
        })
      )
    })
  }
}

export const fetchAllTags = function() {
  return async function(dispatch, getState) {
    const bucketId = getState().data.currentBucketId

    requestSemaphore(dispatch, 'tags', () => {
      return axios.get(`/api/buckets/${bucketId}/tags`)
    }).then(res => {
      dispatch(
        entitySlice.actions.replaceEntities({ entityType: 'tags', entities: res.data.tags })
      )
    })
  }
}

export const fetchAllSearchResults = () => {
  return (dispatch, getState) => {
    const query = getState().data.query
    const bucketId = getState().data.currentBucketId
    const tagId = getState().data.currentTagId || ''

    return requestSemaphore(dispatch, 'searches', () => {
      return axios.get(`/api/buckets/${bucketId}/search?tag_ids=${tagId}`, {
        params: {
          query: query
        }
      })
    }).then(res => {
      dispatch(
        entitySlice.actions.addEntities({
          entityType: 'notes',
          entities: res.data.results
        })
      )
      dispatch(
        entitySlice.actions.replaceIndex({
          indexType: 'searchNoteIds',
          entities: res.data.results
        })
      )

      return res
    })
  }
}

export const fetchStarredNotes = () => {
  return async (dispatch, getState) => {
    const { currentBucketId } = getState().data

    return requestSemaphore(dispatch, 'starrings', () => {
      return axios.get(`/api/buckets/${currentBucketId}/search?starred=true`)
    }).then(res => {
      dispatch(
        entitySlice.actions.addEntities({
          entityType: 'notes',
          entities: res.data.results
        })
      )
      dispatch(
        entitySlice.actions.replaceIndex({
          indexType: 'starredNoteIds',
          entities: res.data.results
        })
      )
    })
  }
}

export const openFirstSearchResultNote = () => {
  return async (dispatch, getState) => {
    const noteId = getState().entities.indexes.searchNoteIds[0]
    dispatch(dataSlice.actions.openNote(noteId))
  }
}

export const updateNote = (id, bucketId, textBlob, tagList) => {
  return async dispatch => {
    return requestSemaphore(dispatch, 'default', () => {
      return axios.put(`/api/buckets/${bucketId}/notes/${id}`, {
        note: {
          textBlob: textBlob,
          tagList: tagList
        }
      })
    }).then(res => {
      dispatch(entitySlice.actions.addEntities({ entityType: 'tags', entities: res.data.note.tags }))
      dispatch(fetchAllSearchResults())
    })
  }
}

export const createNote = (bucketId, textBlob, tagList) => {
  return async (dispatch, _getState) => {

    requestSemaphore(dispatch, 'default', () => {
      return axios.post(`/api/buckets/${bucketId}/notes`, {
        note: { textBlob: textBlob, tagList: tagList }
      })
    }).then(async res => {
      dispatch(entitySlice.actions.addEntities({ entityType: 'tags', entities: res.data.note.tags }))

      const searchPromise = dispatch(fetchAllSearchResults())
      searchPromise.finally(() => {
        dispatch(dataSlice.actions.openNote(res.data.note.id))
      })
    })
  }
}

export const trashNote = () => {
  return async (dispatch, getState) => {
    const { currentBucketId, currentNoteId } = getState().data

    dispatch(appSlice.actions.incrementRequestCounter())
    await axios.get(`/api/buckets/${currentBucketId}/notes/${currentNoteId}/trash`)
    dispatch(appSlice.actions.decrementRequestCounter())

    dispatch(dataSlice.actions.closeNote())

    dispatch(entitySlice.actions.removeFromIndex({ indexType: 'searchNoteIds', entityId: currentNoteId }))
    dispatch(entitySlice.actions.removeFromIndex({ indexType: 'starredNoteIds', entityId: currentNoteId }))
    dispatch(entitySlice.actions.removeEntity({ entityType: 'notes', entityId: currentNoteId }))
  }
}

export const starNote = () => {
  return async (dispatch, getState) => {
    const { currentBucketId, currentNoteId } = getState().data

    requestSemaphore(dispatch, 'star', () => {
      return axios.post(`/api/buckets/${currentBucketId}/stars`, {
        star: {
          noteId: currentNoteId
        }
      })
    }).then(res => {
      dispatch(entitySlice.actions.addToIndex({ indexType: 'starredNoteIds', entityId: currentNoteId }))
    })

  }
}

export const unstarNote = () => {
  return async (dispatch, getState) => {
    const { currentBucketId, currentNoteId } = getState().data

    requestSemaphore(dispatch, 'star', () => {
      return axios.delete(`/api/buckets/${currentBucketId}/stars/${currentNoteId}`)
    }).then(res => {
      dispatch(entitySlice.actions.removeFromIndex({ indexType: 'starredNoteIds', entityId: currentNoteId }))
    })

  }
}

// export const refreshEditorNote = () => {
//   return async (dispatch, getState) => {
//     const { currentBucketId, currentNoteId } = getState().data
//
//     dispatch(appSlice.actions.incrementRequestCounter())
//     const res = await axios.get(`/api/buckets/${currentBucketId}/notes/${currentNoteId}`)
//     const newNote = res.data.note
//     dispatch(appSlice.actions.decrementRequestCounter())
//
//     dispatch(entitySlice.actions.addEntity({ entityType: 'notes', entity: newNote }))
//   }
// }

export const getCurrentUser = createSelector(
  [state => state.app.currentUser],
  currentUser => currentUser
)

export const getCurrentBucket = createSelector(
  [state => state.data.currentBucketId, state => state.entities.buckets],
  (currentBucketId, buckets) => buckets[currentBucketId]
)

export const getCurrentQuery = createSelector(
  [state => state.data.query],
  (query) => query
)

export const getCurrentTag = createSelector(
  [state => state.data.currentTagId, state => state.entities.tags],
  (currentTagId, tags) => tags[currentTagId]
)

export const getCurrentNote = createSelector(
  [state => state.data.currentNoteId, state => state.entities.notes],
  (currentNoteId, notes) => notes[currentNoteId]
)

export const getBuckets = createSelector(
  [state => state.entities.buckets],
  buckets => {
    return Object.values(buckets).sort((a, b) => a.name.localeCompare(b.name))
  }
)

export const getTags = createSelector(
  [state => state.entities.tags],
  tags => {
    return Object.values(tags).sort((a, b) => a.name.localeCompare(b.name))
  }
)

export const getStarredNotes = createSelector(
  [state => state.entities.indexes.starredNoteIds, state => state.entities.notes],
  (index, notes) => index.map(id => notes[id] || {})
)

export const getUntaggedNotes = createSelector(
  [state => Object.values(state.entities.notes)],
  (notes) => notes.filter(note => note.tags.length === 0)
)

export const getSearchNotes = createSelector(
  [state => state.entities.indexes.searchNoteIds, state => state.entities.notes],
  (index, notes) => index.map(id => notes[id])
)

export const getIsRequestPending = createSelector(
  ['app.requestCounters'],
  requestCounters => {
    return Object.values(requestCounters).reduce((a, b) => a + b, 0) > 0
  }
)

export const getIsSearchFetching = createSelector(
  ['app.requestCounters.search'],
  requestCounter => {
    return requestCounter > 0
  }
)
