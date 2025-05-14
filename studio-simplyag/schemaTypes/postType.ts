import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'bodyHtml',
      title: 'Body (HTML)',
      type: 'text',
      rows: 20, // optional: makes it easier to view in Studio
      description: 'Raw HTML from TinyMCE. This is what gets rendered on the site.',
    }),
    defineField({
      name: 'body',
      title: 'Legacy Body (Portable Text)',
      type: 'array',
      of: [{type: 'block'}],
      hidden: true, // optional: hides it from the editor UI for now
    }),
  ],
})
