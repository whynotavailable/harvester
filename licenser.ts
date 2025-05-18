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

import fs from 'fs'

const fileName = process.argv.reverse()[0]

if (!fs.existsSync(fileName)) {
  console.log(`file "${fileName}" doesn't exist.`);
  process.exit(1);
}

const fileData = fs.readFileSync(fileName, { encoding: 'utf-8' });
const license = fs.readFileSync("LICENSE", { encoding: 'utf-8' });

const licenseStuff = `/* LICENSE
${license.trim()}
*/`


if (!fileData.startsWith("/* LICENSE")) {
  let buffer = licenseStuff + "\n\n";

  buffer += fileData;
  fs.writeFileSync(fileName, buffer, { encoding: 'utf-8' })
}
else {
  const buffer = fileData.replace(/\/\* LICENSE.*?(\*\/)/s, licenseStuff);
  fs.writeFileSync(fileName, buffer, { encoding: 'utf-8' })
}
