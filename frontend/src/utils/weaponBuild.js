import {
    categoryArrayList,
    categoryListMapping,
    PART_DATA_MAP,
} from "../constants/categoryList";

/**
 * 枝番付きカテゴリキーから、元のカテゴリ名だけを取り出す。
 *
 * 例:
 * - "Scope" -> "Scope"
 * - "Scope#2" -> "Scope"
 *
 * @param {string} categoryKey タブや選択状態で使うカテゴリキー
 * @returns {string} 枝番を除いたカテゴリ名
 */
export function getBaseCategoryKey(categoryKey) {
    return categoryKey?.split("#")[0] ?? categoryKey;
}

/**
 * パーツ候補を格納するための空のスロット表を作成する。
 *
 * categoryArrayList はアプリ全体で共有されるテンプレートなので、
 * 直接変更せず、カテゴリごとの配列を新しく作り直してから使う。
 *
 * @returns {Object.<string, Array>} カテゴリキーを持つ空のスロット表
 */
export function createInitialSlotMap() {
    return Object.fromEntries(
        Object.entries(categoryArrayList).map(([key, items]) => [key, [...items]])
    );
}

/**
 * カテゴリとパーツIDから、詳細なパーツ定義を取得する。
 *
 * タブ用のカテゴリキーには "Reciever#2" のような枝番が付くことがあるため、
 * PART_DATA_MAP を引く前に元カテゴリ名へ戻している。
 *
 * @param {string} categoryKey パーツが選択されたカテゴリキー
 * @param {string} partId パーツID
 * @returns {Object|null} properties.slots などを含む詳細定義。見つからない場合は null
 */
export function getPartDefinition(categoryKey, partId) {
    const baseCategory = getBaseCategoryKey(categoryKey);
    const data = PART_DATA_MAP[baseCategory];

    return data?.data?.items?.find((item) => item.id === partId) ?? null;
}

function createSelectedDefaultPart(categoryKey, allowedItem) {
    return {
        ...allowedItem,
        category: categoryKey,
        isDefaultPart: true,
    };
}

/**
 * Build the initially equipped parts for a weapon, including nested default parts.
 *
 * Some weapons keep default parts under another default part instead of the weapon
 * root. For example, AKMSN's wooden handguard is attached under the AKM gas tube.
 * This function follows those default part slots recursively so the UI starts with
 * the same assembled state as the weapon data.
 *
 * @param {Object|null} gun Weapon data from the local JSON files.
 * @returns {Object.<string, Object>} Selected parts keyed by slot category key.
 */
export function buildDefaultPartsForGun(gun) {
    if (!gun?.containsItems || !gun?.properties?.slots) {
        return {};
    }

    const defaultItemIds = new Set(
        gun.containsItems
            .map((contained) => contained.item?.id)
            .filter(Boolean)
    );
    const selectedParts = {};
    const enabledCategories = {};

    function visitSlots(item) {
        const slots = item?.properties?.slots;
        if (!Array.isArray(slots)) return;

        const defaultPartsToVisit = [];

        slots.forEach((slot) => {
            const categoryName = categoryListMapping[slot.nameId];
            const allowedItems = slot.filters?.allowedItems;

            if (!categoryName || !Array.isArray(allowedItems)) {
                return;
            }

            const categoryKey = createUniqueSlotKey(
                categoryName,
                enabledCategories
            );

            enabledCategories[categoryKey] = {
                categoryName,
            };

            const defaultItem = allowedItems.find((allowedItem) =>
                defaultItemIds.has(allowedItem.id)
            );

            if (!defaultItem) {
                return;
            }

            selectedParts[categoryKey] = createSelectedDefaultPart(
                categoryKey,
                defaultItem
            );

            defaultPartsToVisit.push({
                categoryKey,
                partId: defaultItem.id,
            });
        });

        defaultPartsToVisit.forEach(({ categoryKey, partId }) => {
            const fullPart = getPartDefinition(categoryKey, partId);
            visitSlots(fullPart);
        });
    }

    visitSlots(gun);

    return selectedParts;
}

/**
 * Build a lookup table that tells which part is the default for each slot key.
 *
 * @param {Object|null} gun Weapon data from the local JSON files.
 * @returns {Object.<string, string>} Default part id keyed by slot category key.
 */
export function buildDefaultPartIdsBySlotKey(gun) {
    return Object.fromEntries(
        Object.entries(buildDefaultPartsForGun(gun)).map(([categoryKey, part]) => [
            categoryKey,
            part.id,
        ])
    );
}

/**
 * 同名カテゴリが複数出た場合にも区別できるカテゴリキーを作る。
 *
 * 例:
 * - 初回の "Scope" -> "Scope"
 * - 2回目の "Scope" -> "Scope#2"
 *
 * @param {string} categoryName 表示上のカテゴリ名
 * @param {Object.<string, Object>} enabledCategories すでに有効化されているカテゴリ一覧
 * @returns {string} UI状態で一意に扱えるカテゴリキー
 */
function createUniqueSlotKey(categoryName, enabledCategories) {
    const sameCategoryCount = Object.values(enabledCategories).filter(
        (category) => category.categoryName === categoryName
    ).length;

    if (sameCategoryCount === 0) {
        return categoryName;
    }

    return `${categoryName}#${sameCategoryCount + 1}`;
}

/**
 * 親カテゴリに子カテゴリを紐づける。
 *
 * レシーバーを選ぶとバレルやスコープのスロットが増えるような、
 * 「パーツが持つ追加スロット」の親子関係を保持するために使う。
 *
 * @param {string|null} parentCategory 親カテゴリキー。ルートカテゴリの場合は null
 * @param {string} childCategory 子カテゴリキー
 * @param {Object.<string, Object>} enabledCategories 有効カテゴリ一覧
 * @returns {void}
 */
