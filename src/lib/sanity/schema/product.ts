import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Grocery', value: 'grocery' },
          { title: 'Prepared food (made to order)', value: 'prepared' }
        ],
        layout: 'radio'
      },
      initialValue: 'grocery',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price in cents, e.g. 1499 = $14.99',
      validation: (rule) => rule.required().min(0).integer()
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at price',
      type: 'number',
      description: 'Optional was-price in cents, for a strikethrough',
      validation: (rule) => rule.min(0).integer()
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      description: 'e.g. "500g", "each", "6-pack"'
    }),
    defineField({
      name: 'origin',
      title: 'Country / region of origin',
      type: 'string',
      description: 'e.g. "Nigeria", "West Africa", "Thailand"'
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string'
    }),
    defineField({ name: 'inStock', title: 'In stock', type: 'boolean', initialValue: true }),
    defineField({
      name: 'stockQty',
      title: 'Stock quantity',
      type: 'number',
      description: 'Optional on-hand count; powers the low-stock warning'
    }),
    defineField({
      name: 'lowStockThreshold',
      title: 'Low-stock threshold',
      type: 'number',
      initialValue: 5
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on the homepage',
      initialValue: false
    }),
    defineField({
      name: 'leadTimeNote',
      title: 'Lead-time note',
      type: 'string',
      description: "Prepared items only — e.g. 'Ready in 24h'",
      hidden: ({ parent }) => parent?.type !== 'prepared'
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers show first.',
      initialValue: 0
    })
  ],
  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      categoryTitle: 'category.title',
      unit: 'unit',
      media: 'images.0'
    },
    prepare({ title, categoryTitle, unit, media }) {
      const bits = [categoryTitle, unit].filter(Boolean);
      return {
        title,
        subtitle: bits.length ? bits.join(' · ') : undefined,
        media
      };
    }
  }
});
