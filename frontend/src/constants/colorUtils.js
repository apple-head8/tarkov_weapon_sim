import { baseColors } from "./colors";

export function getBaseColor(index) {
    return baseColors[index % baseColors.length];
}

export function colorWithDepth(base, depth) {
    const alpha = Math.max(1 - depth * 0.3, 0.2);
    return `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha})`;
}
