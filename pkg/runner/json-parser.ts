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

export type FieldSet = Record<string, Set<string>>;

function append(key: string, kind: string, fields: FieldSet) {
  if (key in fields) {
    fields[key].add(kind);
  }
  else {
    fields[key] = new Set([kind]);
  }
}

function isArray(data: unknown): data is Array<unknown> {
  return Array.isArray(data);
}

function isObject(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object';
}

export function dive(prefix: string, data: unknown, fields: FieldSet) {
  if (isArray(data)) {
    append(prefix, 'array', fields);

    for (const elem of data) {
      dive(`${prefix}[]`, elem, fields);
    }
  }
  else if (data === null) {
    // typeof null presents as 'object' so need to handle it
    append(prefix, 'null', fields);
  }
  else if (isObject(data)) {
    append(prefix, 'object', fields);

    for (const key in data) {
      dive(`${prefix}.${key}`, data[key], fields);
    }
  }
  else {
    append(prefix, typeof data, fields);
  }
}
