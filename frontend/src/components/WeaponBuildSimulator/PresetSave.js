import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const PresetSave = ({ presetName, setPresetName, handleSavePreset }) => {
    return (
        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <TextField
                variant="outlined"
                size="small"
                label="Preset Name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                sx={{ flex: 1, backgroundColor: "#fff" }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSavePreset}
            >
                Save
            </Button>
        </Box>
    );
};

export default PresetSave;
