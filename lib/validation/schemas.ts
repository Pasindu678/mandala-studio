import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional().default(''),
  coverImage: z.string().optional(),
  displayOrder: z.coerce.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const ArtworkSchema = z.object({
  title: z.string().min(2, 'Artwork title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional().default(''),
  categoryId: z.string().min(1, 'Please select a category'),
  tags: z.union([z.string(), z.array(z.string())]).default('[]'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
  previewImage: z.string().min(1, 'Preview image is required'),
  originalFile: z.string().min(1, 'Original artwork file is required'),
  isFree: z.boolean().default(false),
  price: z.coerce.number().min(0, 'Price must be 0 or higher').default(0.0),
  license: z.enum(['PERSONAL', 'COMMERCIAL']).default('PERSONAL'),
  isPublished: z.boolean().default(true),
  isArchived: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export const BulkArtworkSchema = z.object({
  items: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    categoryId: z.string().min(1, 'Category is required'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('INTERMEDIATE'),
    previewImage: z.string(),
    originalFile: z.string(),
    isFree: z.boolean().default(false),
    price: z.coerce.number().default(0),
    license: z.enum(['PERSONAL', 'COMMERCIAL']).default('PERSONAL'),
    isPublished: z.boolean().default(true),
  })).min(1, 'At least one artwork item is required'),
});

export const ProductSchema = z.object({
  title: z.string().min(2, 'Product title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional().default(''),
  coverImage: z.string().min(1, 'Cover image is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  currency: z.string().default('USD'),
  productType: z.enum(['INDIVIDUAL_ARTWORK', 'COLORING_BOOK_PDF', 'THEMED_BUNDLE', 'PREMIUM_COLLECTION']),
  license: z.enum(['PERSONAL', 'COMMERCIAL']).default('PERSONAL'),
  fileUrl: z.string().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  artworkIds: z.array(z.string()).optional().default([]),
});

export const CollectionSchema = z.object({
  title: z.string().min(2, 'Collection title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional().default(''),
  coverImage: z.string().optional(),
  price: z.coerce.number().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
  artworkIds: z.array(z.string()).optional().default([]),
});

export const HomepageHeroSchema = z.object({
  headline: z.string().min(2, 'Headline is required'),
  subheadline: z.string().min(5, 'Subheadline is required'),
  ctaText: z.string().min(1, 'CTA text is required'),
  ctaLink: z.string().min(1, 'CTA link is required'),
  secondaryCtaText: z.string().optional().default('Browse Shop'),
  secondaryCtaLink: z.string().optional().default('/shop'),
  heroImage: z.string().min(1, 'Hero image path is required'),
  badgeText: z.string().optional().default('Handcrafted Radial Art'),
});

export const CheckoutPayloadSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  items: z.array(z.object({
    type: z.enum(['artwork', 'product']),
    id: z.string(),
  })).min(1, 'Cart cannot be empty'),
  discountCode: z.string().optional(),
});
