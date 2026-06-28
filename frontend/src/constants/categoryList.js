import recieverData from "../data/reciever.json";
import scopeData from "../data/scope.json";
import rearSightData from "../data/rear_sight.json";
import gripsData from "../data/grips.json";
import stocksData from "../data/stocks.json";
import muzzlesData from "../data/muzzles.json";
import magazineData from "../data/magazine.json";
import barrelData from "../data/barrel.json";
import handguardData from "../data/handguard.json";
import mountData from "../data/mount.json";
import tacticalData from "../data/tactical.json";
import bipodData from "../data/bipod.json";
import nightVisionData from "../data/night_vision.json";
import foregripData from "../data/foregrip.json";
import gasblockData from "../data/gasblock.json";
import launcherData from "../data/launcher.json";
import chargeData from "../data/charge.json";
import frontSightData from "../data/front_sight.json";

export const categoryList = [
    "RearSight",
    "Grips",
    "Stocks",
    "Muzzles",
    "Magazine",
    "Barrel",
    "Handguard",
    "Mount",
    "Tactical",
    "Bipod",
    "NightVision",
    "Foregrip",
    "Gasblock",
    "Launcher",
    "Reciever",
    "Charge",
    "FrontSight",
    "Scope",
];

export const categoryLabelMap = {
    RearSight: "リアサイト",
    Grips: "グリップ",
    Stocks: "ストック",
    Muzzles: "マズル",
    Magazine: "マガジン",
    Barrel: "バレル",
    Handguard: "ハンドガード",
    Mount: "マウント",
    Tactical: "タクティカル",
    Bipod: "バイポッド",
    NightVision: "ナイトビジョン",
    Foregrip: "フォアグリップ",
    Gasblock: "ガスブロック",
    Launcher: "ランチャー",
    Reciever: "レシーバー",
    Charge: "チャージングハンドル",
    FrontSight: "フロントサイト",
    Scope: "スコープ",
};

export function getCategoryDisplayName(categoryKey, categoryInfo = null) {
    const baseKey = categoryInfo?.categoryName ?? categoryKey?.split("#")[0];
    const label = categoryLabelMap[baseKey] ?? baseKey ?? "";
    const index = categoryInfo?.index;

    return index > 1 ? `${label} ${index}` : label;
}

export const categoryArrayList = {
    RearSight: [],
    Grips: [],
    Stocks: [],
    Muzzles: [],
    Magazine: [],
    Barrel: [],
    Handguard: [],
    Mount: [],
    Tactical: [],
    Bipod: [],
    NightVision: [],
    Foregrip: [],
    Gasblock: [],
    Launcher: [],
    Reciever: [],
    Charge: [],
    FrontSight: [],
    Scope: [],
};

export const categoryListMapping = {
    mod_pistol_grip: "Grips",
    mod_pistol_grip_akms: "Grips",
    mod_stock: "Stocks",
    mod_stock_000: "Stocks",
    mod_stock_001: "Stocks",
    mod_stock_akms: "Stocks",
    mod_sight_rear: "RearSight",
    mod_muzzle: "Muzzles",
    mod_muzzle_000: "Muzzles",
    mod_muzzle_001: "Muzzles",
    mod_magazine: "Magazine",
    mod_barrel: "Barrel",
    mod_handguard: "Handguard",
    mod_mount: "Mount",
    mod_mount_000: "Mount",
    mod_mount_001: "Mount",
    mod_mount_002: "Mount",
    mod_mount_003: "Mount",
    mod_mount_004: "Mount",
    mod_mount_005: "Mount",
    mod_mount_006: "Mount",
    mod_tactical: "Tactical",
    mod_tactical001: "Tactical",
    mod_tactical002: "Tactical",
    mod_tactical_000: "Tactical",
    mod_tactical_001: "Tactical",
    mod_tactical_002: "Tactical",
    mod_tactical_003: "Tactical",
    mod_tactical_004: "Tactical",
    mod_tactical_2: "Tactical",
    mod_flashlight: "Tactical",
    mod_bipod: "Bipod",
    mod_nvg: "NightVision",
    mod_foregrip: "Foregrip",
    mod_gas_block: "Gasblock",
    mod_launcher: "Launcher",
    mod_reciever: "Reciever",
    mod_charge: "Charge",
    mod_charge_001: "Charge",
    mod_pistolgrip: "Grips",
    mod_pistolgrip_000: "Grips",
    mod_pistolgrip_001: "Grips",
    mod_sight_front: "FrontSight",
    mod_scope: "Scope",
    mod_scope_000: "Scope",
    mod_scope_001: "Scope",
    mod_scope_002: "Scope",
    mod_scope_003: "Scope",
    mod_stock_002: "Stocks",
    mod_stock_003: "Stocks",
    mod_stock_axis: "Stocks",
};

export const PART_DATA_MAP = {
    RearSight: rearSightData,
    Grips: gripsData,
    Stocks: stocksData,
    Muzzles: muzzlesData,
    Magazine: magazineData,
    Barrel: barrelData,
    Handguard: handguardData,
    Mount: mountData,
    Tactical: tacticalData,
    Bipod: bipodData,
    NightVision: nightVisionData,
    Foregrip: foregripData,
    Gasblock: gasblockData,
    Launcher: launcherData,
    Reciever: recieverData,
    Charge: chargeData,
    FrontSight: frontSightData,
    Scope: scopeData,
};
