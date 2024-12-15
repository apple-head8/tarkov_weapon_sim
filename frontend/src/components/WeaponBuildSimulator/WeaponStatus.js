import React from "react";
import { Box, Typography } from "@mui/material";

function WeaponStatus({ parameters }) {
    return (
        <>
            {/* WeaponStatus */}
            <Box
                sx={{
                    marginTop: 3,
                    padding: 2,
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                }}
            >
                <Typography variant="h6">Weapon Parameters</Typography>
                <Box sx={{ padding: 2 }}>
                    <Typography>
                        Weight: {parameters.weight.toFixed(2)}kg
                    </Typography>
                    <Typography>Ergonomics: {parameters.ergonomics}</Typography>
                </Box>
            </Box>
        </>
    );
}

export default WeaponStatus;
