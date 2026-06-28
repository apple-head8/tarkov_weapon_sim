const fs = require("fs");
const path = require("path");

const WEAPON_OUTPUTS = {
    Pistols: {
        fileName: "pistols.json",
        categoryNames: ["handgun"],
    },
    Submachine_guns: {
        fileName: "submachine_guns.json",
        categoryNames: ["smg"],
    },
    assault_rifle: {
        fileName: "assault_rifle.json",
        categoryNames: ["assault-rifle"],
    },
    Assault_carbines: {
        fileName: "assault_carbines.json",
        categoryNames: ["assault-carbine"],
    },
    Machine_guns: {
        fileName: "machine_guns.json",
        categoryNames: ["machinegun"],
    },
    Marksman_rifles: {
        fileName: "marksman_rifles.json",
        categoryNames: ["marksman-rifle"],
    },
    Bolt_action_rifles: {
        fileName: "bolt_action_rifles.json",
        categoryNames: ["sniper-rifle"],
    },
    Shotguns: {
        fileName: "shotguns.json",
        categoryNames: ["shotgun"],
    },
    Granade_launchers: {
        fileName: "grenade_launchers.json",
        categoryNames: ["grenade-launcher"],
    },
    Revolvers: {
        fileName: "revolvers.json",
        categoryNames: ["revolver"],
    },
    Rocket_launchers: {
        fileName: "rocket_launchers.json",
        categoryNames: ["rocket-launcher"],
    },
};

const query = `
query {
  items(lang: ja) {
    id
    name
    normalizedName
    shortName
    basePrice
    avg24hPrice
    lastLowPrice
    weight
    categories {
      name
      normalizedName
    }
    containsItems {
      item {
        id
        name
        types
      }
    }
    properties {
      ... on ItemPropertiesWeapon {
        caliber
        ergonomics
        fireModes
        fireRate
        recoilHorizontal
        recoilVertical
        slots {
          nameId
          filters {
            allowedItems {
              id
              name
              normalizedName
              shortName
              weight
              ergonomicsModifier
              accuracyModifier
              recoilModifier
              image512pxLink
              image8xLink
              basePrice
              avg24hPrice
              lastLowPrice
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

function writeJson(outputPath, items) {
    fs.writeFileSync(
        outputPath,
        JSON.stringify({ data: { items } }, null, 2) + "\n",
        "utf8"
    );
}

function hasWeaponCategory(item, normalizedNames) {
    const itemCategories = item.categories?.map((category) => category.normalizedName) ?? [];
    return normalizedNames.some((name) => itemCategories.includes(name));
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

    return result.data.items.filter((item) => item.properties?.caliber);
}

async function main() {
    const dataDir = path.resolve(__dirname, "../src/data");
    const weapons = await fetchItems();

    Object.values(WEAPON_OUTPUTS).forEach(({ fileName, categoryNames }) => {
        const items = sortItems(
            weapons.filter((weapon) => hasWeaponCategory(weapon, categoryNames))
        );
        const outputPath = path.resolve(dataDir, fileName);

        writeJson(outputPath, items);
        console.log(`Wrote ${items.length} weapons to ${fileName}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
