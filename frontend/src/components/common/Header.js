import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

function Header() {
    return (
        <>
            {/* Header */}
            <AppBar
                position="static"
                sx={{
                    backgroundColor: "#2a2a2a",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div">
                        タルコフ武器シミュレーター
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Header;
