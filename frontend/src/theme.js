import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark", // ダークモードを設定
        primary: {
            main: "#bb86fc", // プライマリカラー
        },
        secondary: {
            main: "#03dac6", // セカンダリカラー
        },
        background: {
            default: "#121212", // デフォルトの背景色
            paper: "#1e1e1e", // ペーパー（カードなど）の背景色
        },
        text: {
            primary: "#ffffff", // 主なテキストカラー
            secondary: "rgba(255, 255, 255, 0.7)", // セカンダリテキストカラー
        },
    },
});

export default theme;
