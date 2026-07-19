import React from "react";
import { AppBar, ButtonBase, Toolbar, Typography } from "@mui/material";

function Header({ onTitleClick }) {
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#2a2a2a",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar variant="dense">
                <ButtonBase
                    onClick={onTitleClick}
                    sx={{
                        borderRadius: 1,
                        px: 0.75,
                        py: 0.4,
                        color: "inherit",
                        textAlign: "left",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.08)",
                        },
                    }}
                    aria-label="初期状態に戻す"
                >
                    <Typography variant="h6" color="inherit" component="div">
                        Tarkov 武器ビルドシミュレーター
                    </Typography>
                </ButtonBase>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
