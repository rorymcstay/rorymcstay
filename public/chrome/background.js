chrome.contextMenus.create({ 
    id: 'FeedMachine',
    title: 'Load fees',
    contexts: ['all']
  });

chrome.contextMenus.onClicked.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'loadFeeds'});
    });
});
