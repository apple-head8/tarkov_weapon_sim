import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import PartCard from "../common/PartCard";

function PartSelector({
    selectedTab,
    handleTabChange,
    categories,
    parts,
    handlePartSelect,
    selectedParts,
    clearPartSelect,
}) {
    return (
        <>
            {/* Tabs for part categories */}
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
            >
                {categories.map((category) => (
                    <Tab key={category} label={category} value={category} />
                ))}
            </Tabs>

            {/* Parts within the selected tab */}
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <div
                    style={{
                        width: "150px",
                        height: "200px",
                        display: "grid",
                        margin: "10px",
                        flexShrink: 0,
                    }}
                >
                    <PartCard
                        part={selectedParts[selectedTab]}
                        isSelectedCard={true}
                        onClick={() => clearPartSelect(selectedTab)}
                    />
                </div>

                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto", // 横スクロールを有効化
                        width: "100%",
                    }}
                >
                    {parts[selectedTab].map((part) => (
                        <div
                            style={{
                                width: "150px",
                                height: "200px",
                                display: "grid",
                                margin: "10px",
                            }}
                            key={part.id}
                        >
                            <PartCard
                                part={part}
                                isSelected={
                                    selectedParts[selectedTab]?.id === part.id
                                }
                                onClick={() =>
                                    handlePartSelect(selectedTab, part)
                                }
                            />
                        </div>
                    ))}
                </Box>
            </Box>
        </>
    );
}

export default PartSelector;
