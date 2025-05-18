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

import { z } from 'zod/v4';

export const rpcRequestSchema = z.object({
  key: z.string(),
  data: z.any(),
});

export type RpcRequest = z.infer<typeof rpcRequestSchema>;

export const helloSchema = z.object({
  name: z.string(),
});

export type Hello = z.infer<typeof helloSchema>;

export const simpleResponseSchema = z.object({
  message: z.string(),
});

export type SimpleResponse = z.infer<typeof simpleResponseSchema>;
