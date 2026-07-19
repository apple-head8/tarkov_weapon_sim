export function findConflictingPart(part, selectedParts) {
    const partConflicts = part.conflictingItems?.map((item) => item.id) || [];

    for (const [category, selected] of Object.entries(selectedParts)) {
        const selectedConflicts =
            selected.conflictingItems?.map((item) => item.id) || [];

        if (
            partConflicts.includes(selected.id) || // 新しいパーツが選択済みと競合
            selectedConflicts.includes(part.id) // 選択済みが新しいパーツと競合
        ) {
            return { category, part: selected };
        }
    }

    return null;
}
