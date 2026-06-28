import React from "react";
import { Box, Typography, Grid2 } from "@mui/material";
import { getCategoryDisplayName } from "../../constants/categoryList";

function WeaponPartsList({ categoryKeys, categories, selectedParts }) {
    function getCategoryLabel(categoryKey) {
        const category = categories[categoryKey];
        if (!category) return categoryKey;

        return getCategoryDisplayName(categoryKey, category);
    }

    return (
        <>
            {/* Weapon Selected List */}
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                    minHeight: "320px",
                    height: "auto",
                }}
            >
                <Typography variant="h6">装着パーツ</Typography>
                <Box sx={{ padding: 2 }}>
                    {categoryKeys.map((categoryKey) => (
                        <Grid2
                            container
                            spacing={2}
                            key={categoryKey}
                            sx={{
                                py: 0.5,
                                borderBottom: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            <Grid2 size={3}>
                                <Typography
                                    sx={{
                                        overflowWrap: "anywhere",
                                        fontWeight: 700,
                                    }}
                                >
                                    {getCategoryLabel(categoryKey)}
                                </Typography>
                            </Grid2>
                            <Grid2 size={1}>
                                <Typography>:</Typography>
                            </Grid2>
                            <Grid2 size={8}>
                                <Typography
                                    sx={{
                                        overflowWrap: "anywhere",
                                        whiteSpace: "normal",
                                    }}
                                >
                                    {selectedParts?.[categoryKey]?.["name"]}
                                </Typography>
                            </Grid2>
                        </Grid2>
                    ))}
                </Box>
            </Box>
        </>
    );
}

export default WeaponPartsList;
