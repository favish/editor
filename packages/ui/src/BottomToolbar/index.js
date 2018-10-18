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
import Drawer from '@material-ui/core/Drawer'
import React from 'react'
import ThemeProvider from '../ThemeProvider'
import { lightTheme } from 'ory-editor-ui/lib/ThemeProvider'

const BottomToolbar = ({
  open = false,
  children,
  className,
}: {
  open?: boolean,
  children?: Object,
  className?: string,
}) => (
  <ThemeProvider theme={lightTheme}>
    <Drawer
      variant="persistent"
      className={className}
      open={open}
      anchor="bottom"
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          overflow: open ? 'visible' : 'hidden'
        }
      }}
    >
      <div
        style={{
          borderRadius: '4px 4px 0 0',
          backgroundColor: '#ffffff',
          padding: '20px 24px',
          margin: 'auto',
          boxShadow: '0px 0px 100px 0px rgba(0,0,0,0.2)'
        }}
      >
        {children}
      </div>
    </Drawer>
  </ThemeProvider>
)

export default BottomToolbar
