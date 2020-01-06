import React from 'react'

export const Icon = ({ name, className, style, faStyle, onClick }) => {
  if (onClick) {
    style = Object.assign({}, style || {}, { cursor: 'pointer' })
  }

  return (
    <i
      className={`${faStyle} fa-${name} ${className || ''}`}
      style={style}
      onClick={onClick}
    />
  )
}

export const IconRegular = props => {
  return <Icon faStyle="far" {...props} />
}

export const IconSolid = props => {
  return <Icon faStyle="fas" {...props} />
}

export const SidebarIcon = props => {
  return <Icon faStyle="fas" className="fa-fw" {...props} />
}