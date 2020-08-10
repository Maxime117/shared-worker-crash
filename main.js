const electron = require("electron");
const {app, BrowserWindow, protocol, screen} = electron;
const path = require("path");

let browserWindows = new Map();

protocol.registerSchemesAsPrivileged([
  {
    scheme: "live",
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      bypassCSP: true
    }
  }
]);

app.on("ready", onReady);

function onReady() {
  protocol.registerFileProtocol("live", registerFileRequest)

  createMainWindow();
  createViewerWindow();
}

function createMainWindow (caller) {
  browserWindows.set("main", new BrowserWindow({
    width: electron.screen.getPrimaryDisplay().workAreaSize.width,
    height: electron.screen.getPrimaryDisplay().workAreaSize.height,
    show: true,
    title: "Main window",
    backgroundColor: "#000000",
    titleBarStyle: "hidden",
    webPreferences:{
      devTools: true,
      // nodeIntegration: true,
      // nodeIntegrationInWorker: true,
      // enableRemoteModule: true,
      autoplayPolicy: "no-user-gesture-required"
    }
  }))

  // browserWindows.get("main").loadURL("live://editor/mainwin.html");
  // browserWindows.get("main").loadURL(`${__dirname}/mainwin.html`);
  browserWindows.get("main").loadFile("mainwin.html");

  browserWindows.get("main").webContents.openDevTools();
  setTimeout(function() {
    console.log("main shared workers: ", browserWindows.get("main").webContents.getAllSharedWorkers())
  }, 3000);
}

function createViewerWindow () {
  browserWindows.set("viewer", new BrowserWindow({
    width: 900,
    height: 528,
    minWidth: 640,
    minHeight: 360,
    title: "Viewer",
    backgroundColor: "#000000",
    fullscreenable: true,
    parent: browserWindows.get("main"),
    webPreferences: {
      devTools: true,
      // nodeIntegration: true,
      // nodeIntegrationInWorker: true,
      // enableRemoteModule: true,
      autoplayPolicy: "no-user-gesture-required"
    }
  }))

  browserWindows.get("viewer").setAspectRatio(16/9);

  // browserWindows.get("viewer").loadURL("live://editor/viewer.html");
  // browserWindows.get("viewer").loadURL(`${__dirname}/viewer.html`);
  browserWindows.get("viewer").loadFile("viewer.html");

  browserWindows.get("viewer").webContents.openDevTools({mode: "detach"});
  setTimeout(function() {
    console.log("viewer shared workers: ", browserWindows.get("viewer").webContents.getAllSharedWorkers());
  }, 3000);
}

function registerFileRequest(request, callback){
  let [url, params] = request.url.split("?");
  let uri = url.match(/^live:\/\/editor\/(.*)$/)[1];

  console.log("registerFileRequest — url: %s, uri: %s", url, uri);

  callback({path: path.resolve(__dirname, uri)});
}