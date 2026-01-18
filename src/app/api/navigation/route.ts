import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const navCollection = await getNavigationCollection();
    const allItems = await navCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    const isRaw = request.nextUrl.searchParams.get("raw") === "1";
    if (isRaw) {
      // Return flat items with structural fields for admin UI
      const flat = allItems.map((item: any) => ({
        _id: item._id,
        label: item.label,
        href: item.href,
        level: item.level,
        order: item.order,
        parentId: item.parentId ?? null,
        isActive: item.isActive ?? true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      return NextResponse.json(flat);
    }

    // Rebuild hierarchical structure: main menu > categories > sub-items
    const mainItems = allItems.filter((item: any) => item.level === 1);

    const navigation = mainItems.map((mainItem: any) => {
      const categories = allItems
        .filter(
          (item: any) => item.level === 2 && String(item.parentId) === String(mainItem._id)
        )
        .map((category: any) => {
          const subItems = allItems
            .filter(
              (item: any) => item.level === 3 && String(item.parentId) === String(category._id)
            )
            .map((subItem: any) => ({
              label: subItem.label,
              href: subItem.href,
            }));

          return {
            label: category.label,
            href: category.href,
            subItems: subItems.length > 0 ? subItems : undefined,
          };
        });

      return {
        label: mainItem.label,
        href: mainItem.href,
        categories: categories.length > 0 ? categories : undefined,
      };
    });

    console.log("[API] GET /api/navigation - Found items:", navigation.length);
    return NextResponse.json(navigation);
  } catch (error) {
    console.error("[API] GET /api/navigation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const navCollection = await getNavigationCollection();

    const level = body.level || 1;
    const parentId = body.parentId || null;

    // Get the highest order value for items at the same level and parent
    const filter = parentId 
      ? { level, parentId } 
      : { level, parentId: null };
    
    const lastItem = await navCollection
      .findOne(filter, { sort: { order: -1 } });
    const nextOrder = (lastItem?.order || 0) + 1;

    const result = await navCollection.insertOne({
      label: body.label,
      href: body.href,
      level,
      order: nextOrder,
      parentId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        _id: result.insertedId,
        label: body.label,
        href: body.href,
        level: 1,
        order: nextOrder,
        parentId: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/navigation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create navigation item" },
      { status: 500 }
    );
  }
}


