import React from "react";
import { Box, Typography } from "@mui/material";

function WeaponStatus({ parameters }) {
    function clampPercent(value, max) {
        return Math.min(Math.max((value / max) * 100, 0), 100);
    }

    function StatusBar({ label, value, displayValue, max, color }) {
        const percent = clampPercent(value, max);

        return (
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 0.5,
                    }}
                >
                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                        }}
                    >
                        {label}
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 700 }}>
                        {displayValue}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        height: 8,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: 999,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            width: `${percent}%`,
                            height: "100%",
                            backgroundColor: color,
                            borderRadius: 999,
                            transition: "width 0.2s ease",
                        }}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <>
            {/* WeaponStatus */}
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                }}
            >
                <Typography variant="h6">武器性能</Typography>
                <Box
                    sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >
                    <StatusBar
                        label="重量"
                        value={parameters.weight}
                        displayValue={`${parameters.weight.toFixed(2)} kg`}
                        max={8}
                        color="#8b9cff"
                    />
                    <StatusBar
                        label="エルゴノミクス"
                        value={parameters.ergonomics}
                        displayValue={parameters.ergonomics}
                        max={100}
                        color="#bb86fc"
                    />
                    <StatusBar
                        label="価格"
                        value={parameters.price}
                        displayValue={`¥${parameters.price.toLocaleString()}`}
                        max={500000}
                        color="#c026d3"
                    />
                </Box>
            </Box>
        </>
    );
}

export default WeaponStatus;
