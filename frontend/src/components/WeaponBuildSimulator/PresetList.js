import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

function formatSavedAt(value) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const PresetList = ({
    presets,
    handleLoadPreset,
    handleDeletePreset,
    handleExportSavedPreset,
}) => {
    if (!presets.length) {
        return (
            <Box
                sx={{
                    marginTop: 2,
                    padding: 2,
                    backgroundColor: "#2a2a2a",
                    borderRadius: 1,
                    color: "rgba(255,255,255,0.72)",
                }}
            >
                <Typography variant="body2">
                    保存済みプリセットはまだありません。
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 2,
                marginTop: 2,
                overflowX: "auto",
                overflowY: "hidden",
                padding: 1,
                paddingBottom: 2,
                backgroundColor: "#2a2a2a",
                borderRadius: 1,
                minHeight: 188,
            }}
        >
            {presets.map((preset) => (
                <Card
                    key={preset.id}
                    sx={{
                        minWidth: 286,
                        maxWidth: 286,
                        backgroundColor: "#3a3a3a",
                        color: "#fff",
                        borderRadius: 1,
                        flexShrink: 0,
                        display: "flex",
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            width: "100%",
                            minHeight: 148,
                            boxSizing: "border-box",
                            "&:last-child": {
                                paddingBottom: 2,
                            },
                        }}
                    >
                        <Box sx={{ minHeight: 74 }}>
                            <Typography
                                variant="subtitle1"
                                title={preset.name}
                                sx={{
                                    fontWeight: 700,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {preset.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                title={preset.gun?.name}
                                sx={{
                                    color: "rgba(255,255,255,0.72)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {preset.gun?.name ?? "武器未選択"}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: "rgba(255,255,255,0.56)" }}
                            >
                                {formatSavedAt(preset.updatedAt)}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: 1,
                                marginTop: "auto",
                            }}
                        >
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleLoadPreset(preset)}
                            >
                                読込
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => handleExportSavedPreset(preset)}
                            >
                                JSON
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDeletePreset(preset.id)}
                            >
                                削除
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default PresetList;
