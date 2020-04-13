// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.insertCSS(tab.id, { file: "chrome/combined.css" });
  chrome.tabs.executeScript(tab.id, { file: "chrome/combined.js" });
  chrome.windows.create({url:chrome.extension.getURL("index.html")});
});
