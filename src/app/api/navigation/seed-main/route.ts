import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { mainNavigation } from "@/lib/navigation";

export async function POST(request: NextRequest) {
  try {
    console.log("[SEED] Starting navigation seed...");
    const collection = await getNavigationCollection();
    console.log("[SEED] Got collection:", collection.collectionName);

    // Clear existing navigation
    const deleteResult = await collection.deleteMany({});
    console.log("[SEED] Deleted existing items:", deleteResult.deletedCount);

    // Flatten and insert navigation items with hierarchy
    const itemsToInsert = [];
    let order = 0;
    let totalInserted = 0;

    for (const mainItem of mainNavigation) {
      // Insert main menu item
      const mainDoc = {
        label: mainItem.label,
        href: mainItem.href,
        level: 1, // 1 = main menu, 2 = category, 3 = subcategory
        order: order,
        parentId: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mainResult = await collection.insertOne(mainDoc);
      const mainId = mainResult.insertedId;
      console.log(`[SEED] Inserted main item: ${mainItem.label} with ID: ${mainId}`);
      order++;
      totalInserted++;

      // Insert categories if they exist
      if (mainItem.categories) {
        let categoryOrder = 0;
        for (const category of mainItem.categories) {
          const categoryDoc = {
            label: category.label,
            href: category.href,
            level: 2,
            order: categoryOrder,
            parentId: mainId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const categoryResult = await collection.insertOne(categoryDoc);
          const categoryId = categoryResult.insertedId;
          console.log(`[SEED]   Inserted category: ${category.label} with ID: ${categoryId}`);
          categoryOrder++;
          totalInserted++;

          // Insert sub-items if they exist
          if (category.subItems) {
            let subOrder = 0;
            for (const subItem of category.subItems) {
              const subDoc = {
                label: subItem.label,
                href: subItem.href,
                level: 3,
                order: subOrder,
                parentId: categoryId,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              await collection.insertOne(subDoc);
              console.log(`[SEED]     Inserted sub-item: ${subItem.label}`);
              subOrder++;
              totalInserted++;
            }
          }
        }
      }
    }

    console.log(`[SEED] COMPLETED! Total items inserted: ${totalInserted}`);
    return NextResponse.json(
      {
        success: true,
        message: `Seeded ${order} main navigation items and their subcategories`,
        totalInserted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Seed Navigation] Error:", error);
    return NextResponse.json(
      { error: "Failed to seed navigation" },
      { status: 500 }
    );
  }
}
