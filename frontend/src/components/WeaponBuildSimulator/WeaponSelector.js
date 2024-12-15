import React from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";

function WeaponSelector({ guns, selectedGun, handleGunChange }) {
    return (
        <>
            {/* WeaponSelector */}
            <Typography variant="body2" gutterBottom>
                Select Gun
            </Typography>
            <Select
                value={selectedGun.id}
                onChange={handleGunChange}
                fullWidth
                sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    marginBottom: 2,
                }}
            >
                {guns.map((gun) => (
                    <MenuItem key={gun.id} value={gun.id}>
                        {gun.name}
                    </MenuItem>
                ))}
            </Select>
            <Box>武器の画像を表示する領域↑セレクトの縦幅小さくしたい</Box>
        </>
    );
}

export default WeaponSelector;
