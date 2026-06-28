import React from "react";
import { Box, Typography } from "@mui/material";

function Sidebar() {
    return (
        <Box
            component="aside"
            sx={{
                width: 240,
                flex: "0 0 240px",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                padding: 2,
                overflowY: "auto",
                alignSelf: "stretch",
            }}
        >
            <Typography variant="h6" gutterBottom>
                武器シミュレーター
            </Typography>
            <Typography variant="h6" gutterBottom>
                光学サイト一覧
            </Typography>
        </Box>
    );
}

export default Sidebar;
