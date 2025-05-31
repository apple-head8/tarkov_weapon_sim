import React, { useRef, useState, useEffect } from "react";
import {
    Tabs,
    Tab,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Grid2,
} from "@mui/material";
import "./App.css";
import axios from "axios";
import Sidebar from "./components/common/Sidebar";
import WeaponPartsList from "./components/WeaponBuildSimulator/WeaponPartsList";
import WeaponStatus from "./components/WeaponBuildSimulator/WeaponStatus";
import PresetSave from "./components/WeaponBuildSimulator/PresetSave";
import PresetList from "./components/WeaponBuildSimulator/PresetList";
import Header from "./components/common/Header";
import WeaponSelector from "./components/WeaponBuildSimulator/WeaponSelector";
import PartSelector from "./components/WeaponBuildSimulator/PartSelector";
import {
    categoryList,
    categoryArrayList,
    categoryListMapping,
} from "./constants/categoryList";
import ErrorMessage from "./components/common/ErrorMessage";
import { findConflictingPart } from "./utils/conflict";

const categories = categoryList;

const baseURL = "http://localhost:8000"; // Laravelサーバーのアドレスとポート

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
    const [selectedTab, setSelectedTab] = useState("RearSight");
    const [selectedGunSlots, setSelectedGunSlots] = useState(categoryArrayList);
    const [error, setError] = useState("");

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

        // パーツを選択状態に追加
        const updatedParts = { ...selectedParts, [category]: part };
        setSelectedParts(updatedParts);
    };

    const clearPartSelect = (category) => {
        let deleteParts = { ...selectedParts };
        delete deleteParts?.[category];

        setSelectedParts(deleteParts);
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
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <PartSelector
                                selectedTab={selectedTab}
                                handleTabChange={handleTabChange}
                                categories={categories}
                                parts={selectedGunSlots}
                                handlePartSelect={handlePartSelect}
                                selectedParts={selectedParts}
                                clearPartSelect={clearPartSelect}
                            />
                        </Grid2>
                    </Grid2>

                    <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                            <WeaponPartsList
                                categories={categories}
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
