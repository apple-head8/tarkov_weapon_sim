import React from "react";
import { Box, Typography } from "@mui/material";

function Sidebar() {
    return (
        <>
            {/* Sidebar */}
            <Box
                sx={{
                    minWidth: 240,
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    height: "100vh",
                    padding: 2,
                    zIndex: -1,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    武器シミュ
                </Typography>
                <Typography variant="h6" gutterBottom>
                    光学サイト一覧
                </Typography>
            </Box>
        </>
    );
}

export default Sidebar;
