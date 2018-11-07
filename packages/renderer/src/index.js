/*
 * This file is part of ORY Editor.
 *
 * ORY Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *  
 * ORY Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *  
 * You should have received a copy of the GNU Lesser General Public License
 * along with ORY Editor.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license LGPL-3.0
 * @copyright 2016-2018 Aeneas Rekkas
 * @author Aeneas Rekkas <aeneas+oss@aeneas.io>
 *
 */

// @flow
import React from 'react'
import classNames from 'classnames'
import PluginService from 'ory-editor-core/lib/service/plugin'
import { editable as reducer } from 'ory-editor-core/lib/reducer/editable'
import type { Cell, Row } from 'ory-editor-core/lib/types/editable'

const gridClass = (size: number = 12, stackMobile): string =>
  `ory-cell-sm-${size} ory-cell-xs-${stackMobile ? 12 : size}`

const HTMLRow = ({ cells = [], className, hasInlineChildren, editable, ancestors = [] }: Row) => {
  const isTopLevelRow = ancestors.length === 2;

  return (
    <div
      className={classNames('ory-row', className, {
        'ory-row-has-floating-children': hasInlineChildren,
        'ory-row-float-media': floatMedia(isTopLevelRow, cells)
      })}
    >
      {cells.map((c: Cell) => (
        <HTMLCell
          key={c.id}
          {...c}
          editable={editable}
          ancestors={[...ancestors, c.id]}
          stackMobile={stackMobile(isTopLevelRow, cells)}
        />
      ))}
    </div>
  )
}

// eslint-disable-next-line no-empty-function
const noop = () => {}

// Only stack top the cells in top-level rows, except for those that have a slate instance
// with a width of 10 columns or greater. Everything else should have their layouts preserved.
const stackMobile = (isTopLevelRow, cells) => {
  let stackMobile = false;

  if (isTopLevelRow) {
    stackMobile = true;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (
        typeof cell.content !== 'undefined' &&
        cell.content.plugin.name === 'ory/editor/core/content/slate' &&
        cell.size >= 10
      ) {
        stackMobile = false;
        break;
      }
    }
  }

  return stackMobile;
}

const floatMedia = (isTopLevelRow, cells) => {
  let floatMedia = false;

  if (
    isTopLevelRow &&
    cells.length === 2
  ) {
    const mediaTypes = [
      'ory/editor/core/content/image',
      'ory/editor/core/content/image-drupal',
      'ory/editor/core/content/video',
      'ory/sites/plugin/content/html5-video'
    ];

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (
        typeof cell.content !== 'undefined' &&
        mediaTypes.includes(cell.content.plugin.name) &&
        cell.size >= 5
      ) {
        floatMedia = true;
        break;
      }
    }
  }

  return floatMedia;
}

const HTMLCell = (props: Cell) => {
  const {
    rows = [],
    layout = {},
    content = {},
    hasInlineNeighbour,
    inline,
    size,
    editable,
    id,
    ancestors
  } = props
  const cn = classNames('ory-cell', gridClass(size), {
    'ory-cell-has-inline-neighbour': hasInlineNeighbour,
    [`ory-cell-inline-${inline || ''}`]: inline
  })

  if (layout.plugin) {
    const {
      state,
      plugin: { Component }
    } = layout

    return (
      <div className={cn}>
        <div className="ory-cell-inner">
          <Component isPreviewMode readOnly state={state} onChange={noop} editable={editable} id={id}>
            {rows.map((r: Row) => (
              <HTMLRow key={r.id} {...r} className="ory-cell-inner" editable={editable} ancestors={[...ancestors, r.id]} />
            ))}
          </Component>
        </div>
      </div>
    )
  } else if (content.plugin) {
    const {
      state,
      plugin: { Component, StaticComponent }
    } = content
    const Renderer = StaticComponent || Component

    return (
      <div className={cn}>
        <div className="ory-cell-inner ory-cell-leaf">
          <Renderer isPreviewMode readOnly state={state} onChange={noop} editable={editable} id={id}/>
        </div>
      </div>
    )
  } else if (rows.length > 0) {
    return (
      <div className={cn}>
        {rows.map((r: Row) => (
          <HTMLRow key={r.id} {...r} className="ory-cell-inner" editable={editable} ancestors={[...ancestors, r.id]}/>
        ))}
      </div>
    )
  }

  return (
    <div className={cn}>
      <div className="ory-cell-inner" />
    </div>
  )
}

export const HTMLRenderer = ({
  state,
  plugins
}: {
  state: any,
  plugins: { layout: [], content: [] }
}) => {
  const service = new PluginService(plugins)
  const props = reducer(service.unserialize(state), { type: 'renderer/noop' })
  return <HTMLRow {...props} editable={state.id} ancestors={[]}/>
}
