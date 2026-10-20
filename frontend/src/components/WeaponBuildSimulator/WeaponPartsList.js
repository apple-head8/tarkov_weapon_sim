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
        <Box
            sx={{
                padding: { xs: 1.5, md: 2 },
                backgroundColor: "#2a2a2a",
                color: "#fff",
                borderRadius: 1,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                minHeight: { xs: "auto", md: "320px" },
                height: "auto",
            }}
        >
            <Typography variant="h6">装着パーツ</Typography>
            <Box sx={{ padding: { xs: 0.5, md: 2 } }}>
                {categoryKeys.map((categoryKey) => (
                    <Grid2
                        container
                        spacing={{ xs: 0.5, md: 2 }}
                        key={categoryKey}
                        sx={{
                            py: { xs: 0.75, md: 0.5 },
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                            <Typography
                                sx={{
                                    overflowWrap: "anywhere",
                                    fontWeight: 700,
                                    fontSize: { xs: "0.82rem", sm: "1rem" },
                                }}
                            >
                                {getCategoryLabel(categoryKey)}
                            </Typography>
                        </Grid2>
                        <Grid2
                            size={1}
                            sx={{ display: { xs: "none", sm: "block" } }}
                        >
                            <Typography>:</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 8 }}>
                            <Typography
                                sx={{
                                    overflowWrap: "anywhere",
                                    whiteSpace: "normal",
                                    textAlign: "center",
                                    color: "rgba(255,255,255,0.82)",
                                    fontSize: { xs: "0.86rem", sm: "1rem" },
                                }}
                            >
                                {selectedParts?.[categoryKey]?.name ?? "-"}
                            </Typography>
                        </Grid2>
                    </Grid2>
                ))}
            </Box>
        </Box>
    );
}

export default WeaponPartsList;
