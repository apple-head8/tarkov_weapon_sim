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
    PART_DATA_MAP,
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
    const [selectedTab, setSelectedTab] = useState(null);
    const [selectedGunSlots, setSelectedGunSlots] = useState(categoryArrayList);
    const [error, setError] = useState("");
    const [enabledCategories, setEnabledCategories] = useState([]);
    // 変数の置き換えいる？
    const slotMapping = categoryListMapping;

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

    useEffect(() => {
        // enabledCategories が更新されたら、
        // もし現在の selectedTab が存在しない or 無効 なら、
        // 最初のタブに自動で切り替える
        if (
            enabledCategories.length > 0 &&
            !enabledCategories.includes(selectedTab)
        ) {
            setSelectedTab(enabledCategories[0]);
        }
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

        // パーツを選択状態に追加
        const updatedParts = { ...selectedParts, [category]: part };
        setSelectedParts(updatedParts);

        // パーツが新しいスロットを持っている場合、スロットの情報を追加
        // カテゴリに応じて JSON を切り替える
        const dataSource = PART_DATA_MAP[category];
        if (!dataSource) {
            console.warn("⚠ 未対応カテゴリ: ", category);
            return;
        }

        // 対象パーツを JSON 内から検索
        const selectedRecieverInfo = dataSource.data.items.find(
            (item) =>
                item.id === part.id && Object.keys(item.properties).length > 0
        );

        // 子スロットが存在すれば selectedGunSlots に追加
        const hasValidSlots = selectedRecieverInfo.properties?.slots?.some(
            (slot) =>
                Array.isArray(slot.filters.allowedItems) &&
                slot.filters.allowedItems.length > 0
        );

        if (!hasValidSlots) {
            console.log(
                "🟡 allowedItems が全て空配列なので子スロット処理をスキップ:",
                part.name
            );
            return;
        }

        const newSlots = { ...selectedGunSlots };
        const addedCategories = new Set();

        selectedRecieverInfo.properties.slots.forEach((slot) => {
            const category = slotMapping[slot.nameId] || null;
            console.log(category);

            if (category) {
                // 表示するタブを管理
                // タブがmodによって追加される場合、定義していないタブとなる
                // スコープ１，スコープ２、、、のように
                // そのため、既存の定数に持っているタブかどうかという判定は行わない
                // if (!enabledCategories.includes(category)) {
                //     enabledCategories.push(category);
                // }

                // slotsパーツ郡をセットする
                slot.filters.allowedItems.forEach((item) => {
                    newSlots[category].push(item);
                    //タブを追加する
                    addedCategories.add(category);
                });
            }
        });

        setSelectedGunSlots(newSlots);
        setEnabledCategories((prev) => {
            const set = new Set(prev);
            addedCategories.forEach((c) => set.add(c));
            return [...set];
        });
        console.log(
            "🔧 子スロットを追加しました:",
            selectedRecieverInfo.properties.slots
        );
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
                                setEnabledCategories={setEnabledCategories}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            {selectedTab && (
                                <PartSelector
                                    selectedTab={selectedTab}
                                    handleTabChange={handleTabChange}
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
