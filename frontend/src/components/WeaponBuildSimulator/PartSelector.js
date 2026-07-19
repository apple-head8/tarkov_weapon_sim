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
    defaultPartIdsBySlotKey,
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

        return category.parent !== null || category.children?.length > 0;
    }

    function getTopLineStyle(depth) {
        return {
            color: "primary.main",
            opacity: depth === 0 ? 1 : 0.9,
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

    function withDefaultPartFlag(categoryKey, part) {
        if (!part) return part;

        return {
            ...part,
            isDefaultPart: defaultPartIdsBySlotKey?.[categoryKey] === part.id,
        };
    }

    return (
        <>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    maxWidth: "100%",
                    "& .MuiTabs-scroller": {
                        overflowX: "auto",
                    },
                }}
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
                                            maxWidth: { xs: 128, sm: 160 },
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontSize: "0.82rem",
                                                lineHeight: 1.2,
                                                fontWeight: 700,
                                                overflowWrap: "anywhere",
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
                                minWidth: { xs: 112, sm: 140 },
                                alignItems: "center",
                                px: 1.5,
                                background: "transparent",
                                "&.Mui-selected": {
                                    background: "transparent",
                                },
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

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                    minWidth: 0,
                }}
            >
                <Box
                    sx={{
                        width: { xs: 132, sm: 150 },
                        height: { xs: 190, sm: 200 },
                        display: "grid",
                        margin: { xs: "10px 10px 0", sm: "10px" },
                        flexShrink: 0,
                    }}
                >
                    <PartCard
                        part={selectedParts[selectedTab]}
                        isSelectedCard={true}
                        onClick={() => clearPartSelect(selectedTab)}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        width: "100%",
                        minWidth: 0,
                        pb: 1,
                    }}
                >
                    {(parts[selectedTab] ?? []).map((part) => (
                        <Box
                            sx={{
                                width: { xs: 132, sm: 150 },
                                height: { xs: 190, sm: 200 },
                                display: "grid",
                                margin: "10px",
                                flexShrink: 0,
                            }}
                            key={part.id}
                        >
                            <PartCard
                                part={withDefaultPartFlag(selectedTab, part)}
                                isSelected={
                                    selectedParts[selectedTab]?.id === part.id
                                }
                                onClick={() =>
                                    handlePartSelect(selectedTab, part)
                                }
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}

export default PartSelector;
