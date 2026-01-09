# Sultan Cloth - Admin Backend Quick Reference

## 🚀 Getting Started (5 Steps)

### 1. Set up MongoDB Atlas (Free)
```
1. Go to mongodb.com/cloud/atlas
2. Create account → Create cluster (M0 Free tier)
3. Create database user (Admin privileges)
4. Get connection string: mongodb+srv://username:password@cluster.mongodb.net/sultancloth...
```

### 2. Update .env.local
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sultancloth?retryWrites=true&w=majority
ADMIN_EMAIL=admin@sultancloth.com
ADMIN_PASSWORD=your_secure_password
API_SECRET=any_random_string
```

### 3. Test Admin Login
```
1. npm run dev
2. Go to http://localhost:3000/admin
3. Enter credentials from .env.local
4. Click "Login"
```

### 4. Add Products via Dashboard
```
1. Click "Add Product" button
2. Fill in: Name, Category, Price, Description
3. Click "Create"
4. Product saved to MongoDB immediately
```

### 5. View on Frontend
```
1. Homepage shows product count in category dropdowns
2. Collection pages (e.g., /collections/men) display all products
3. Everything updates in real-time from MongoDB
```

---

## 📍 Key URLs

| URL | Purpose |
|-----|---------|
| `/admin` | Admin login page |
| `/admin/dashboard` | Products management (after login) |
| `/api/products` | Get all products (public API) |
| `/api/auth/login` | Admin login endpoint |
| `/api/auth/logout` | Admin logout endpoint |

---

## 🗂️ File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx ................. Login form
│   │   ├── dashboard/page.tsx ....... Product management
│   │   └── layout.tsx ............... Admin layout wrapper
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts ....... Login endpoint
│       │   └── logout/route.ts ...... Logout endpoint
│       └── products/
│           ├── route.ts ............. GET all, POST create
│           └── [id]/route.ts ........ GET, PUT, DELETE
├── lib/
│   ├── mongodb.ts ................... Database connection
│   └── auth.ts ...................... Auth helpers
└── middleware.ts .................... Route protection
```

---

## 🔑 Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
# No special commands needed, uses environment variables
```

---

## 📊 Product Fields

When adding a product, use these fields:

| Field | Type | Required | Example |
|-------|------|----------|---------|
| name | string | ✓ | "Premium Cotton Kameez" |
| category | string | ✓ | "men" (or women, kids, unstitched, fragrances) |
| price | number | ✓ | 3999 |
| description | string | | "High-quality hand-stitched fabric" |
| image | string | | "https://example.com/image.jpg" |

---

## 🔐 Authentication Details

**Login Process:**
1. User submits email + password to `/api/auth/login`
2. Server validates against ADMIN_EMAIL and ADMIN_PASSWORD
3. Sets `admin_token` cookie (httpOnly, 24-hour expiry)
4. All write operations require this cookie

**Session Management:**
- Middleware checks for `admin_token` cookie on `/admin/*` routes
- Invalid/missing cookie redirects to login page
- Cookie cleared on logout

---

## 🛠️ API Reference

### GET /api/products
**Description**: Get all products (public)
```bash
curl http://localhost:3000/api/products
```
**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium Kameez",
    "category": "men",
    "price": 3999,
    "description": "High quality",
    "createdAt": "2025-01-10T12:00:00Z",
    "updatedAt": "2025-01-10T12:00:00Z"
  }
]
```

### POST /api/products
**Description**: Create product (requires login)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Kameez",
    "category": "men",
    "price": 3999,
    "description": "High quality"
  }'
```
**Response**: 201 Created

### PUT /api/products/[id]
**Description**: Update product (requires login)
```bash
curl -X PUT http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"price": 4999}'
```
**Response**: 200 OK

### DELETE /api/products/[id]
**Description**: Delete product (requires login)
```bash
curl -X DELETE http://localhost:3000/api/products/507f1f77bcf86cd799439011
```
**Response**: 200 OK

---

## 🐛 Troubleshooting

**Issue**: "Cannot connect to MongoDB"
- Check MONGODB_URI is correct in .env.local
- Verify cluster is running in MongoDB Atlas
- Whitelist your IP in Atlas → Network Access

**Issue**: "Unauthorized" on create/edit/delete
- Make sure you're logged in first
- Cookie must be set (`admin_token`)
- Check browser DevTools → Application → Cookies

**Issue**: "Invalid credentials" on login
- Verify ADMIN_EMAIL matches exactly in .env.local
- Verify ADMIN_PASSWORD matches exactly
- Check for typos (spaces, capitalization)

**Issue**: Products not showing up
- Go to admin dashboard and check product list
- Verify products have correct category spelling
- Check browser console for API errors

---

## 📚 Documentation Files

- **ADMIN_SETUP.md** - Detailed MongoDB Atlas setup
- **ADMIN_IMPLEMENTATION.md** - Technical implementation details
- **FRONTEND_INTEGRATION.md** - How to connect frontend to API

---

## ✨ Features Status

| Feature | Status |
|---------|--------|
| Admin Login | ✅ Ready |
| Product CRUD | ✅ Ready |
| Protected Routes | ✅ Ready |
| MongoDB Integration | ✅ Ready |
| Categories | 🔄 In Progress |
| Image Upload | 🔄 In Progress |
| Inventory Tracking | ⏳ Planned |
| Order Management | ⏳ Planned |

---

## 🎯 Next Steps

1. **Configure MongoDB** → Follow ADMIN_SETUP.md
2. **Add sample products** → Use admin dashboard
3. **Test integration** → Check collection pages
4. **Add categories API** → Follow FRONTEND_INTEGRATION.md
5. **Implement image upload** → Use Cloudinary/S3

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review ADMIN_SETUP.md, ADMIN_IMPLEMENTATION.md, or FRONTEND_INTEGRATION.md
3. Check browser console for JavaScript errors
4. Check Next.js terminal for server errors

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready (pending MongoDB configuration)
