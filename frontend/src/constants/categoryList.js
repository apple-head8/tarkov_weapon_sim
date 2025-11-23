import recieverData from "../data/reciever.json"; // JSONファイルをインポート

export const categoryList = [
    "RearSight",
    "Grips",
    "Stocks",
    "Muzzles",
    "Magazine",
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
    Gasblock: [],
    Launcher: [],
    Reciever: [],
    Charge: [],
    FrontSight: [],
    Scope: [],
};

export const categoryListMapping = {
    mod_pistol_grip: "Grips",
    mod_stock: "Stocks",
    mod_sight_rear: "RearSight",
    mod_muzzle: "Muzzles",
    mod_magazine: "Magazine",
    mod_gas_block: "Gasblock",
    mod_launcher: "Launcher",
    // mod_pistol_grip_akms: "Grips",
    mod_reciever: "Reciever",
    // mod_stock_akms: "Stocks",
    mod_charge: "Charge",
    mod_sight_front: "FrontSight",
    mod_scope: "Scope",
};

// カテゴリ名→jsonファイル名を探しに行く
// 選択したパーツのJsonデータを探すために使用
export const PART_DATA_MAP = {
    Reciever: recieverData,
    // 必要に応じて追加
};
