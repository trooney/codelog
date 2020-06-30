import { hot } from 'react-hot-loader/root'
import React, { useState, useEffect } from 'react'

import classNames from 'classnames'

import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-github'

import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { useDebounce, useDebounceCallback } from '@react-hook/debounce'

import { Provider, useSelector, useDispatch } from 'react-redux'

import {
  appSlice,
  dataSlice,
  fetchAllTags,
  fetchAllBuckets,
  fetchStarredNotes,
  fetchAllSearchResults,
  updateNote,
  createNote,
  trashNote,
  starNote,
  unstarNote,
  openFirstSearchResultNote,
  getIsRequestPending,
  getIsSearchFetching,
  getCurrentUser,
  getCurrentBucket,
  getCurrentQuery,
  getCurrentTag,
  getCurrentNote,
  getBuckets,
  getTags,
  getStarredNotes,
  getUntaggedNotes,
  getSearchNotes
} from './store'

import { IconRegular, IconSolid, SidebarIcon } from './Buttons'

const SidebarNavList = ({
  items,
  activeItemId,
  itemClick,
  name,
  contentField,
  itemIcon,
  listIcon,
  initialItemsVisibilityState
}) => {
  const [areItemsVisible, setItemsVisibility] = useState(initialItemsVisibilityState)

  const handleVisibilityToggleClick = () => {
    setItemsVisibility(!areItemsVisible)
  }

  return (
    <div className="sidebar-nav-container">
      <div className="sidebar-nav-header" onClick={e => handleVisibilityToggleClick()}>
        {areItemsVisible ? (
          <SidebarIcon name="caret-down " />
        ) : (
          <SidebarIcon name="caret-right" />
        )}
        <SidebarIcon name={listIcon} />
        <span className="ml-1">{name}</span>
      </div>
      {areItemsVisible && (
        <nav className="sidebar-nav-list">
          {items.length === 0 && <div className="sidebar-nav-link">No {name} found</div>}
          {items.map(item => (
            <div
              key={item.id}
              data-id={item.id}
              onClick={e => itemClick(item.id)}
              className={classNames('sidebar-nav-link', {
                'sidebar-nav-link-active': activeItemId === item.id
              })}
            >
              <SidebarIcon name={itemIcon} />
              <span className="ml-1">{item[contentField]}</span>
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}

const SidebarNavSingle = ({ name, icon, click, active }) => {
  return (
    <div className="sidebar-nav-container">
      <div
        className={classNames('sidebar-nav-header', {
          'sidebar-nav-header-active': active
        })}
        onClick={e => click()}
      >
        <SidebarIcon />
        <SidebarIcon name={icon} />
        <span className="ml-1">{name}</span>
      </div>
    </div>
  )
}

const SidebarContainer = () => {
  const dispatch = useDispatch()

  const buckets = useSelector(state => getBuckets(state))
  const starredNotes = useSelector(state => getStarredNotes(state))
  const tags = useSelector(state => getTags(state))
  const untaggedNotes = useSelector(state => getUntaggedNotes(state))

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const handleSidebarVisibleToggleClick = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const handleNewNoteClick = () => {
    dispatch(dataSlice.actions.clearQuery())

    dispatch(createNote())
  }

  const handleAllNotesClick = () => {
    dispatch(dataSlice.actions.closeTag())
    dispatch(dataSlice.actions.clearQuery())
  }

  const handleBucketClick = bucketId => {
    dispatch(dataSlice.actions.openBucket(bucketId))
  }

  const handleStarredNoteClick = noteId => {
    dispatch(dataSlice.actions.closeTag())
    dispatch(dataSlice.actions.openNote(noteId))
  }

  const handleTagClick = tagId => {
    dispatch(dataSlice.actions.closeNote())
    dispatch(dataSlice.actions.openTag(tagId))
  }

  return (
    <Sidebar
      buckets={buckets}
      tags={tags}
      starredNotes={starredNotes}
      untaggedNotes={untaggedNotes}
      handleSidebarVisibleToggleClick={handleSidebarVisibleToggleClick}
      handleNewNoteClick={handleNewNoteClick}
      handleAllNotesClick={handleAllNotesClick}
      handleBucketClick={handleBucketClick}
      handleStarredNoteClick={handleStarredNoteClick}
      handleTagClick={handleTagClick}
      isSidebarVisible={isSidebarVisible}
    />
  )
}

const Sidebar = ({
  buckets,
  tags,
  starredNotes,
  untaggedNotes,
  isSidebarVisible,
  handleSidebarVisibleToggleClick,
  handleNewNoteClick,
  handleAllNotesClick,
  handleBucketClick,
  handleStarredNoteClick,
  handleTagClick
}) => {
  const currentUser = useSelector(state => getCurrentUser(state))
  const currentBucket = useSelector(state => getCurrentBucket(state))
  const currentTag = useSelector(state => getCurrentTag(state))

  const currentBucketName = currentBucket && currentBucket.name
  const currentBucketFirstCharacter = currentBucket && currentBucket.name[0]
  const currentUserDisplayName = currentUser.displayName

  const query = useSelector(state => state.data.query)
  const isAllNotesActive = !currentTag && query.length === 0

  const sidebarClass = classNames(
    'sidebar-container',
    'grid-pane-col',
    isSidebarVisible ? 'sidebar-lg' : 'sidebar-sm'
  )

  const smallNav = (
    <React.Fragment>
      <section className="grid-pane-fixed">
        <div className="pl-2 pr-2 pt-3 pb-1">
          <div className="sidebar-emblem-container">
            <div className="sidebar-emblem-badge d-flex align-items-center justify-content-center">
              <span>{currentBucketFirstCharacter}</span>
            </div>
          </div>
        </div>
        <div className="pl-2 pr-2 pt-1 pb-3">
          <div className="sidebar-emblem-container" onClick={e => handleNewNoteClick()}>
            <div className="sidebar-emblem-badge d-flex align-items-center justify-content-center">
              <span>
                <IconSolid name="plus" />
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="grid-pane-row-dynamic">
        <nav className="sidebar-nav-list" onClick={e => handleSidebarVisibleToggleClick()}>
          <div className="sidebar-nav-link">
            <IconSolid name="boxes" />
          </div>
          <div className="sidebar-nav-link">
            <IconSolid name="star" />
          </div>
          <div className="sidebar-nav-link">
            <IconSolid name="tags" />
          </div>
        </nav>
      </section>
    </React.Fragment>
  )

  const largeNav = (
    <React.Fragment>
      <section className="grid-pane-row-fixed">
        <div className="pl-2 pt-3 pb-1">
          <div className="sidebar-emblem-container">
            <div className="sidebar-emblem-badge d-flex align-items-center justify-content-center">
              <span>{currentBucketFirstCharacter}</span>
            </div>
            <div className="sidebar-emblem-text">
              <span>{currentBucketName}</span>
            </div>
          </div>
          <div className="sidebar-name-container">{currentUserDisplayName}</div>
          <div className="sidebar-quick-actions">
            <div>Logout</div>
            <div>Settings</div>
          </div>
        </div>
        <div className="pl-2 pt-1 pb-3">
          <div className="sidebar-emblem-container" onClick={e => handleNewNoteClick()}>
            <div className="sidebar-emblem-badge d-flex align-items-center justify-content-center">
              <span>
                <IconSolid name="plus" />
              </span>
            </div>
            <div className="sidebar-emblem-text">
              <span>New Note</span>
            </div>
          </div>
        </div>
      </section>
      <section className="grid-pane-row-dynamic">
        <SidebarNavList
          items={buckets}
          activeItemId={currentBucket && currentBucket.id}
          name="Buckets"
          contentField="name"
          itemClick={id => handleBucketClick(id)}
          itemIcon="boxes"
          listIcon="box"
          initialItemsVisibilityState={false}
        />
        <SidebarNavSingle
          icon="file-alt"
          name="All Notes"
          click={handleAllNotesClick}
          active={isAllNotesActive}
        />
        <SidebarNavList
          items={starredNotes}
          activeItemId={-1}
          name="Starred"
          contentField="textBlob"
          itemClick={id => handleStarredNoteClick(id)}
          itemIcon="book"
          listIcon="star"
          initialItemsVisibilityState={true}
        />
        <SidebarNavList
          items={tags}
          activeItemId={currentTag && currentTag.id}
          name="Tags"
          contentField="name"
          itemClick={id => handleTagClick(id)}
          itemIcon="tag"
          listIcon="tags"
          initialItemsVisibilityState={true}
        />
        <SidebarNavList
          items={untaggedNotes}
          activeItemId={-1}
          name="Untagged"
          contentField="textBlob"
          itemClick={id => handleStarredNoteClick(id)}
          itemIcon="dot-circle"
          listIcon="database"
          initialItemsVisibilityState={true}
        />
      </section>
    </React.Fragment>
  )

  return (
    <div className={sidebarClass}>
      {isSidebarVisible ? largeNav : smallNav}
      <section className="grid-pane-row-fixed">
        <div
          className="sidebar-visibility-toggler"
          onClick={e => handleSidebarVisibleToggleClick()}
        >
          {isSidebarVisible ? (
            <IconSolid name="angle-double-left" />
          ) : (
            <IconSolid name="angle-double-right" />
          )}
        </div>
      </section>
    </div>
  )
}

const LoadingNote = () => {
  return (
    <div className="resource-item-pending">
      <div className="text-input__loading">
        <div className="text-input__loading--line" />
        <div className="text-input__loading--line" />
        <div className="text-input__loading--line" />
        <div className="text-input__loading--line" />
        <br />
        <div className="text-input__loading--line" />
      </div>
    </div>
  )
}

const ExpandButton = ({ handleClick }) => {
  const togglerStyles = true ? { cursor: 'pointer' } : { opacity: 0.4 }

  return (
    <span onClick={e => handleClick()}>
      <IconSolid name="expand-arrows-alt" style={togglerStyles} />
    </span>
  )
}

const StarButton = ({ canToggle, isToggled, handleClick }) => {
  const name = 'star'
  const clickHandler = canToggle ? handleClick : () => {}

  const togglerStyles = canToggle ? { cursor: 'pointer' } : { opacity: 0.4 }

  return (
    <span onClick={e => clickHandler()}>
      { isToggled ? <IconSolid name={name} style={togglerStyles} /> : <IconRegular name={name} style={togglerStyles} />}
    </span>
  )
}

const TrashButton = ({ canToggle, isToggled, handleClick }) => {
  const name = 'trash-alt'
  const clickHandler = canToggle ? handleClick : () => {}

  const togglerStyles = canToggle ? { cursor: 'pointer' } : { opacity: 0.4 }

  return (
    <span onClick={e => clickHandler()}>
      <IconRegular name={name} style={togglerStyles} />
    </span>
  )
}

const EditorContainer = ({ canTrash, isTrashed }) => {
  return <Editor />
}

const Editor = () => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()

  const currentBucketId = state.data.currentBucketId
  const currentNoteId = state.data.currentNoteId
  const currentNote = useSelector(state => getCurrentNote(state))

  const [editorContent, setEditorContent] = useState('')
  const [editorTagBlob, setEditorTagBlob] = useState('')

  useEffect(() => {
    if (currentNote) {
      setEditorContent(currentNote.textBlob)
      setEditorTagBlob(currentNote.tags.map(t => t.name).join(','))
    } else {
      setEditorContent('')
      setEditorTagBlob('')
    }
  }, [currentNote])

  const canTrash = !!currentNote
  const isTrashed = false

  const canStar = !!currentNote
  const isStarred = state.entities.indexes.starredNoteIds.includes(currentNoteId)

  const handleAceChange = useDebounceCallback((val) => {
    setEditorContent(val)
    dispatch(updateNote(currentNoteId, currentBucketId, val, editorTagBlob))
  }, 1500)

  const updateTagBlob = useDebounceCallback((val) => {
    dispatch(updateNote(currentNoteId, currentBucketId, editorContent, val))
  }, 1500)

  const handleOnTrashClick = () => {
    const result = confirm('Trash?')

    if (result) {
      dispatch(trashNote(currentNoteId))
    }
  }

  const handleOnStarClick = () => {
    if (isStarred) {
      dispatch(unstarNote(currentNoteId))
    } else {
      dispatch(starNote(currentNoteId))
    }
  }

  const handleOnExpandClick = () => {
    //  do nothing
  }

  return (
    <div className="h-100">
      <div className="d-flex flex-column h-100">
        <div className="border-bottom p-2 pt-3 pb-3 text-right d-flex">
          <div>
            <ExpandButton name="expand-arrows-alt" handleClick={handleOnExpandClick} />
          </div>
          <div className="ml-auto d-flex">
            <div className="mr-3">
              <StarButton
                canToggle={canStar}
                isToggled={isStarred}
                handleClick={handleOnStarClick}
              />
            </div>
            <div className="mr-2">
              <TrashButton
                canToggle={canTrash}
                isToggled={isTrashed}
                handleClick={handleOnTrashClick}
              />
            </div>
          </div>
        </div>
        <AceEditor
          height="100%"
          width="100%"
          value={editorContent}
          highlightActiveLine={false}
          showGutter={false}
          mode="markdown"
          theme="github"
          showPrintMargin={false}
          onChange={handleAceChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: Infinity }}
        />
        <div className="d-flex p-1 border-top">
          <TagInput tagBlob={editorTagBlob} setTagBlob={setEditorTagBlob} />
        </div>
      </div>
    </div>
  )
}

const TagInput = ({ tagBlob, setTagBlob }) => {

  const tagBlobParts = tagBlob
    .split(',')
    .map(s => (s || '').trim())
    .filter(str => str.length > 0)

  const [tagInputText, setTagInputText] = useState('')

  const addTextToTagBlob = str => {
    if (!tagBlobParts.includes(str)) {
      const newVal = tagBlobParts.concat(str).join(',')

      setTagBlob(newVal)
    }
  }

  const removeLastFromTagBlob = () => {
    tagBlobParts.pop()

    const newVal = tagBlobParts.join(',')
    setTagBlob(newVal)
  }

  const removeFromTagBlobAtIndex = index => {
    tagBlobParts.splice(index, 1)

    const newVal = tagBlobParts.join(',')
    setTagBlob(newVal)
  }

  const handleInputKeyDown = e => {
    const COMMA_KEY = 188
    if (e.keyCode === COMMA_KEY) {
      e.preventDefault()
      return
    }

    const TAB_KEY = 9
    if (e.keyCode === TAB_KEY) {
      e.preventDefault()
      addTextToTagBlob(e.target.value)
      setTagInputText('')
    }

    const BACKSPACE_KEY = 8
    if (e.keyCode === BACKSPACE_KEY && tagInputText === '') {
      e.preventDefault()
      removeLastFromTagBlob()
    }
  }
  const handleInputChange = e => {
    setTagInputText(e.target.value)
  }

  return (
    <div className="d-flex">
      <IconSolid name="tags" className="mr-1 text-muted" />
      <div className="d-flex ml-2">
        {tagBlobParts.map((s, i) => (
          <div key={i} className="tag-chip d-flex align-items-center mr-2">
            {s}
            <IconRegular
              name="times-circle"
              style={{ marginLeft: '.25rem', color: 'rgba(0,0,0,0.35)' }}
              onClick={e => removeFromTagBlobAtIndex(i)}
            />
          </div>
        ))}
      </div>
      <div className="tagbox-container d-flex align-items-center">
        <input
          className="form-control form-control-sm tagbox-text-field"
          value={tagInputText}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
          placeholder="Add Tags"
        />
      </div>
    </div>
  )
}

const Search = () => {
  const dispatch = useDispatch()

  const query = useSelector(state => getCurrentQuery(state))
  const currentTag = useSelector(state => getCurrentTag(state))

  const [searchQuery, setSearchQuery] = useState(query)

  const updateQuery = useDebounceCallback(queryStr => {
    console.log('updating')
    dispatch(dataSlice.actions.setQuery(queryStr))
  }, 500)

  const handleTextFieldChange = queryStr => {
    setSearchQuery(queryStr)
    updateQuery(queryStr)
  }

  const handleClearClick = () => {
    dispatch(dataSlice.actions.clearQuery())
  }

  const handleChipRemoveClick = () => {
    dispatch(dataSlice.actions.closeTag())
  }

  const CurrentTag = () => (
    <div
      className="tag-chip tag-chip-removable"
      onClick={e => handleChipRemoveClick()}
    >
      {currentTag.name}
      <IconRegular name="times-circle" />
    </div>
  )

  return (
    <div className="border-bottom pb-2">
      <div className="d-flex pl-3 pr-3 pt-3">
        <input
          type="text"
          className="form-control searchbox-text-field"
          value={searchQuery}
          onChange={e => handleTextFieldChange(e.target.value)}
          placeholder="Search"
        />
        <button
          className="btn btn-link btn-sm ml-1"
        >
          <IconRegular name="times-circle" onClick={e => handleClearClick()} />
        </button>
      </div>
      {currentTag && (
        <div className="pl-3 pr-3 pt-2 pb-1">
          <CurrentTag />
        </div>
      )}
    </div>
  )
}

const SearchResults = () => {
  const dispatch = useDispatch()

  const notes = useSelector(state => getSearchNotes(state))
  const currentNoteId = useSelector(state => state.data.currentNoteId)

  const query = useSelector(state => state.data.query)
  const isCreationPending = useSelector(state => state.app.creationPending)
  const isSearchFetching = useSelector(state => getIsSearchFetching(state))

  const handleTagClick = tagId => {
    dispatch(dataSlice.actions.openTag(tagId))
  }

  const classNamesForNote = note => {
    return classNames({
      'resource-item': true,
      active: note.id === currentNoteId
    })
  }

  if (isSearchFetching) {
    return (
      <div>
        {isCreationPending && <LoadingNote />}
        <div>Searching</div>
      </div>
    )
  }

  const possibleNoResults = () => {
    if (notes.length === 0 && query.length > 0) {
      return (
        <div className="p-3">
          <i>Nothing found for this search.</i>
        </div>
      )
    }

    if (notes.length === 0) {
      return (
        <div className="p-3">
          <i>Nothing here. Why not create something?</i>
        </div>
      )
    }
  }

  return (
    <div className="resource-item-list">
      {possibleNoResults()}
      {notes.map((note, i) => (
        <div
          className={classNamesForNote(note)}
          key={i}
          data-id={note.id}
          onClick={e => dispatch(dataSlice.actions.openNote(note.id))}
        >
          <div className="resource-header" />
          <div className="resource-body">
            <div
              className="dangerHtml"
              dangerouslySetInnerHTML={{ __html: note.htmlBlob || note.textBlob }}
            />
          </div>
          <div className="resource-footer">
            <div className="tag-list">
              {note.tags.map(tag => (
                <div
                  className="tag-chip mr-1"
                  key={tag.id}
                  onClick={e => handleTagClick(tag.id)}
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <div className="resource-updated mt-2 text-muted">
              {formatDistanceToNow(parseISO(note.updatedAt))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const BucketApp = () => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()

  const bucketId = state.data.currentBucketId
  const tagId = state.data.currentTagId
  const query = state.data.query

  const isRequestPending = getIsRequestPending(state)

  // Initial app load
  useEffect(() => {
    console.log('useEffect dispatch', [dispatch])
    dispatch(fetchAllBuckets())
    dispatch(fetchAllTags())
    dispatch(fetchStarredNotes())
    dispatch(fetchAllSearchResults()).then(() => {
      dispatch(openFirstSearchResultNote())
    })
  }, [dispatch])

  // Switching buckets
  useEffect(() => {
    if (!state.app.appLoaded) return
    // console.log('useEffect bucketId [dispatch, appLoaded, bucketId]', [dispatch, bucketId, state.app.appLoaded])

    dispatch(dataSlice.actions.closeTag())
    dispatch(dataSlice.actions.clearQuery())

    dispatch(fetchAllBuckets())
    dispatch(fetchAllTags())
    dispatch(fetchStarredNotes())
    dispatch(fetchAllSearchResults())
  }, [dispatch, state.app.appLoaded, bucketId])

  useEffect(() => {
    if (!state.app.appLoaded) return

    // console.log('useEffect query [dispatch, appLoaded, tagId, query]', [dispatch, tagId])
    dispatch(fetchAllSearchResults()).then(() => {
      dispatch(openFirstSearchResultNote())
    })

  }, [dispatch, state.app.appLoaded, tagId, query])

  useEffect(() => {
    // console.log('useEffect history [bucketId, tagId, query]', [bucketId, tagId, query])
    history.pushState(
      {},
      'TODO',
      `/web/buckets/${bucketId}?tag_ids=${tagId || ''}&query=${query || ''}`
    )
  }, [dispatch, bucketId, tagId, query])

  if (!state.app.appLoaded) {
    dispatch(appSlice.actions.appLoaded())
  }

  const loadingClasses = classNames('p-2 bg-dark text-light', { 'd-none': !isRequestPending })

  return (
    <React.Fragment>
      <div
        className={loadingClasses}
        style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 999 }}
      >
        <div>Loading</div>
      </div>
      <div className="row no-gutters h-100">
        <SidebarContainer />
        <div className="col-4 h-100 searchbar-column">
          <div className="d-flex flex-column h-100" style={{ overflowWrap: 'break-word' }}>
            <div className="search">
              <Search key="query" query={query} />
            </div>
            <div className="results overflow-auto">
              <SearchResults />
            </div>
          </div>
        </div>
        <div className="col h-100 overflow-auto border-left">
          <EditorContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

const App = props => {
  return (
    <Provider store={props.store}>
      <BucketApp />
    </Provider>
  )
}

export default hot(App)
