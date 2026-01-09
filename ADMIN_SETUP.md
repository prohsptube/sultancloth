# Admin Backend Setup Guide

The admin backend is now ready! Follow these steps to complete the setup:

## 1. MongoDB Atlas Setup

### Create a MongoDB Atlas Account:
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Start free" and create an account
3. Create a new organization and project

### Create a Free Cluster:
1. In Atlas, click "Create a Deployment"
2. Select "M0 Free" tier
3. Choose your cloud provider (AWS recommended)
4. Select a region close to your users
5. Click "Create Deployment"

### Get Connection String:
1. Go to "Database" → "Clusters"
2. Click "Connect" on your cluster
3. Choose "Drivers" → "Node.js"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

## 2. Create Database User

1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and generate a strong password
5. Set database user privileges to "Admin"
6. Click "Add User"

Replace `<username>` and `<password>` in the connection string with your credentials.

## 3. Configure Environment Variables

Edit `.env.local` in the project root:

```env
# MongoDB Connection String (from Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sultancloth?retryWrites=true&w=majority

# Admin Credentials (set your own secure password)
ADMIN_EMAIL=admin@sultancloth.com
ADMIN_PASSWORD=your_very_secure_password_here

# API Secret (random string for future API calls)
API_SECRET=your_random_api_secret_key_here
```

## 4. Access Admin Panel

### Login:
- Go to `http://localhost:3000/admin` (or your domain)
- Use the credentials from `.env.local`:
  - Email: `admin@sultancloth.com`
  - Password: (whatever you set)

### Features:
- ✅ View all products
- ✅ Create new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage categories (coming soon)

## 5. API Endpoints

The following API endpoints are now available:

### Products CRUD:
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (requires admin auth)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (requires admin auth)
- `DELETE /api/products/[id]` - Delete product (requires admin auth)

### Authentication:
- `POST /api/auth/login` - Admin login (returns httpOnly cookie)
- `POST /api/auth/logout` - Admin logout

## 6. Product Data Structure

Products are stored in MongoDB with this schema:

```json
{
  "_id": "ObjectId",
  "name": "Product Name",
  "category": "men|women|kids|unstitched|fragrances",
  "price": 3999,
  "description": "Product description",
  "image": "optional image URL",
  "createdAt": "2025-01-10T12:00:00Z",
  "updatedAt": "2025-01-10T12:00:00Z"
}
```

## 7. Next Steps

After setup is complete:

1. **Add Sample Products** - Use the admin dashboard to add some products
2. **Update Homepage** - The product pages will soon fetch from MongoDB instead of hardcoded data
3. **Add Image Upload** - Integrate Cloudinary or AWS S3 for product images
4. **Create Categories Management** - Add admin UI for managing categories
5. **Add Hero Slides Management** - Add admin UI for managing carousel slides

## 8. Testing

To test locally:

```bash
npm run dev
```

Then visit:
- Admin Login: http://localhost:3000/admin
- Admin Dashboard: http://localhost:3000/admin/dashboard (after login)
- API: http://localhost:3000/api/products

## 9. Troubleshooting

**"Unauthorized" error:**
- Check that you're logged in (/admin/dashboard requires admin_token cookie)
- Make sure MONGODB_URI is correct

**"Cannot find module" errors:**
- Run `npm install` to install dependencies
- Restart the development server

**Database connection fails:**
- Verify MONGODB_URI is correct in .env.local
- Check that your MongoDB Atlas cluster is running
- Whitelist your IP in MongoDB Atlas → Network Access

## 10. Security Notes

- ✅ Admin routes are protected by middleware (redirects to /admin if not logged in)
- ✅ Write operations require admin authentication
- ✅ Passwords stored in .env.local (not committed to git)
- ✅ Sessions use httpOnly secure cookies
- ⚠️ TODO: Add rate limiting on login endpoint
- ⚠️ TODO: Hash passwords in production
