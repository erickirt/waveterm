// Copyright 2024, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/app";
import { loadFonts } from "./util/fontutil";
import { ClientService } from "@/bindings/clientservice";
import { Client } from "@/gopkg/wstore";
import { globalStore, atoms } from "@/store/global";
import * as WOS from "@/store/wos";
import * as wailsRuntime from "@wailsio/runtime";
import * as wstore from "@/gopkg/wstore";
import * as gdata from "@/store/global";
import { immerable } from "immer";

const urlParams = new URLSearchParams(window.location.search);
const windowId = urlParams.get("windowid");
const clientId = urlParams.get("clientid");

wstore.Block.prototype[immerable] = true;
wstore.Tab.prototype[immerable] = true;
wstore.Client.prototype[immerable] = true;
wstore.Window.prototype[immerable] = true;
wstore.Workspace.prototype[immerable] = true;
wstore.BlockDef.prototype[immerable] = true;
wstore.RuntimeOpts.prototype[immerable] = true;
wstore.FileDef.prototype[immerable] = true;
wstore.Point.prototype[immerable] = true;
wstore.WinSize.prototype[immerable] = true;

loadFonts();

document.addEventListener("DOMContentLoaded", async () => {
    // ensures client/window are loaded into the cache before rendering
    await WOS.loadAndPinWaveObject<Client>(WOS.makeORef("client", clientId));
    const waveWindow = await WOS.loadAndPinWaveObject<WaveWindow>(WOS.makeORef("window", windowId));
    await WOS.loadAndPinWaveObject<Workspace>(WOS.makeORef("workspace", waveWindow.workspaceid));
    let reactElem = React.createElement(App, null, null);
    let elem = document.getElementById("main");
    let root = createRoot(elem);
    document.fonts.ready.then(() => {
        root.render(reactElem);
    });
});
