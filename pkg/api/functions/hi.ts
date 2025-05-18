/* LICENSE
* Harvester is a program to understand your data.
* Copyright (C) 2025 whynotavailable
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { helloSchema, type Hello, type SimpleResponse } from 'shared';
import { addFunction } from '..';
import { statusOk } from '../http';

export function setup() {
  addFunction('hi', helloSchema, async (req) => {
    const body: Hello = req.body.data;

    const response: SimpleResponse = {
      message: body.name,
    };

    return statusOk(response);
  });
}
