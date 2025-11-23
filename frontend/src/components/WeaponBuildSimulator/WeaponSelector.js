import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, styled } from "@mui/material";
import { GUN_TYPES } from "../../constants/gunTypes";
import {
    categoryArrayList,
    categoryListMapping,
} from "../../constants/categoryList";
import assaultRifleData from "../../data/assault_rifle.json"; // JSONファイルをインポート

function WeaponSelector({
    selectedGun,
    setSelectedGun,
    setSelectedGunSlots,
    setSelectedParts,
    setEnabledCategories,
}) {
    const [selectedType, setSelectedType] = useState("");
    const [gunLists, setGunLists] = useState("");

    useEffect(() => {
        if (selectedType) {
            if (selectedType === "assault_rifle") {
                setGunLists(
                    assaultRifleData.data.items.filter(
                        (item) => Object.keys(item.properties).length > 0
                    )
                );
            } else {
                setGunLists("");
                setSelectedGun("");
                setSelectedGunSlots(categoryArrayList);
                setSelectedParts({});
            }
        } else {
            setGunLists("");
            setSelectedGun("");
            setSelectedGunSlots(categoryArrayList);
            setSelectedParts({});
        }
    }, [selectedType]);

    const handleChange = (event) => {
        setSelectedType(event.target.value);
    };

    const slotMapping = categoryListMapping;

    // 銃選択時のイベント
    const handleGunChange = (event) => {
        const gun_id = event.target.value;
        // 定数データ郡から対象の銃情報を取得
        const selectedGunInfo = assaultRifleData.data.items.find(
            (item) =>
                item.id === gun_id && Object.keys(item.properties).length > 0
        );
        setSelectedGun(selectedGunInfo);

        if (selectedGunInfo && selectedGunInfo.properties.slots) {
            const newSlots = Object.fromEntries(
                Object.entries(categoryArrayList).map(([key, arr]) => [
                    key,
                    [...arr],
                ])
            );

            let enabledCategories = [];

            selectedGunInfo.properties.slots.forEach((slot) => {
                const category = slotMapping[slot.nameId] || null;
                if (category) {
                    // 表示するタブを管理
                    if (!enabledCategories.includes(category)) {
                        enabledCategories.push(category);
                    }
                    slot.filters.allowedItems.forEach((item) => {
                        newSlots[category].push(item);
                    });
                }
            });

            setSelectedGunSlots(newSlots);
            setEnabledCategories(enabledCategories);
        } else {
            setSelectedGunSlots(categoryArrayList);
        }

        handleDefaultParts(selectedGunInfo);
    };

    // 武器選択時の初期パーツセット
    const handleDefaultParts = (gunInfo) => {
        if (!gunInfo || !gunInfo.containsItems) {
            setSelectedParts({});
            return;
        }

        const defaultParts = {};
        gunInfo.containsItems.forEach((contained) => {
            const item = contained.item;
            const slot = gunInfo.properties?.slots?.find((s) =>
                s.filters.allowedItems.some((allowed) => allowed.id === item.id)
            );

            // // 初期パーツに子要素があったときの考慮
            // // この考慮が必要かどうかはあとから精査
            // // ここではtypesを確認してreceiver.jsonなどから詳細を取得
            // if (item.types?.includes("pistolGrip")) {
            //     const receiverItem = receiverData.data.items.find(
            //         (r) => r.id === item.id
            //     );
            //     if (receiverItem) {
            //         console.log("Receiver found:", receiverItem);
            //         // ここで receiverItem.properties.slots を使っても良い
            //     }
            // }

            if (slot) {
                const matchedItem = slot.filters.allowedItems.find(
                    (i) => i.id === item.id
                );
                const category = slotMapping[slot.nameId] || null;
                if (category) {
                    defaultParts[category] = {
                        id: item.id,
                        name: item.name,
                        weight: matchedItem?.weight || 0,
                        ergonomicsModifier:
                            matchedItem?.ergonomicsModifier || 0,
                        image512pxLink: matchedItem?.image512pxLink || null,
                        lastLowPrice: matchedItem?.lastLowPrice || "-",
                    };
                }
            }
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
        height: "40px", // 高さを少し小さめに調整
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
                Weapon Selector
            </Typography>

            {/* Gun Type Selection */}
            <Typography variant="body2" gutterBottom>
                Select Gun Type
            </Typography>
            <StyledSelect
                labelId="gun-type-select-label"
                id="gun-type-select"
                value={selectedType}
                onChange={handleChange}
                fullWidth
                size="small"
            >
                {Object.entries(GUN_TYPES).map(([key, value]) => (
                    <StyledMenuItem key={key} value={key}>
                        {value}
                    </StyledMenuItem>
                ))}
            </StyledSelect>

            {/* Gun Model Selection */}
            <Typography variant="body2" gutterBottom>
                Select Gun Model
            </Typography>
            <StyledSelect
                value={selectedGun.id ?? ""}
                onChange={handleGunChange}
                fullWidth
                size="small"
            >
                {gunLists === "" ? (
                    <MenuItem key={1} value={""}></MenuItem>
                ) : (
                    gunLists.map((value, index) => (
                        <StyledMenuItem key={index} value={value.id}>
                            {value.name}
                        </StyledMenuItem>
                    ))
                )}
            </StyledSelect>

            {/* 武器の画像などをここに置く */}
            <Box>武器の画像を表示する領域</Box>
        </Box>
    );
}

export default WeaponSelector;
