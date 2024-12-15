import React from "react";
import { Box, Typography, Grid2 } from "@mui/material";

function WeaponPartsList({ categories, selectedParts }) {
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
                    {categories.map((category, index) => (
                        <Grid2 container spacing={2} key={index}>
                            <Grid2 size={3}>
                                <Typography>{category}</Typography>
                            </Grid2>
                            <Grid2 size={1}>
                                <Typography>:</Typography>
                            </Grid2>
                            <Grid2 size={8}>
                                <Typography>
                                    {selectedParts?.[category]?.["name"]}
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
