import React from "react";
import { Box, TextField, Typography } from "@mui/material";

const STATUS_ITEMS = [
    {
        key: "weight",
        label: "重量",
        thresholdLabel: "重量ライン",
        unit: "kg",
        defaultMax: 8,
        color: "#8b9cff",
        warningType: "over",
        formatValue: (value) => `${value.toFixed(2)} kg`,
        formatScale: (value) => `${value.toFixed(1)}kg`,
    },
    {
        key: "ergonomics",
        label: "エルゴノミクス",
        thresholdLabel: "エルゴライン",
        unit: "",
        defaultMax: 100,
        color: "#bb86fc",
        warningType: "under",
        formatValue: (value) => Math.round(value),
        formatScale: (value) => Math.round(value),
    },
    {
        key: "price",
        label: "価格",
        thresholdLabel: "価格ライン",
        unit: "円",
        defaultMax: 500000,
        color: "#c026d3",
        warningType: "over",
        formatValue: (value) => `¥${Math.round(value).toLocaleString()}`,
        formatScale: (value) => `¥${Math.round(value).toLocaleString()}`,
    },
];

function WeaponStatus({ parameters, thresholds, setThresholds }) {
    function toNumberOrZero(value) {
        return typeof value === "number" && Number.isFinite(value) ? value : 0;
    }

    function clampPercent(value, max) {
        return Math.min(Math.max((value / max) * 100, 0), 100);
    }

    function getThresholdValue(metric) {
        const rawValue = thresholds?.[metric];
        if (rawValue === "" || rawValue == null) return null;

        const threshold = Number(rawValue);
        if (!Number.isFinite(threshold) || threshold <= 0) return null;

        return threshold;
    }

    function getBarMax(item) {
        const threshold = getThresholdValue(item.key);
        return threshold ? threshold * 2 : item.defaultMax;
    }

    function isWarning(item, value) {
        const threshold = getThresholdValue(item.key);
        if (!threshold) return false;

        if (item.warningType === "under") {
            return value < threshold;
        }

        return value > threshold;
    }

    function handleThresholdChange(metric, value) {
        setThresholds((prev) => ({
            ...prev,
            [metric]: value,
        }));
    }

    function StatusBar({ item }) {
        const value = toNumberOrZero(parameters[item.key]);
        const threshold = getThresholdValue(item.key);
        const max = getBarMax(item);
        const percent = clampPercent(value, max);
        const warning = isWarning(item, value);
        const barColor = warning ? "#ef4444" : item.color;

        return (
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 0.5,
                    }}
                >
                    <Typography
                        sx={{
                            color: warning ? "#fca5a5" : "text.secondary",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                        }}
                    >
                        {item.label}
                    </Typography>
                    <Typography
                        sx={{
                            color: warning ? "#fca5a5" : "#fff",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                        }}
                    >
                        {item.formatValue(value)}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        height: 8,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: 999,
                    }}
                >
                    <Box
                        sx={{
                            width: `${percent}%`,
                            height: "100%",
                            backgroundColor: barColor,
                            borderRadius: 999,
                            transition:
                                "width 0.2s ease, background-color 0.2s ease",
                        }}
                    />
                    {threshold && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: -3,
                                left: "50%",
                                width: 2,
                                height: 14,
                                backgroundColor: "#fff",
                                borderRadius: 1,
                                boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
                            }}
                        />
                    )}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 0.4,
                        color: "text.secondary",
                        fontSize: "0.7rem",
                    }}
                >
                    <Typography component="span" sx={{ fontSize: "inherit" }}>
                        0
                    </Typography>
                    {threshold && (
                        <Typography
                            component="span"
                            sx={{ color: "#fff", fontSize: "inherit" }}
                        >
                            {item.formatScale(threshold)}
                        </Typography>
                    )}
                    <Typography component="span" sx={{ fontSize: "inherit" }}>
                        {item.formatScale(max)}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: 2,
                backgroundColor: "#2a2a2a",
                color: "#fff",
                borderRadius: 1,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
            }}
        >
            <Typography variant="h6">ビルド性能</Typography>
            <Typography
                variant="body2"
                sx={{ mt: 0.5, color: "rgba(255,255,255,0.68)" }}
            >
                価格は avg24hPrice、lastLowPrice、basePrice の順で使用し、標準装備パーツは合計に含めません。
            </Typography>
            <Box
                sx={{
                    padding: { xs: 1, md: 2 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                {STATUS_ITEMS.map((item) => (
                    <StatusBar key={item.key} item={item} />
                ))}
            </Box>

            <Box
                sx={{
                    mx: { xs: 1, md: 2 },
                    mt: 0.5,
                    pt: 1.5,
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <Typography
                    sx={{
                        mb: 1,
                        color: "text.secondary",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                    }}
                >
                    ターゲットライン
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: 1,
                    }}
                >
                    {STATUS_ITEMS.map((item) => (
                        <TextField
                            key={item.key}
                            type="number"
                            size="small"
                            label={item.thresholdLabel}
                            value={thresholds[item.key]}
                            onChange={(event) =>
                                handleThresholdChange(
                                    item.key,
                                    event.target.value
                                )
                            }
                            slotProps={{
                                input: {
                                    endAdornment: item.unit ? (
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: "text.secondary",
                                                fontSize: "0.75rem",
                                                ml: 0.5,
                                            }}
                                        >
                                            {item.unit}
                                        </Typography>
                                    ) : null,
                                },
                            }}
                            sx={{
                                "& .MuiInputBase-root": {
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    color: "#fff",
                                },
                                "& .MuiInputLabel-root": {
                                    color: "text.secondary",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#bb86fc",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "rgba(255,255,255,0.16)",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "rgba(255,255,255,0.32)",
                                },
                                "& input[type=number]": {
                                    MozAppearance: "textfield",
                                },
                                "& input[type=number]::-webkit-outer-spin-button":
                                    {
                                        WebkitAppearance: "none",
                                        margin: 0,
                                    },
                                "& input[type=number]::-webkit-inner-spin-button":
                                    {
                                        WebkitAppearance: "none",
                                        margin: 0,
                                    },
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default WeaponStatus;
