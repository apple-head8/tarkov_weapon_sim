import React, { useRef } from "react";
import { Box, Button, TextField } from "@mui/material";

const PresetSave = ({
    presetName,
    setPresetName,
    handleExportCurrentPreset,
    handleImportPresetFile,
    canSave,
}) => {
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        handleImportPresetFile(file);
        event.target.value = "";
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "minmax(240px, 1fr) auto auto",
                },
                gap: 1.5,
                marginTop: 2,
                alignItems: "center",
            }}
        >
            <TextField
                variant="outlined"
                size="small"
                label="プリセット名"
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
                sx={{
                    borderRadius: 1,
                    "& .MuiInputBase-root": {
                        backgroundColor: "#2a2a2a",
                        color: "#fff",
                    },
                    "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.72)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "primary.main",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.24)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.48)",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                    },
                }}
            />
            <Button
                type="button"
                variant="contained"
                color="primary"
                disabled={!canSave}
                onClick={handleExportCurrentPreset}
                sx={{ minWidth: 104 }}
            >
                JSON保存
            </Button>
            <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={handleImportClick}
                sx={{ minWidth: 104 }}
            >
                JSON読込
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </Box>
    );
};

export default PresetSave;
