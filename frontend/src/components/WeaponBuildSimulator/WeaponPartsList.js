import React from "react";
import { Box, Typography, Grid2 } from "@mui/material";

function WeaponPartsList({ categoryKeys, categories, selectedParts }) {
    function getCategoryLabel(categoryKey) {
        const category = categories[categoryKey];
        if (!category) return categoryKey;

        return category.index > 1
            ? `${category.categoryName} ${category.index}`
            : category.categoryName;
    }

    return (
        <>
            {/* Weapon Selected List */}
            <Box
                sx={{
                    marginTop: 3,
                    padding: 2,
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                    height: "320px",
                }}
            >
                <Typography variant="h6">Weapon Selected List</Typography>
                <Box sx={{ padding: 2 }}>
                    {categoryKeys.map((categoryKey) => (
                        <Grid2 container spacing={2} key={categoryKey}>
                            <Grid2 size={3}>
                                <Typography>{getCategoryLabel(categoryKey)}</Typography>
                            </Grid2>
                            <Grid2 size={1}>
                                <Typography>:</Typography>
                            </Grid2>
                            <Grid2 size={8}>
                                <Typography>
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
