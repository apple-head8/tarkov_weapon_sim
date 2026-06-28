import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";

const PresetList = ({ presets, handleLoadPreset }) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                marginTop: 2,
                overflowX: "auto",
                padding: 1,
                backgroundColor: "#2a2a2a",
                borderRadius: 1,
                minHeight: 120,
            }}
        >
            {presets.map((preset, index) => (
                <Card
                    key={index}
                    sx={{
                        minWidth: 200,
                        backgroundColor: "#3a3a3a",
                        color: "#fff",
                        padding: 1,
                    }}
                >
                    <CardContent>
                        <Typography variant="body1">{preset.name}</Typography>
                        <Typography variant="body2">
                            武器: {preset.gun.name}
                        </Typography>
                    </CardContent>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleLoadPreset(preset)}
                    >
                        読み込み
                    </Button>
                </Card>
            ))}
        </Box>
    );
};

export default PresetList;
