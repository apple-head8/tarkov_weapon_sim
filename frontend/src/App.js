import React, { useRef, useState } from "react";
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
import Sidebar from "./components/common/Sidebar";
import WeaponSelector from "./components/WeaponBuildSimulator/WeaponSelector";
import PartSelector from "./components/WeaponBuildSimulator/PartSelector";
import WeaponPartsList from "./components/WeaponBuildSimulator/WeaponPartsList";
import WeaponStatus from "./components/WeaponBuildSimulator/WeaponStatus";
import PresetSave from "./components/WeaponBuildSimulator/PresetSave";
import PresetList from "./components/WeaponBuildSimulator/PresetList";
import Header from "./components/common/Header";

const categories = ["Sights", "Grips", "Stocks", "Muzzles"];
const parts = {
    Sights: [
        { id: 1, name: "Red Dot", weight: 0.2, ergonomics: 5 },
        { id: 2, name: "Holo Sight", weight: 0.3, ergonomics: 4 },
        { id: 3, name: "Scope", weight: 0.5, ergonomics: 3 },
        { id: 4, name: "Scope2", weight: 0.5, ergonomics: 3 },
        { id: 5, name: "Scope3", weight: 0.5, ergonomics: 3 },
    ],
    Grips: [
        { id: 4, name: "Vertical Grip", weight: 0.3, ergonomics: 6 },
        { id: 5, name: "Angled Grip", weight: 0.25, ergonomics: 5 },
    ],
    Stocks: [
        { id: 6, name: "Adjustable Stock", weight: 0.4, ergonomics: 7 },
        { id: 7, name: "Fixed Stock", weight: 0.5, ergonomics: 5 },
    ],
    Muzzles: [
        { id: 8, name: "Suppressor", weight: 0.6, ergonomics: 2 },
        { id: 9, name: "Compensator", weight: 0.4, ergonomics: 3 },
    ],
};

const guns = [
    { id: 1, name: "AK-47", weight: 3.5, ergonomics: 20 },
    { id: 2, name: "M4A1", weight: 3.0, ergonomics: 25 },
    { id: 3, name: "MP5", weight: 2.8, ergonomics: 30 },
];

const TarkovWeaponSim = () => {
    const [selectedTab, setSelectedTab] = useState("Sights");
    const [selectedParts, setSelectedParts] = useState({});
    const [parameters, setParameters] = useState({ weight: 0, ergonomics: 0 });
    const [selectedGun, setSelectedGun] = useState(guns[0]);
    const [presetName, setPresetName] = useState("");
    const [presets, setPresets] = useState([]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handlePartSelect = (category, part) => {
        const updatedParts = { ...selectedParts, [category]: part };
        setSelectedParts(updatedParts);

        // Update parameters based on selected parts and gun
        const newParameters = Object.values(updatedParts).reduce(
            (acc, part) => {
                acc.weight += part.weight;
                acc.ergonomics += part.ergonomics;
                return acc;
            },
            { weight: selectedGun.weight, ergonomics: selectedGun.ergonomics }
        );
        setParameters(newParameters);
    };

    const clearPartSelect = (category) => {
        let deleteParts = { ...selectedParts };
        delete deleteParts?.[category];

        setSelectedParts(deleteParts);

        // Update parameters based on selected parts and gun
        const newParameters = Object.values(deleteParts).reduce(
            (acc, part) => {
                acc.weight += part.weight;
                acc.ergonomics += part.ergonomics;
                return acc;
            },
            { weight: selectedGun.weight, ergonomics: selectedGun.ergonomics }
        );
        setParameters(newParameters);
    };

    const handleGunChange = (event) => {
        const gun = guns.find((g) => g.id === event.target.value);
        setSelectedGun(gun);
        // データ用意後、初期状態のパーツをセットする関数に変更
        setSelectedParts({});

        // Recalculate parameters with the new gun
        const newParameters = Object.values(selectedParts).reduce(
            (acc, part) => {
                acc.weight += part.weight;
                acc.ergonomics += part.ergonomics;
                return acc;
            },
            { weight: gun.weight, ergonomics: gun.ergonomics }
        );
        setParameters(newParameters);
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
                <Box sx={{ flex: 1, padding: 3 }}>
                    {/* 再度横並び */}
                    <Grid2 container spacing={2}>
                        <Grid2 size={2}>
                            <WeaponSelector
                                guns={guns}
                                selectedGun={selectedGun}
                                handleGunChange={handleGunChange}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <PartSelector
                                selectedTab={selectedTab}
                                handleTabChange={handleTabChange}
                                categories={categories}
                                parts={parts}
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
