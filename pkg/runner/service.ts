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

import { fetch } from 'bun';
import type { RpcRequest } from 'shared';
import type { z } from 'zod/v4';

const uri = 'http://localhost:5433/_rpc';

export async function callApi(key: string, body: any): Promise<Response> {
  const json: RpcRequest = {
    key: key,
    data: body,
  };

  return await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });
}

export async function validateResponse<T extends z.ZodType>(response: Response, schema: T): Promise<z.infer<T>> {
  if (response.status != 200) {
    throw await response.text();
  }

  const { data, error } = schema.safeParse(await response.json());

  if (error != null) {
    throw {
      message: 'Validation Errors',
      issues: error.issues,
    };
  }

  return data;
}
