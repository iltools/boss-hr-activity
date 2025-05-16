
(async () => {
  // 动态加载模块
//   const ajaxhookUrl = chrome.runtime.getURL("scripts/ajaxhook.min.js");
//   await import(ajaxhookUrl); // 引入后会全局暴露ah
//   ah.proxy({
//     onRequest: (config, handler) => {
    
//         console.log('gegeg')
//         handler.next(config);
//     },
//     onError: (err, handler) => {
//         handler.next(err);
//     },
//     onResponse: (res, handler) => {
//         console.log(res, 'gegeg')
//     },
//   });
  function addScript (src) {
    // 注入页面
    const script = document.createElement("script");
    script.setAttribute("src", chrome.runtime.getURL(src));
    document.head.appendChild(script);
  }
  // 注入脚本到原网页，也可以使用manifest.json定义"world": "MAIN"来实现content与原网页的共享
  addScript("scripts/ajaxhook.min.js")
  // 业务带阿米
  let bodyObserver
    const bodyObserverEle = document.body
    const listWrapperEle = ".job-list-container"
    const listObserverEle = document.querySelectorAll(".rec-job-list")[0]
    const bodyObserverConfig = {
        subtree: true,
        childList: true
    }
    const listObserverConfig = {
        subtree: true,
        childList: true
    }

    function initBodyObserver () {
        bodyObserver = new MutationObserver((mutationsList, observer) => {
            // 变动的时候执行
            // for (const mutation of mutationsList) {
            // }
            // console.log('body变动')
            if(document.querySelector(".ob-list-container")) {
                bodyObserver.disconnect()
                initListObserver()
            }
            injectOnline()
            
        })

        bodyObserver.observe(bodyObserverEle, bodyObserverConfig)
    }
    function initListObserver () {
        listObserver = new MutationObserver((mutationsList, observer) => {
            injectOnline()
        })
        listObserver.observe(document.querySelector(".ob-list-container"), listObserverConfig)
    }

    function injectOnline () {
        let jobWrappper = $(listWrapperEle)
        if(jobWrappper) {
            chrome.storage.local.get(["hr-online-status"]).then((result) => {
                if (result["hr-online-status"]) {
                    $('.job-card-box').addClass("offline-mask")
                    $(".boss-online-icon").parents(".job-card-box").removeClass("offline-mask").addClass("online-mask")
                }
            });
        
        }
    }

    function clearOnline () {
        let jobWrappper = $(listWrapperEle)
        if(jobWrappper) {
            $('.job-card-box').removeClass("offline-mask online-mask")
        }
    }

    function initEvent () {
        if(document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', afterDOMLoaded);
        } else {
            afterDOMLoaded();
        }
        if(document.readyState !== 'complete') {
            window.addEventListener('load',afterWindowLoaded);
        } else {
            afterWindowLoaded();
        }
    }

    function afterDOMLoaded () {
        console.log('DOMContentLoaded')
        // 看源码，列表是动态加载
        initBodyObserver()
    }

    function afterWindowLoaded () {
        // console.log('Window Loaded')
    }

    initEvent()

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // 监听background发来的消息
        const { type, value, from } = request;
        if(type === 'hr-online-change') {
            if (value) {
                injectOnline()
            } else {
                clearOnline()
            }
        }
    })
})();

