import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Select, MenuItem, styled } from "@mui/material";
import { GUN_TYPES } from "../../constants/gunTypes";
import {
    categoryArrayList,
    categoryListMapping,
} from "../../constants/categoryList";
import { WEAPON_DATA_MAP } from "../../constants/weaponDataMap";

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
        setSelectedGun("");
        setSelectedGunSlots(categoryArrayList);
        setSelectedParts({});
        setEnabledCategories({});
    }, [
        selectedType,
        setSelectedGun,
        setSelectedGunSlots,
        setSelectedParts,
        setEnabledCategories,
    ]);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleGunChange = (event) => {
        const id = event.target.value;
        const gun = gunLists.find((item) => item.id === id);

        setSelectedGun(gun ?? "");
        handleDefaultParts(gun);
    };

    const handleDefaultParts = (gunInfo) => {
        if (!gunInfo?.containsItems) {
            setSelectedParts({});
            return;
        }

        const defaultParts = {};

        gunInfo.containsItems.forEach((contained) => {
            const item = contained.item;
            const slot = gunInfo.properties?.slots?.find((slot) =>
                slot.filters?.allowedItems?.some(
                    (allowedItem) => allowedItem.id === item.id
                )
            );

            if (!slot) return;

            const matchedItem = slot.filters.allowedItems.find(
                (allowedItem) => allowedItem.id === item.id
            );
            const category = categoryListMapping[slot.nameId] || null;

            if (!category) return;

            defaultParts[category] = {
                id: item.id,
                name: item.name,
                category,
                weight: matchedItem?.weight || 0,
                ergonomicsModifier: matchedItem?.ergonomicsModifier || 0,
                image512pxLink: matchedItem?.image512pxLink || null,
                basePrice: matchedItem?.basePrice ?? null,
                avg24hPrice: matchedItem?.avg24hPrice ?? null,
                lastLowPrice: matchedItem?.lastLowPrice ?? null,
                isDefaultPart: true,
            };
        });

        setSelectedParts(defaultParts);
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
