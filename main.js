const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

// Бір уақытта тек бір терезе ашылсын (деректер бүлінбеуі үшін)
if (!app.requestSingleInstanceLock()) app.quit();

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 520,
    height: 860,
    minWidth: 360,
    minHeight: 520,
    title: "Менің күнделігім",
    backgroundColor: "#f7f1e6",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });

  if (process.platform === "darwin") {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{ role: "appMenu" }, { role: "editMenu" }, { role: "windowMenu" }]));
  } else {
    win.removeMenu();
  }

  win.loadFile(path.join(__dirname, "index.html"));

  // Сыртқы сілтемелер қолданбаның ішінде емес, браузерде ашылсын
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file://")) e.preventDefault();
  });
}

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
