import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

/**
 * TabBar
 *
 * @param {object} relations - { category: { parent: string|null, children: [] } }
 * @param {object} colors - { category: "#ff0000" }（最初に parent から設定される）
 * @param {string} selectedTab
 * @param {function} onChange
 */
export default function TabBar({ relations, colors, selectedTab, onChange }) {
    if (!relations || Object.keys(relations).length === 0) {
        return null;
    }

    // 階層を計算
    const getDepth = (cat) => {
        let depth = 0;
        let cur = relations[cat]?.parent;

        while (cur) {
            depth++;
            cur = relations[cur]?.parent;
        }
        return depth;
    };

    // DFS で階層順にカテゴリを並べる
    const buildOrdered = () => {
        const visited = new Set();
        const ordered = [];

        function dfs(cat) {
            if (visited.has(cat)) return;
            visited.add(cat);

            ordered.push(cat);

            relations[cat]?.children?.forEach((c) => dfs(c));
        }

        Object.keys(relations)
            .filter((cat) => !relations[cat].parent)
            .forEach((root) => dfs(root));

        return ordered;
    };

    const orderedCategories = buildOrdered();

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
            <Tabs
                value={selectedTab}
                onChange={(e, v) => onChange(v)}
                variant="scrollable"
                scrollButtons="auto"
            >
                {orderedCategories.map((cat) => {
                    const depth = getDepth(cat);

                    return (
                        <Tab
                            key={cat}
                            label={cat}
                            value={cat}
                            sx={{
                                // 階層インデント
                                ml: depth * 3,

                                // カラー（階層が深くなると薄くする）
                                color: colors[cat],
                                opacity: 1 - depth * 0.15,

                                fontWeight: depth === 0 ? "bold" : "normal",
                                textTransform: "none",
                            }}
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
}
