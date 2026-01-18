import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const navCollection = await getNavigationCollection();

    const updateData: any = {
      label: body.label,
      href: body.href,
      isActive: body.isActive !== undefined ? body.isActive : true,
      updatedAt: new Date(),
    };

    // Allow updating level and parentId if provided
    if (body.level !== undefined) {
      updateData.level = body.level;
    }
    if (body.parentId !== undefined) {
      updateData.parentId = body.parentId;
    }

    const result = await navCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Navigation item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] PUT /api/navigation/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update navigation item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const navCollection = await getNavigationCollection();
    
    // Find all child items recursively
    const itemsToDelete = [new ObjectId(id)];
    const findChildren = async (parentId: ObjectId) => {
      const children = await navCollection.find({ parentId: parentId.toString() }).toArray();
      for (const child of children) {
        itemsToDelete.push(child._id);
        await findChildren(child._id);
      }
    };
    
    await findChildren(new ObjectId(id));
    
    // Delete all items (parent + children)
    const result = await navCollection.deleteMany({ 
      _id: { $in: itemsToDelete } 
    });

    console.log(`[DELETE] Removed ${result.deletedCount} navigation items`);

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("[API] DELETE /api/navigation/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete navigation item" },
      { status: 500 }
    );
  }
}
