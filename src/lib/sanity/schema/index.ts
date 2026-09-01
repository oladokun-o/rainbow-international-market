import type { SchemaTypeDefinition } from 'sanity';
import category from './category';
import product from './product';
import siteSettings from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [category, product, siteSettings];
