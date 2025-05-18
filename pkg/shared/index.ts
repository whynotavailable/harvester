/* LICENSE
Harvester is a program to understand your data.
Copyright (C) 2025 whynotavailable

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import type z from 'zod/v4';
import type { RpcRequest } from './types';

export * from './types';
export * from './utils';

type getTokenHook = () => Promise<string>;

let uri = '';

let getToken: getTokenHook | null = null;

export function setGetToken(hook: getTokenHook) {
  getToken = hook;
}

export function setUri(newUri: string) {
  uri = newUri;
}

export interface ApiRequest<T> {
  key: string
  body: any
  schema: T
  headers?: Record<string, string>
}

// Generic rpc caller. May change
// INFO: The generic is useless, but it means you don't need to pass the type.
export async function callApi<T extends z.ZodType>(request: ApiRequest<T>): Promise<z.infer<T>> {
  if (uri === '') {
    throw 'Set the uri';
  }

  const json: RpcRequest = {
    key: request.key,
    data: request.body,
  };

  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers != undefined ? request.headers : {}),
      ...(getToken != null ? ({ Authorization: `bearer ${await getToken()}` }) : {}),
    },
    body: JSON.stringify(json),
  });

  if (response.status != 200) {
    throw await response.text();
  }

  const { data, error } = request.schema.safeParse(await response.json());

  if (error != null) {
    throw {
      message: 'Reponse Validation Failed',
      cause: error.cause,
      issues: error.issues,
    };
  }

  return data;
}
