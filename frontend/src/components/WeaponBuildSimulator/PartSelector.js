import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import PartCard from "../common/PartCard";

function PartSelector({
    selectedTab,
    handleTabChange,
    categoryKeys,
    categories,
    parts,
    handlePartSelect,
    selectedParts,
    clearPartSelect,
}) {
    function getCategoryDepth(categoryKey, categories) {
        let depth = 0;
        let current = categories[categoryKey]?.parent;

        while (current) {
            depth++;
            current = categories[current]?.parent ?? null;
        }

        return depth;
    }

    function shouldHighlightTab(categoryKey, categories) {
        const category = categories[categoryKey];

        if (!category) return false;

        const hasParent = category.parent !== null;
        const hasChildren = category.children?.length > 0;

        return hasParent || hasChildren;
    }

    function getTopLineStyle(depth) {
        if (depth === 0) {
            // 親
            return {
                color: "primary.main",
                opacity: 1,
                height: 3,
            };
        }

        // 子・孫
        return {
            color: "primary.main",
            opacity: 0.5,
            height: 2,
        };
    }

    function getCategoryLabel(categoryKey) {
        const category = categories[categoryKey];
        if (!category) return categoryKey;

        return category.index > 1
            ? `${category.categoryName} ${category.index}`
            : category.categoryName;
    }

    return (
        <>
            {/* Tabs for part categories */}
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
            >
                {categoryKeys.map((key) => {
                    return (
                        <Tab
                            key={key}
                            label={getCategoryLabel(key)}
                            value={key}
                            sx={{
                                position: "relative",
                                textTransform: "none",

                                // 上部ライン
                                "&::before": (() => {
                                    if (!shouldHighlightTab(key, categories)) {
                                        return {};
                                    }

                                    const depth = getCategoryDepth(
                                        key,
                                        categories
                                    );
                                    const line = getTopLineStyle(depth);

                                    return {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: line.height,
                                        backgroundColor: "primary.main",
                                        opacity: line.opacity,
                                    };
                                })(),

                                "&.Mui-selected::before": {
                                    opacity: 1,
                                    height: 4,
                                },
                            }}
                        />
                    );
                })}
            </Tabs>

            {/* Parts within the selected tab */}
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <div
                    style={{
                        width: "150px",
                        height: "200px",
                        display: "grid",
                        margin: "10px",
                        flexShrink: 0,
                    }}
                >
                    <PartCard
                        part={selectedParts[selectedTab]}
                        isSelectedCard={true}
                        onClick={() => clearPartSelect(selectedTab)}
                    />
                </div>

                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto", // 横スクロールを有効化
                        width: "100%",
                    }}
                >
                    {(parts[selectedTab] ?? []).map((part) => (
                        <div
                            style={{
                                width: "150px",
                                height: "200px",
                                display: "grid",
                                margin: "10px",
                            }}
                            key={part.id}
                        >
                            <PartCard
                                part={part}
                                isSelected={
                                    selectedParts[selectedTab]?.id === part.id
                                }
                                onClick={() =>
                                    handlePartSelect(selectedTab, part)
                                }
                            />
                        </div>
                    ))}
                </Box>
            </Box>
        </>
    );
}

export default PartSelector;
