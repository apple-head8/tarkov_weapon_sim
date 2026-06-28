import React, { useEffect, useRef } from "react";
import { Tabs, Tab, Box, Tooltip, Typography } from "@mui/material";
import PartCard from "../common/PartCard";
import { getCategoryDisplayName } from "../../constants/categoryList";

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
    const tabRefs = useRef({});

    useEffect(() => {
        const selectedCategory = categories[selectedTab];
        const selectedTabElement = tabRefs.current[selectedTab];

        if (!selectedCategory?.children?.length || !selectedTabElement) {
            return;
        }

        selectedTabElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [categories, selectedTab]);

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
            return {
                color: "primary.main",
                opacity: 1,
                height: 3,
            };
        }

        return {
            color: "primary.main",
            opacity: 0.9,
            height: 3,
        };
    }

    function getDepthColor(depth) {
        const palette = [
            "#8b9cff",
            "#7c6df2",
            "#8b5cf6",
            "#a855f7",
            "#c026d3",
            "#ec4899",
        ];

        return palette[Math.min(depth, palette.length - 1)];
    }

    function getCategoryLabel(categoryKey) {
        const category = categories[categoryKey];
        if (!category) return categoryKey;

        return getCategoryDisplayName(categoryKey, category);
    }

    function getParentHint(categoryKey) {
        const parentKey = categories[categoryKey]?.parent;
        if (!parentKey) return "";

        const parentPartName = selectedParts[parentKey]?.name;
        return parentPartName || getCategoryLabel(parentKey);
    }

    function getCategoryPath(categoryKey) {
        const path = [];
        let current = categoryKey;

        while (current) {
            const label = getCategoryLabel(current);
            const partName = selectedParts[current]?.name;
            path.unshift(partName ? `${label}: ${partName}` : label);
            current = categories[current]?.parent ?? null;
        }

        return path.join(" > ");
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
                    const depth = getCategoryDepth(key, categories);
                    const depthColor = getDepthColor(depth);
                    const parentHint = getParentHint(key);

                    return (
                        <Tab
                            ref={(element) => {
                                if (element) {
                                    tabRefs.current[key] = element;
                                } else {
                                    delete tabRefs.current[key];
                                }
                            }}
                            key={key}
                            label={
                                <Tooltip title={getCategoryPath(key)} arrow>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            maxWidth: 160,
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontSize: "0.82rem",
                                                lineHeight: 1.2,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {getCategoryLabel(key)}
                                        </Typography>
                                        {parentHint && (
                                            <Typography
                                                component="span"
                                                sx={{
                                                    color: "rgba(255,255,255,0.72)",
                                                    fontSize: "0.68rem",
                                                    lineHeight: 1.15,
                                                    maxWidth: "100%",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {parentHint}
                                            </Typography>
                                        )}
                                    </Box>
                                </Tooltip>
                            }
                            value={key}
                            sx={{
                                position: "relative",
                                textTransform: "none",
                                minHeight: parentHint ? 58 : 48,
                                alignItems: "center",
                                px: 1.5,
                                background: "transparent",
                                "&.Mui-selected": {
                                    background: "transparent",
                                },

                                // 上部ライン
                                "&::before": (() => {
                                    if (!shouldHighlightTab(key, categories)) {
                                        return {};
                                    }

                                    const line = getTopLineStyle(depth);

                                    return {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: line.height,
                                        backgroundColor: depthColor,
                                        opacity: line.opacity,
                                    };
                                })(),

                                "&.Mui-selected::before": {
                                    opacity: 1,
                                    height: 5,
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
