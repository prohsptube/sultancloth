# Homepage Categories Management Guide

## Overview
The homepage now features a fully dynamic category management system. All categories shown under "Shop by Category" are managed from the admin dashboard and stored in MongoDB.

## Features

### Admin Interface
- **Location**: Admin Dashboard → Homepage tab (14th tab)
- **Full CRUD Operations**: Add, Edit, Delete categories
- **Drag & Drop Ordering**: Use up/down arrows to reorder categories
- **Column Layout Control**: Choose 1, 2, or 3 columns per category card
- **Active/Inactive Toggle**: Show or hide categories without deleting them
- **Image Support**: Add banner images to category cards
- **Live Preview**: Images show preview in admin form

### How to Use

#### Adding a New Category
1. Go to Admin Dashboard → Homepage tab
2. Click "+ Add Category" button
3. Fill in the form:
   - **Title**: Category name (e.g., "Men", "Women", "Kids")
   - **Description**: Short tagline (e.g., "Eastern and western essentials")
   - **Image URL**: Optional banner image for the category
   - **Columns per Row**: Choose layout (1, 2, or 3 columns for subcategory links)
   - **Active**: Check to show on homepage immediately
4. Click "Add Category"

#### Adding Subcategories
Currently, subcategories need to be added via API or manually in the database with this structure:
```json
{
  "label": "Shalwar Kameez",
  "href": "/collections/mens-kameez"
}
```

**Note**: A future update will add a UI form to manage subcategories directly in the admin.

#### Reordering Categories
- Use **▲** (up arrow) to move category higher on the homepage
- Use **▼** (down arrow) to move category lower on the homepage
- Changes save automatically

#### Editing Categories
1. Click "Edit" button on any category
2. Modify any field
3. Click "Update Category"

#### Deleting Categories
1. Click "Delete" button on any category
2. Confirm the deletion
3. Category is permanently removed from database

### Column Layout Options

- **1 Column**: Subcategory links stack vertically (mobile-friendly)
- **2 Columns**: Default layout, 2 links per row on larger screens
- **3 Columns**: Compact layout, 3 links per row (best for categories with many items)

### Technical Details

#### API Endpoints
- `GET /api/homepage-categories` - Fetch all active categories
- `POST /api/homepage-categories` - Create new category
- `GET /api/homepage-categories/[id]` - Get single category
- `PUT /api/homepage-categories/[id]` - Update category
- `DELETE /api/homepage-categories/[id]` - Delete category
- `POST /api/homepage-categories/reorder` - Bulk reorder categories

#### Database Schema
Collection: `homepage_categories`

```typescript
{
  _id: ObjectId,
  title: string,                    // Required: "Men", "Women", etc.
  description: string,               // Optional: tagline
  image: string,                     // Optional: URL to banner image
  categoryId: string | null,         // Optional: link to categories collection
  subcategories: [                   // Array of links
    {
      label: string,                 // "Shalwar Kameez"
      href: string                   // "/collections/mens-kameez"
    }
  ],
  order: number,                     // Display order (auto-incremented)
  columnsPerRow: 1 | 2 | 3,         // Layout: 1, 2, or 3 columns
  isActive: boolean,                 // Show/hide on homepage
  createdAt: Date,
  updatedAt: Date
}
```

## Best Practices

1. **Keep Titles Short**: 1-2 words for clean design
2. **Concise Descriptions**: Brief taglines work best (5-8 words)
3. **Consistent Images**: Use same dimensions for all category images
4. **Subcategory Limit**: 4-8 links per category for optimal UX
5. **Test Layout**: Try different column options to see what works best
6. **Order Strategically**: Put most popular categories first

## Future Enhancements

Planned features:
- Subcategory management UI in admin form
- Drag-and-drop visual reordering
- Bulk actions (activate/deactivate multiple)
- Category templates for quick setup
- Image upload directly from admin (vs URL only)
- Link to existing categories from database

## Troubleshooting

**Categories not showing on homepage?**
- Check if `isActive` is set to true
- Verify subcategories array is not empty
- Check MongoDB connection in server logs

**Images not displaying?**
- Verify image URL is accessible
- Check browser console for CORS errors
- Use HTTPS URLs for production

**Reordering not working?**
- Check `/api/homepage-categories/reorder` endpoint
- Verify MongoDB connection
- Check browser console for errors

## Migration from Hardcoded Data

If you had hardcoded categories before, you'll need to:
1. Go to admin → Homepage tab
2. Manually add each category with the "Add Category" button
3. Add subcategories via API for now (UI coming soon)
4. Set ordering and column layout as desired
5. Activate categories to show on homepage

The homepage will automatically fetch from database instead of showing hardcoded data.
