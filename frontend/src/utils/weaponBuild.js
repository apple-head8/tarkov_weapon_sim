import {
    categoryArrayList,
    categoryListMapping,
    PART_DATA_MAP,
} from "../constants/categoryList";

export function getBaseCategoryKey(categoryKey) {
    return categoryKey?.split("#")[0] ?? categoryKey;
}

export function cloneCategorySlots() {
    return Object.fromEntries(
        Object.entries(categoryArrayList).map(([key, items]) => [key, [...items]])
    );
}

export function getPartDefinition(categoryKey, partId) {
    const baseCategory = getBaseCategoryKey(categoryKey);
    const data = PART_DATA_MAP[baseCategory];

    return data?.data?.items?.find((item) => item.id === partId) ?? null;
}

function createUniqueSlotKey(categoryName, enabledCategories) {
    const sameCategoryCount = Object.values(enabledCategories).filter(
        (category) => category.categoryName === categoryName
    ).length;

    if (sameCategoryCount === 0) {
        return categoryName;
    }

    return `${categoryName}#${sameCategoryCount + 1}`;
}

function addChildCategory(parentCategory, childCategory, enabledCategories) {
    if (!parentCategory) return;

    const children = enabledCategories[parentCategory]?.children;
    if (children && !children.includes(childCategory)) {
        children.push(childCategory);
    }
}

function addSlotsFromItem(item, state, parentCategory = null) {
    const slots = item?.properties?.slots;
    if (!Array.isArray(slots)) return;

    slots.forEach((slot) => {
        const categoryName = categoryListMapping[slot.nameId];
        const allowedItems = slot.filters?.allowedItems;

        if (!categoryName || !Array.isArray(allowedItems) || allowedItems.length === 0) {
            return;
        }

        const categoryKey = createUniqueSlotKey(categoryName, state.enabled);

        state.slots[categoryKey] = [...(state.slots[categoryKey] ?? []), ...allowedItems];
        state.enabled[categoryKey] = {
            categoryName,
            index: categoryKey.includes("#") ? Number(categoryKey.split("#")[1]) : 1,
            parent: parentCategory,
            children: [],
        };

        addChildCategory(parentCategory, categoryKey, state.enabled);
    });
}

export function buildSlotsAndCategories(selectedGun, selectedParts) {
    const state = {
        slots: cloneCategorySlots(),
        enabled: {},
    };

    addSlotsFromItem(selectedGun, state);

    Object.values(selectedParts ?? {}).forEach((part) => {
        const fullPart = getPartDefinition(part.category, part.id);
        if (fullPart) {
            addSlotsFromItem(fullPart, state, part.category);
        }
    });

    return {
        newSlots: state.slots,
        enabled: state.enabled,
    };
}

export function buildOrderedCategoryKeys(categoryMap) {
    const result = [];
    const visited = new Set();

    function visit(categoryKey) {
        if (visited.has(categoryKey)) return;

        visited.add(categoryKey);
        result.push(categoryKey);

        (categoryMap[categoryKey]?.children ?? []).forEach(visit);
    }

    Object.keys(categoryMap)
        .filter((categoryKey) => categoryMap[categoryKey].parent === null)
        .forEach(visit);

    return result;
}

export function getDescendantCategoryKeys(categoryKey, categoryMap) {
    const descendants = [];

    function collect(currentKey) {
        (categoryMap[currentKey]?.children ?? []).forEach((childKey) => {
            descendants.push(childKey);
            collect(childKey);
        });
    }

    collect(categoryKey);
    return descendants;
}

export function removeCategoryAndDescendants(parts, categoryKey, categoryMap) {
    const nextParts = { ...parts };
    const categoriesToRemove = [
        categoryKey,
        ...getDescendantCategoryKeys(categoryKey, categoryMap),
    ];

    categoriesToRemove.forEach((key) => {
        delete nextParts[key];
    });

    return nextParts;
}
