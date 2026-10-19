function finiteNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function getRecoilModifier(part) {
    // Item.recoilModifier is a percentage; properties.recoilModifier is a fraction.
    return part?.recoilModifier != null
        ? finiteNumber(part.recoilModifier) / 100
        : finiteNumber(part?.properties?.recoilModifier);
}

// Modifiers are fractional changes (-0.05 means -5%) and add across all slots,
// including the weapon's default attachments.
export function calculateRecoil(gun, parts = {}) {
    const multiplier = Math.max(
        0,
        1 + Object.values(parts).reduce(
            (total, part) => total + getRecoilModifier(part),
            0
        )
    );
    return {
        recoilVertical: finiteNumber(gun?.properties?.recoilVertical) * multiplier,
        recoilHorizontal: finiteNumber(gun?.properties?.recoilHorizontal) * multiplier,
    };
}
