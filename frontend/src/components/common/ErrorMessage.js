import React from "react";
import { Box, Typography } from "@mui/material";

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <Box
            sx={{
                border: "1px solid rgba(244, 67, 54, 0.8)", // 赤枠・半透明
                backgroundColor: "rgba(244, 67, 54, 0.2)", // 赤背景・半透明
                color: "#ffffff", // 白文字
                padding: "8px 12px",
                borderRadius: "4px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Typography variant="body2">{message}</Typography>
        </Box>
    );
};

export default ErrorMessage;