function addChildCategory(parentCategory, childCategory, enabledCategories) {
    if (!parentCategory) return;

    const children = enabledCategories[parentCategory]?.children;
    if (children && !children.includes(childCategory)) {
        children.push(childCategory);
    }
}

/**
 * アイテムが持つ装着スロットを、スロット表と有効カテゴリ一覧に反映する。
 *
 * 銃本体にもパーツにも properties.slots が存在することがある。
 * この関数はその slots を読み取り、slot.nameId をカテゴリ名へ変換し、
 * slot.filters.allowedItems を選択候補として登録する。
 *
 * @param {Object|null} item 銃またはパーツの詳細データ
 * @param {{slots: Object.<string, Array>, enabled: Object.<string, Object>}} state 構築中の状態
 * @param {string|null} parentCategory このスロットを生んだ親カテゴリキー
 * @returns {void}
 */
function addSlotsFromItem(item, state, parentCategory = null) {
    const slots = item?.properties?.slots;
    if (!Array.isArray(slots)) return;

    slots.forEach((slot) => {
        const categoryName = categoryListMapping[slot.nameId];
        const allowedItems = slot.filters?.allowedItems;

        if (!categoryName || !Array.isArray(allowedItems) || allowedItems.length === 0) {
            return;
        }

        const categoryKey = createUniqueSlotKey(categoryName, state.enabled);

        state.slots[categoryKey] = [...(state.slots[categoryKey] ?? []), ...allowedItems];
        state.enabled[categoryKey] = {
            categoryName,
            index: categoryKey.includes("#") ? Number(categoryKey.split("#")[1]) : 1,
            parent: parentCategory,
            children: [],
        };

        addChildCategory(parentCategory, categoryKey, state.enabled);
    });
}

/**
 * 現在の武器と選択済みパーツから、表示すべきスロットとカテゴリを再構築する。
 *
 * まず武器本体の slots を読み取り、その後、選択済みパーツが持つ slots を追加する。
 * React 側ではこの戻り値を使って、パーツ選択タブと候補パーツ一覧を更新する。
 *
 * @param {Object|null} selectedGun 選択中の武器
 * @param {Object.<string, Object>} selectedParts 選択済みパーツ。キーはカテゴリキー
 * @returns {{newSlots: Object.<string, Array>, enabled: Object.<string, Object>}} スロット表と有効カテゴリ一覧
 */
export function buildSlotsAndCategories(selectedGun, selectedParts) {
    const state = {
        slots: createInitialSlotMap(),
        enabled: {},
    };

    addSlotsFromItem(selectedGun, state);

    Object.values(selectedParts ?? {}).forEach((part) => {
        const fullPart = getPartDefinition(part.category, part.id);
        if (fullPart) {
            addSlotsFromItem(fullPart, state, part.category);
        }
    });

    return {
        newSlots: state.slots,
        enabled: state.enabled,
    };
}

/**
 * 親子関係を持つカテゴリ一覧を、画面に表示しやすい順番へ並べる。
 *
 * parent が null のルートカテゴリから始めて、子カテゴリを深さ優先で追加する。
 * これにより、親スロットの直後に、そのパーツから生まれた子スロットが並ぶ。
 *
 * @param {Object.<string, {parent: string|null, children: string[]}>} categoryMap 有効カテゴリ一覧
 * @returns {string[]} 表示順に並んだカテゴリキー
 */
export function buildOrderedCategoryKeys(categoryMap) {
    const result = [];
    const visited = new Set();

    function visit(categoryKey) {
        if (visited.has(categoryKey)) return;

        visited.add(categoryKey);
        result.push(categoryKey);

        (categoryMap[categoryKey]?.children ?? []).forEach(visit);
    }

    Object.keys(categoryMap)
        .filter((categoryKey) => categoryMap[categoryKey].parent === null)
        .forEach(visit);

    return result;
}

/**
 * 指定カテゴリの配下にある子孫カテゴリキーをすべて取得する。
 *
 * 親パーツを外したときに、そのパーツから生まれた子スロットの選択も
 * まとめて解除するために使う。
 *
 * @param {string} categoryKey 起点となるカテゴリキー
 * @param {Object.<string, {children: string[]}>} categoryMap 有効カテゴリ一覧
 * @returns {string[]} 子・孫カテゴリキーの一覧
 */
export function getDescendantCategoryKeys(categoryKey, categoryMap) {
    const descendants = [];

    function collect(currentKey) {
        (categoryMap[currentKey]?.children ?? []).forEach((childKey) => {
            descendants.push(childKey);
            collect(childKey);
        });
    }

    collect(categoryKey);
    return descendants;
}

/**
 * 指定カテゴリと、その子孫カテゴリの選択済みパーツを取り除く。
 *
 * 例:
 * レシーバーを外す場合、レシーバーから増えたバレルやスコープも同時に外す。
 * これにより、現在の構成では存在しないスロットのパーツが残ることを防ぐ。
 *
 * @param {Object.<string, Object>} parts 現在の選択済みパーツ
 * @param {string} categoryKey 解除するカテゴリキー
 * @param {Object.<string, {children: string[]}>} categoryMap 有効カテゴリ一覧
 * @returns {Object.<string, Object>} 対象カテゴリを取り除いた選択済みパーツ
 */
export function removeCategoryAndDescendants(parts, categoryKey, categoryMap) {
    const nextParts = { ...parts };
    const categoriesToRemove = [
        categoryKey,
        ...getDescendantCategoryKeys(categoryKey, categoryMap),
    ];

    categoriesToRemove.forEach((key) => {
        delete nextParts[key];
    });

    return nextParts;
}
