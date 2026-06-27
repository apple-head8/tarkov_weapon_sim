import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Grid2 } from "@mui/material";
import "./App.css";
import Sidebar from "./components/common/Sidebar";
import WeaponPartsList from "./components/WeaponBuildSimulator/WeaponPartsList";
import WeaponStatus from "./components/WeaponBuildSimulator/WeaponStatus";
import PresetSave from "./components/WeaponBuildSimulator/PresetSave";
import PresetList from "./components/WeaponBuildSimulator/PresetList";
import Header from "./components/common/Header";
import WeaponSelector from "./components/WeaponBuildSimulator/WeaponSelector";
import PartSelector from "./components/WeaponBuildSimulator/PartSelector";
import { categoryArrayList } from "./constants/categoryList";
import ErrorMessage from "./components/common/ErrorMessage";
import { findConflictingPart } from "./utils/conflict";
import {
    buildOrderedCategoryKeys,
    buildSlotsAndCategories,
    removeCategoryAndDescendants,
} from "./utils/weaponBuild";

const TarkovWeaponSim = () => {
    const [selectedParts, setSelectedParts] = useState({});
    const [parameters, setParameters] = useState({
        weight: 0,
        ergonomics: 0,
        price: 0,
    });
    const [selectedGun, setSelectedGun] = useState(""); // 選択された銃のIDを管理 TODO:初期値の精査
    const [presetName, setPresetName] = useState("");
    const [presets, setPresets] = useState([]);
    const [selectedTab, setSelectedTab] = useState(null);
    const [selectedGunSlots, setSelectedGunSlots] = useState(categoryArrayList);
    const [error, setError] = useState("");
    const [enabledCategories, setEnabledCategories] = useState({});

    useEffect(() => {
        const newParameters = Object.values(selectedParts).reduce(
            (acc, part) => {
                acc.weight += part.weight || 0;
                acc.ergonomics += part.ergonomicsModifier || 0;
                acc.price += part.lastLowPrice || 0;
                return acc;
            },
            {
                weight: selectedGun?.weight || 0,
                ergonomics: selectedGun?.properties?.ergonomics || 0,
                price: selectedGun?.lastLowPrice || 0,
            }
        );
        setParameters(newParameters);
    }, [selectedGun, selectedParts]);

    // パーツ選択毎に、スロットの情報等を再計算する
    useEffect(() => {
        const { newSlots, enabled } = buildSlotsAndCategories(
            selectedGun,
            selectedParts
        );
        setSelectedGunSlots(newSlots);
        setEnabledCategories(enabled);
    }, [selectedGun, selectedParts]);

    useEffect(() => {
        // enabledCategories が更新されたら、
        // もし現在の selectedTab が存在しない or 無効 なら、
        // 最初のタブに自動で切り替える
        const keys = Object.keys(enabledCategories || []);

        if (keys.length > 0 && !keys.includes(selectedTab)) {
            setSelectedTab(keys[0]);
        }
    }, [enabledCategories, selectedTab]);

    const sortedCategories = useMemo(() => {
        return buildOrderedCategoryKeys(enabledCategories);
    }, [enabledCategories]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handlePartSelect = (category, part) => {
        // 競合しているパーツが現在装備されているか確認（双方向チェック）
        const conflicted = findConflictingPart(part, selectedParts);

        if (conflicted) {
            // 競合が見つかった場合はエラーメッセージを表示して終了
            const { category: conflictedCategory, part: conflictedItem } =
                conflicted;
            setError(
                `${part.name} は ${conflictedItem.name}（${conflictedCategory}）と競合しています。`
            );
            return;
        }

        // エラーをリセット（正常に選択できる場合）
        setError("");

        setSelectedParts((prev) => ({
            ...removeCategoryAndDescendants(prev, category, enabledCategories),
            [category]: {
                ...part,
                category: category,
            },
        }));
    };

    const clearPartSelect = (category) => {
        setSelectedParts((prev) =>
            removeCategoryAndDescendants(prev, category, enabledCategories)
        );
    };

    const handleSavePreset = () => {
        if (!presetName.trim()) return;
        const newPreset = {
            name: presetName,
            parts: { ...selectedParts },
            parameters: { ...parameters },
            gun: selectedGun,
        };
        setPresets([...presets, newPreset]);
        setPresetName("");
    };

    const handleLoadPreset = (preset) => {
        setSelectedGun(preset.gun);
        setSelectedParts(preset.parts);
        setParameters(preset.parameters);
    };

    return (
        <>
            {/* // サイドバーとその他要素で横並びにする */}
            <Header />
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                {/* ここから再度縦並び */}
                {/* flex 1 は、画面横幅いっぱい使うような設定 */}
                <Box sx={{ flex: 1, padding: 3, overflow: "hidden" }}>
                    {error && <ErrorMessage message={error} />}
                    {/* 再度横並び */}
                    <Grid2 container spacing={2}>
                        <Grid2 size={2}>
                            <WeaponSelector
                                selectedGun={selectedGun}
                                setSelectedGun={setSelectedGun}
                                setSelectedGunSlots={setSelectedGunSlots}
                                setSelectedParts={setSelectedParts}
                                setEnabledCategories={setEnabledCategories}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            {selectedTab && (
                                <PartSelector
                                    selectedTab={selectedTab}
                                    handleTabChange={handleTabChange}
                                    categoryKeys={sortedCategories}
                                    categories={enabledCategories}
                                    parts={selectedGunSlots}
                                    handlePartSelect={handlePartSelect}
                                    selectedParts={selectedParts}
                                    clearPartSelect={clearPartSelect}
                                />
                            )}
                        </Grid2>
                    </Grid2>

                    <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                            <WeaponPartsList
                                categoryKeys={sortedCategories}
                                categories={enabledCategories}
                                selectedParts={selectedParts}
                            />
                        </Grid2>
                        <Grid2 size={6}>
                            <WeaponStatus parameters={parameters} />
                        </Grid2>
                    </Grid2>

                    {/* Preset Save and List */}
                    <Box
                        sx={{
                            marginTop: 3,
                            padding: 2,
                            backgroundColor: "#1e1e1e",
                            color: "#fff",
                            borderRadius: 1,
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <Typography variant="h6">Save Preset</Typography>
                        <PresetSave
                            presetName={presetName}
                            setPresetName={setPresetName}
                            handleSavePreset={handleSavePreset}
                        />
                        <PresetList
                            presets={presets}
                            handleLoadPreset={handleLoadPreset}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default TarkovWeaponSim;
