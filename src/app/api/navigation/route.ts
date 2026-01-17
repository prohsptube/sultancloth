import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function GET() {
  try {
    const navCollection = await getNavigationCollection();
    const allItems = await navCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    // Rebuild hierarchical structure: main menu > categories > sub-items
    const mainItems = allItems.filter((item: any) => item.level === 1);
    
    const navigation = mainItems.map((mainItem: any) => {
      const categories = allItems
        .filter((item: any) => item.level === 2 && String(item.parentId) === String(mainItem._id))
        .map((category: any) => {
          const subItems = allItems
            .filter((item: any) => item.level === 3 && String(item.parentId) === String(category._id))
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

    // Get the highest order value for main level items
    const lastMainItem = await navCollection
      .findOne({ level: 1 }, { sort: { order: -1 } });
    const nextOrder = (lastMainItem?.order || 0) + 1;

    // New items from admin form are always main menu items (level 1)
    const result = await navCollection.insertOne({
      label: body.label,
      href: body.href,
      level: 1,           // Main menu item
      order: nextOrder,
      parentId: null,     // No parent for main items
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

