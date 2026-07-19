import React from "react";
import { Box, Link, Typography } from "@mui/material";

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                px: { xs: 1.5, md: 3 },
                py: 2,
                backgroundColor: "#1b1b1b",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.66)",
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    fontSize: { xs: "0.74rem", sm: "0.8rem" },
                    lineHeight: 1.7,
                }}
            >
                データ提供:{" "}
                <Link
                    href="https://tarkov.dev/converter"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                >
                    tarkov.dev
                </Link>
                。本アプリは非公式のファンツールであり、Escape from
                TarkovおよびBattlestate Gamesとは関係ありません。
            </Typography>
        </Box>
    );
}

export default Footer;
