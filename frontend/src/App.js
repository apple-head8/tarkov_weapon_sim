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
        setSelectedParts((prev) => ({
            ...prev,
            [category]: {
                ...part,
                category: category,
            },
        }));
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

    // ヘルパー: カテゴリに対応する JSON データを返す（例）
    function getJsonByCategory(categoryKey) {
        // PART_DATA_MAP は事前に用意しておく (例: { Reciever: recieverData, Barrel: barrelData, ... })
        return PART_DATA_MAP[categoryKey];
    }

    // categoryArrayList を安全に複製する関数
    function cloneCategoryArrayList() {
        return Object.fromEntries(
            Object.entries(categoryArrayList).map(([key, arr]) => [
                key,
                [...arr],
            ])
        );
    }

    /**
     * processSlots
     *
     * 指定された item（銃 or パーツ）が持つ「装着スロット」を読み取り、
     * newSlots（カテゴリごとの装着候補リスト）と enabledCategories（表示するタブ）を更新する。
     *
     * 役割：
     * - item.properties.slots の内容を読み取り、
     * - slotMapping からカテゴリ名を特定し、
     * - allowedItems（装着可能パーツ）を newSlots[category] に追加し、
     * - そのカテゴリを enabledCategories に登録する。
     *
     * @param {Object} item - 銃やパーツの JSON データ
     * @param {Object} newSlots - カテゴリごとの装着候補リスト（破壊的更新）
     * @param {Array} enabledCategories - 表示すべきカテゴリ一覧（破壊的更新）
     */
    function processSlots(item, newSlots, enabledCategories) {
        // パーツに slots 情報が無ければ何もしない
        if (!item?.properties?.slots) return;

        item.properties.slots.forEach((slot) => {
            // slot.nameId → カテゴリ名に置き換える
            const category = slotMapping[slot.nameId];
            if (!category) return;

            // allowedItems（装着できるパーツの配列）
            const allowed = slot.filters?.allowedItems;
            if (!Array.isArray(allowed) || allowed.length === 0) return;

            // newSlots[category] に装着候補パーツを追加
            allowed.forEach((allow) => {
                newSlots[category].push(allow);
            });

            // 表示すべきカテゴリリストに追加
            if (!enabledCategories.includes(category)) {
                enabledCategories.push(category);
            }
        });
    }

    /**
     * buildSlotsAndCategories
     *
     * 現在選択されている「銃」と「装備中パーツ」から、
     * - newSlots（カテゴリごとの装着候補リスト）
     * - enabled（表示すべきタブ一覧）
     * を再構築して返す。
     *
     * 役割：
     *   ① categoryArrayList を元に newSlots を初期化（deep clone）
     *   ② selectedGun の slots を newSlots に反映
     *   ③ selectedParts（装備中パーツ）の slots も反映
     *
     * この関数を呼ぶだけで、
     * 　「必要なタブが増えたり減ったりする UI 切替」
     * 　「適切な装着候補リストを作成」
     * がすべて自動で行われる。
     *
     * 戻り値：
     *   { newSlots, enabled }
     *
     * @param {Object} selectedGun - 現在選択中の銃
     * @param {Object} selectedParts - 現在装備中のパーツ一覧（category → part）
     */
    function buildSlotsAndCategories(selectedGun, selectedParts) {
        // ------------------------------------------------------
        // 1) newSlots を初期化（deep clone）
        //    categoryArrayList の中身は配列が多いため参照共有が起きると壊れる。
        //    cloneCategoryArrayList() はあなたが作った安全なディープコピー関数。
        // ------------------------------------------------------
        const newSlots = cloneCategoryArrayList();

        // ------------------------------------------------------
        // 2) enabledCategories = 有効化するタブの一覧（例：["receiver", "scope", "laser"]）
        // ------------------------------------------------------
        const enabled = [];

        // ------------------------------------------------------
        // 3) 銃に定義された slots を反映
        //    例）銃の JSON → properties.slots を processSlots() が解析して
        //       newSlots["receiver"], newSlots["scope"] などを埋める
        // ------------------------------------------------------
        if (selectedGun) {
            processSlots(selectedGun, newSlots, enabled);
        }

        // ------------------------------------------------------
        // 4) 装備中のパーツの slots を反映
        //    selectedParts = { receiver: {...}, scope: {...}, ... }
        //
        //    パーツ情報から category を取り出して、対応する JSON を取得して、
        //    その JSON 内で id が一致する本物のパーツ定義を探す。
        // ------------------------------------------------------
        Object.values(selectedParts || {}).forEach((part) => {
            const categoryKey = part.category || null;
            let partJson = null;

            // category から正しいパーツ JSON を取得
            if (categoryKey) {
                partJson = getJsonByCategory(categoryKey);
            }

            console.log(partJson);

            if (partJson) {
                // JSON 内で id が一致する元データを検索（properties を持っている本体）
                const found = partJson.data?.items?.find(
                    (i) => i.id === part.id
                );
                console.log(found);

                // processSlots を使って newSlots に反映
                if (found) processSlots(found, newSlots, enabled);
            } else {
                // ※必要ならここにフォールバック処理を書く
                // 例：selectedGunSlots の中の allowedItems を検索するなど
            }
        });

        // ------------------------------------------------------
        // 5) 最終結果を返す
        // ------------------------------------------------------
        return { newSlots, enabled };
    }

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
