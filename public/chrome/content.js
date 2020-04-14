chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'loadFeeds') {
    const modal = document.createElement('dialog');
    modal.setAttribute("style", "height:40%");
    modal.innerHTML = `
        <div style="top:0px; left:5px;">  
            <iframe id="feedMachine" style="height:100%" scrolling="no"></iframe>
            <button>x</button>
        </div>`;
    document.body.appendChild(modal);
    const dialog = document.querySelector("dialog");
    dialog.showModal();
    const iframe = document.getElementById("feedMachine");  
    iframe.src = chrome.extension.getURL("../index.html");
    iframe.frameBorder = 0;
    dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
     });
  }
});
