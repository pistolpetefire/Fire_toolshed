import {writeFile} from 'node:fs/promises';
import {fresh} from './core.mjs';
const template=fresh();template.id='replace-with-a-unique-review-id';template.project.date='';
await writeFile(new URL('template.json',import.meta.url),JSON.stringify(template,null,2)+'\n');
