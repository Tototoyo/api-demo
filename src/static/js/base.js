window.appId = "c0c1839e1ce7f222";
function getQueryValue(queryName) {
  const paramsString = window.location.search.substring(1);
  const params = new URLSearchParams(paramsString);
  return params.get(queryName);
}
function closeLogin() {
  const loginDialog = document.querySelector(".login-dialog");
  loginDialog?.parentNode?.removeChild(loginDialog);
}
function onCloseTipDialog() {
  const dom = document.querySelector(".api-tip-dialog");
  const mask = document.querySelector(".mask");
  dom?.parentNode.removeChild(dom);
  mask?.parentNode.removeChild(mask);
}

function showApiToast(ele, tipName, bool) {
  if (bool) {
    let toastEle = ele.querySelector(".toast");
    if (!toastEle) {
      toastEle = document.createElement("div");
      toastEle.className = "toast";
      const tips = ApiTips[tipName];
      toastEle.innerHTML = `Check the API of ${tips["name"]}`;
      if (ele.parentNode.dataset.position === "bottom") {
        toastEle.className = "toast bottom";
      } else if (ele.parentNode.dataset.position === "right") {
        toastEle.className = "toast right";
      }
      ele.appendChild(toastEle);
    }
  } else {
    const toastEle = ele.querySelector(".toast");
    toastEle.parentNode?.removeChild(toastEle);
  }
}
function showApiTip(tipName) {
  const dialog = document.createElement("div");
  Object.assign(dialog.style, {
    width: "50%",
    left: "0",
    top: "50%",
    right: "0",
    transform: "translateY(-50%)",
    maxHeight: "80%",
    margin: "auto",
    borderRadius: "24px",
    position: "fixed",
    zIndex: 9999999999,
    padding: "32px",
    background: "#fff",
  });
  dialog.className = "api-tip-dialog";
  const mask = document.createElement("div");
  mask.style.zIndex = 999999998;
  mask.className = "mask";
  document.body.appendChild(dialog);
  document.body.appendChild(mask);
  const tips = ApiTips[tipName].tips;
  let targetHtml = "";
  if (tips) {
    for (let i = 0; i < tips.length; i++) {
      const tip = tips[i];
      let content = "";
      for (let j = 0; j < tip.content.length; j++) {
        switch (tip.content[j].type) {
          case "p":
            content += `<p>${tip.content[j].value}</p>`;
            break;
          case "code":
            content += `<pre><code class="${
              tip.content[j].codeLang ?? "language-html"
            }">${tip.content[j].value
              .replace(/\</g, "&lt;")
              .replace(/\>/g, "&gt;")}</code></pre>`;
            break;
          case "image":
            content += `<img src="${tip.content[j].value}"/>`;
            break;
        }
      }
      targetHtml += `
        <div class="tip-title">${tip.title} </div>
        <div class="tip-content">
          ${content}
        </div>
      `;
    }
  }
  dialog.innerHTML = `
    <div class="api-dialog-title">
      Related API for this Feature
      <i class="iconfont icon-ico-qingkong" onclick="onCloseTipDialog()"></i>
    </div>
    <div class="api-dialog-content">
      ${targetHtml}
    </div>
  `;

  hljs.highlightAll();
}
function setUserInfo() {
  const loginBtn = document.querySelector(".login-btn");
  const userEmail = localStorage.getItem("username");
  if (loginBtn) {
    loginBtn.className = "user-header";
    const name = userEmail.substring(0, 1);
    loginBtn.innerHTML = `
      <a class="header-my-projects" href="/my.html">
        My projects
      </a>
      <div class="header-my-avatar">${name}</div>
    `;
    loginBtn.onclick = null;
  }
}
function onSign() {
  const loginInput = document.getElementById("login-input");
  const emailInput = document.querySelector("#login-input input");
  const email = emailInput.value;
  console.log(
    "sign",
    email,
    /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)
  );
  if (email === "" || !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)) {
    loginInput.className = "form-item error";
    document.querySelector(".login-valid-error").innerHTML =
      "The email format is incorrect";
  } else {
    localStorage.setItem("username", email);
    closeLogin();
    setUserInfo();
  }
}

(() => {
  const loginBtn = document.querySelector(".login-btn");
  const userEmail = localStorage.getItem("username");
  if (!userEmail && loginBtn) {
    loginBtn.onclick = function () {
      const dom = document.createElement("div");
      Object.assign(dom.style, {
        width: "540px",
        height: "520px",
        position: "fixed",
        display: "inline-block",
        borderRadius: "16px",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        margin: "auto",
        padding: "0 20px",
        boxShadow: "0px 8px 24px rgba(113, 66, 180, 0.12)",
        background: "#fff",
      });
      dom.innerHTML = `
        <div class="login-header">
          <i class="iconfont icon-ico-qingkong" onclick="closeLogin()"></i>
        </div>
        <div class="login-title">
          Sign in
        </div>
        <div class="login-form">
          <div class="form-item" id="login-input">
            <i class="iconfont icon-zhanghao"></i>
            <input class="login-input" placeholder="Your email"></input>
          </div>
          <div class="login-valid-error"></div>
          <div class="btn mt40" onclick="onSign()">Sign in</div>
        </div>
      `;
      dom.className = "login-dialog";
      document.body.appendChild(dom);
    };
  } else {
    setUserInfo();
  }
  const tipEles = document.querySelectorAll("[data-ui-tip]");
  for (let i = 0; i < tipEles.length; i++) {
    const ele = tipEles[i];
    const style = getComputedStyle(ele);
    if (style.position !== "absolute" && style.position !== "fixed") {
      ele.style.position = "relative";
    }
    const tipUIEle = document.createElement("div");
    tipUIEle.className = "api-tip";
    if (ele.dataset.tipPosition === "center") {
      tipUIEle.style.left = "55%";
      tipUIEle.style.top = "45%";
    }
    const tipInner = document.createElement("div");
    tipInner.className = "api-tip-inner";
    tipUIEle.appendChild(tipInner);
    ele.appendChild(tipUIEle);
    tipUIEle.onclick = (e) => {
      e.stopPropagation();
      showApiTip(ele.dataset.uiTip);
    };
    tipUIEle.onmouseenter = (e) => {
      e.stopPropagation();
      e.preventDefault();
      showApiToast(tipUIEle, ele.dataset.uiTip, true);
    };
    tipUIEle.onmouseleave = (e) => {
      showApiToast(tipUIEle, ele.dataset.uiTip, false);
    };
  }
})();
