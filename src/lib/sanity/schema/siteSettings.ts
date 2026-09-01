import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'storeName', title: 'Store name', type: 'string' }),
    defineField({ name: 'pickupAddress', title: 'Pickup address', type: 'text', rows: 3 }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'hoursNote', title: 'Hours note', type: 'text', rows: 3 }),
    defineField({
      name: 'pickupInstructions',
      title: 'Pickup instructions',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'pickupDays',
      title: 'Pickup days',
      type: 'array',
      of: [{ type: 'number' }],
      description: '0 = Sun … 6 = Sat',
      validation: (rule) => rule.unique().min(0)
    }),
    defineField({
      name: 'pickupWindow',
      title: 'Pickup window',
      type: 'string',
      description: 'e.g. "10 AM – 6 PM"'
    }),
    defineField({
      name: 'orderingEnabled',
      title: 'Ordering enabled',
      type: 'boolean',
      description: 'Master switch — turns checkout on/off',
      initialValue: true
    }),
    defineField({ name: 'announcement', title: 'Announcement', type: 'string' }),
    defineField({
      name: 'promoBanner',
      title: 'Promo banner',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false }),
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'string' })
      ]
    })
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' })
  }
});
