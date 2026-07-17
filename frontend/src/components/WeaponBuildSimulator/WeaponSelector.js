import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Select, MenuItem, styled } from "@mui/material";
import { GUN_TYPES } from "../../constants/gunTypes";
import { categoryArrayList } from "../../constants/categoryList";
import { WEAPON_DATA_MAP } from "../../constants/weaponDataMap";
import { buildDefaultPartsForGun } from "../../utils/weaponBuild";

function WeaponSelector({
    selectedGun,
    setSelectedGun,
    setSelectedGunSlots,
    setSelectedParts,
    setEnabledCategories,
}) {
    const [selectedType, setSelectedType] = useState("");

    const gunLists = useMemo(() => {
        if (!selectedType) return [];

        return WEAPON_DATA_MAP[selectedType]?.data?.items ?? [];
    }, [selectedType]);

    useEffect(() => {
        if (!selectedGun?.id) return;

        const matchedType = Object.entries(WEAPON_DATA_MAP).find(([, data]) =>
            data.data.items.some((weapon) => weapon.id === selectedGun.id)
        )?.[0];

        if (matchedType && matchedType !== selectedType) {
            setSelectedType(matchedType);
        }
    }, [selectedGun, selectedType]);

    const handleTypeChange = (event) => {
        const type = event.target.value;

        setSelectedType(type);
        setSelectedGun("");
        setSelectedGunSlots(categoryArrayList);
        setSelectedParts({});
        setEnabledCategories({});
    };

    const handleGunChange = (event) => {
        const id = event.target.value;
        const gun = gunLists.find((item) => item.id === id);

        setSelectedGun(gun ?? "");
        handleDefaultParts(gun);
    };

    const handleDefaultParts = (gunInfo) => {
        setSelectedParts(buildDefaultPartsForGun(gunInfo));
    };

    const StyledSelect = styled(Select)(({ theme }) => ({
        "& .MuiSelect-select": {
            backgroundColor:
                theme.palette.mode === "dark" ? "#424242" : "white",
            color: theme.palette.mode === "dark" ? "white" : "black",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
                theme.palette.mode === "dark"
                    ? "#6b6b6b"
                    : "rgba(0, 0, 0, 0.23)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor:
                theme.palette.mode === "dark"
                    ? "#8a8a8a"
                    : "rgba(0, 0, 0, 0.87)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.mode === "dark" ? "#bb86fc" : "#1976d2",
        },
        "& .MuiSvgIcon-root": {
            color: theme.palette.mode === "dark" ? "white" : "black",
        },
    }));

    const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#303030" : "white",
        "&:hover": {
            backgroundColor:
                theme.palette.mode === "dark" ? "#4a4a4a" : "#e0e0e0",
        },
        color: theme.palette.mode === "dark" ? "white" : "black",
        height: "40px",
    }));

    return (
        <Box
            sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                padding: 2,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h6" gutterBottom>
                武器選択
            </Typography>

            <Typography variant="body2" gutterBottom>
                武器種別
            </Typography>
            <StyledSelect
                labelId="gun-type-select-label"
                id="gun-type-select"
                value={selectedType}
                onChange={handleTypeChange}
                fullWidth
                size="small"
            >
                {Object.entries(GUN_TYPES).map(([key, value]) => (
                    <StyledMenuItem key={key} value={key}>
                        {value}
                    </StyledMenuItem>
                ))}
            </StyledSelect>

            <Typography variant="body2" gutterBottom>
                武器
            </Typography>
            <StyledSelect
                value={selectedGun?.id ?? ""}
                onChange={handleGunChange}
                fullWidth
                size="small"
                disabled={!gunLists.length}
            >
                {gunLists.length === 0 ? (
                    <MenuItem key="empty" value="" />
                ) : (
                    gunLists.map((weapon) => (
                        <StyledMenuItem key={weapon.id} value={weapon.id}>
                            {weapon.name}
                        </StyledMenuItem>
                    ))
                )}
            </StyledSelect>
        </Box>
    );
}

export default WeaponSelector;
