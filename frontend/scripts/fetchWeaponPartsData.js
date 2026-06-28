const fs = require("fs");
const path = require("path");

const SLOT_CATEGORY_MAP = {
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

const CATEGORY_OUTPUT_FILES = {
    RearSight: "rear_sight.json",
    Grips: "grips.json",
    Stocks: "stocks.json",
    Muzzles: "muzzles.json",
    Magazine: "magazine.json",
    Barrel: "barrel.json",
    Handguard: "handguard.json",
    Mount: "mount.json",
    Tactical: "tactical.json",
    Bipod: "bipod.json",
    NightVision: "night_vision.json",
    Foregrip: "foregrip.json",
    Gasblock: "gasblock.json",
    Launcher: "launcher.json",
    Reciever: "reciever.json",
    Charge: "charge.json",
    FrontSight: "front_sight.json",
    Scope: "scope.json",
};

const ITEM_FIELDS = `
  id
  name
  normalizedName
  shortName
  basePrice
  avg24hPrice
  lastLowPrice
  weight
  ergonomicsModifier
  accuracyModifier
  recoilModifier
  image512pxLink
  image8xLink
  categories {
    name
    normalizedName
  }
  conflictingItems {
    id
    name
  }
  conflictingSlotIds
  containsItems {
    item {
      id
      name
      types
    }
  }
  properties {
    ... on ItemPropertiesWeapon {
      slots {
        nameId
        filters {
          allowedItems {
            id
            name
            normalizedName
            shortName
            basePrice
            avg24hPrice
            lastLowPrice
            weight
            ergonomicsModifier
            accuracyModifier
            recoilModifier
            image512pxLink
            image8xLink
            conflictingItems {
              id
              name
            }
            conflictingSlotIds
          }
        }
      }
    }
    ... on ItemPropertiesWeaponMod {
      ergonomics
      recoilModifier
      accuracyModifier
      slots {
        nameId
        filters {
          allowedItems {
            id
            name
            normalizedName
            shortName
            basePrice
            avg24hPrice
            lastLowPrice
            weight
            ergonomicsModifier
            accuracyModifier
            recoilModifier
            image512pxLink
            image8xLink
            conflictingItems {
              id
              name
            }
            conflictingSlotIds
          }
        }
      }
    }
  }
`;

const query = `
query {
  items(lang: ja) {
${ITEM_FIELDS}
  }
}
`;

function sortItems(items) {
    return [...items].sort((a, b) => {
        const nameA = a.name ?? "";
        const nameB = b.name ?? "";
        return nameA.localeCompare(nameB, "ja");
    });
}

function compactItem(item) {
    return JSON.parse(JSON.stringify(item));
}

function writeJson(outputPath, items) {
    fs.writeFileSync(
        outputPath,
        JSON.stringify({ data: { items } }, null, 2) + "\n",
        "utf8"
    );
}

async function fetchItems() {
    const response = await fetch("https://api.tarkov.dev/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
        console.error(JSON.stringify(result.errors, null, 2));
        process.exit(1);
    }

    return result.data.items;
}

async function main() {
    const dataDir = path.resolve(__dirname, "../src/data");
    const items = await fetchItems();
    const itemById = new Map(items.map((item) => [item.id, item]));
    const categoryItems = Object.fromEntries(
        Object.keys(CATEGORY_OUTPUT_FILES).map((category) => [
            category,
            new Map(),
        ])
    );

    items.forEach((sourceItem) => {
        sourceItem.properties?.slots?.forEach((slot) => {
            const category = SLOT_CATEGORY_MAP[slot.nameId];
            const allowedItems = slot.filters?.allowedItems;

            if (!category || !Array.isArray(allowedItems)) {
                return;
            }

            allowedItems.forEach((allowedItem) => {
                const detailItem = itemById.get(allowedItem.id) ?? allowedItem;
                categoryItems[category].set(
                    allowedItem.id,
                    compactItem({
                        ...allowedItem,
                        ...detailItem,
                    })
                );
            });
        });
    });

    const weaponModMap = new Map();
    Object.values(categoryItems).forEach((itemsById) => {
        itemsById.forEach((item, id) => {
            weaponModMap.set(id, item);
        });
    });

    const weaponMods = sortItems([...weaponModMap.values()]);

    writeJson(path.resolve(dataDir, "weapon_mods.json"), weaponMods);
    console.log(`Wrote ${weaponMods.length} weapon mods to weapon_mods.json`);

    Object.entries(CATEGORY_OUTPUT_FILES).forEach(([category, fileName]) => {
        const outputPath = path.resolve(dataDir, fileName);
        const items = sortItems([...categoryItems[category].values()]);

        writeJson(outputPath, items);
        console.log(`Wrote ${items.length} ${category} items to ${fileName}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
