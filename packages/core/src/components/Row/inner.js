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

import Cell from '../Cell'
import type { ComponetizedRow } from '../../types/editable'

const Inner = ({
  editable,
  ancestors,
  node: { id, hover, cells = [], hasInlineChildren },
  containerHeight,
  blurAllCells,
  containerWidth,
  rawNode,
  isTopLevelRow
}: ComponetizedRow) => {

  const nodes = rawNode();

  // Only stack top the cells in top-level rows, except for those that have a slate instance
  // with a width of 10 columns or greater. Everything else should have their layouts preserved.
  function stackMobile(nodes) {
    let stackMobile = false;

    if (isTopLevelRow) {
      stackMobile = true;
      for (let i = 0; i < nodes.cells.length; i++) {
        const cell = nodes.cells[i];
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

  function floatImage(nodes) {
    let floatImage = false;

    if (
      isTopLevelRow &&
      nodes.cells.length === 2
    ) {
      for (let i = 0; i < nodes.cells.length; i++) {
        const cell = nodes.cells[i];
        if (
          typeof cell.content !== 'undefined' &&
          cell.content.plugin.name === 'ory/editor/core/content/image' &&
          cell.size >= 5
        ) {
          floatImage = true;
          break;
        }
      }
    }

    return floatImage;
  }

  return (
    <div
      className={classNames('ory-row', {
        'ory-row-is-hovering-this': Boolean(hover),
        [`ory-row-is-hovering-${hover || ''}`]: Boolean(hover),
        'ory-row-has-floating-children': hasInlineChildren,
        'ory-row-float-image-up': floatImage(nodes)
      })}
      onClick={blurAllCells}
    >
      {cells.map((c: string) => (
        <Cell
          rowWidth={containerWidth}
          rowHeight={containerHeight}
          ancestors={[...ancestors, id]}
          editable={editable}
          key={c}
          id={c}
          stackMobile={stackMobile(nodes)}
        />
      ))}
    </div>
  )
}

export default Inner
