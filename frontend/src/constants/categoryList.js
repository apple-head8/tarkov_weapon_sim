import recieverData from "../data/reciever.json"; // JSONファイルをインポート

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
    "Foregrip",
    "Gasblock",
    "Launcher",
    "Reciever",
    "Charge",
    "FrontSight",
    "Scope",
];

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
    mod_magazine: "Magazine",
    mod_barrel: "Barrel",
    mod_handguard: "Handguard",
    mod_mount: "Mount",
    mod_mount_000: "Mount",
    mod_mount_001: "Mount",
    mod_mount_002: "Mount",
    mod_tactical: "Tactical",
    mod_tactical_000: "Tactical",
    mod_tactical_001: "Tactical",
    mod_tactical_002: "Tactical",
    mod_foregrip: "Foregrip",
    mod_gas_block: "Gasblock",
    mod_launcher: "Launcher",
    mod_reciever: "Reciever",
    mod_charge: "Charge",
    mod_charge_001: "Charge",
    mod_sight_front: "FrontSight",
    mod_scope: "Scope",
};

// カテゴリ名→jsonファイル名を探しに行く
// 選択したパーツのJsonデータを探すために使用
export const PART_DATA_MAP = {
    Reciever: recieverData,
    // 必要に応じて追加
};
