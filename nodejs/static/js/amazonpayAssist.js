const amazonpayAssist = (function () {
  return function (amazonPayButtonId) {
    const amazonPayButton = amazonPayButtonId
      ? amazonPayButtonId
      : 'AmazonPayButton';
    const optimization = {
      fontSize: function (styleJson) {
        if (!styleJson.fontSizeRatio) return styleJson;

        const maxFontSize = styleJson.maxFontSize ? styleJson.maxFontSize : 18;
        const windowWidth =
          window.innerWidth || document.documentElement.clientWidth || 0;
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight || 0;
        const minWidth = windowWidth < windowHeight
          ? windowWidth
          : windowHeight;
        if (minWidth === 0) {
          styleJson.fontSize = maxFontSize + 'px';
        } else {
          const fontSize = minWidth / styleJson.fontSizeRatio;
          styleJson.fontSize = fontSize < maxFontSize
            ? fontSize + 'px'
            : maxFontSize + 'px';
        }
        delete styleJson['fontSizeRatio'];
        delete styleJson['maxFontSize'];
        return styleJson;
      },
      width: function (styleJson) {
        if (!styleJson.landscapeWidth) return styleJson;

        const sp = window.matchMedia ('(max-height: 450px)');
        styleJson.width = sp.matches
          ? styleJson.landscapeWidth
          : styleJson.width;
        delete styleJson['landscapeWidth'];
        return styleJson;
      },
    };

    function createNode (elem) {
      const element = elem.match (/polygon|svg/)
        ? document.createElementNS ('http://www.w3.org/2000/svg', elem)
        : document.createElement (elem);
      element.styles = function (styleJson) {
        styleJson = optimization.fontSize (styleJson);
        styleJson = optimization.width (styleJson);
        Object.assign (element.style, styleJson);
        return element;
      };
      element.attrs = function (attrJson) {
        for (const attr in attrJson) {
          const value = attrJson[attr];
          if (/^on[A-Z]/.test (attr)) {
            const eventName = attr.slice (2).toLocaleLowerCase ();
            element.addEventListener (eventName, value);
          } else {
            element.setAttribute (attr, value);
          }
        }
        return element;
      };
      element.parts = function (...appendElemArray) {
        if (appendElemArray && appendElemArray.length > 0) {
          for (const elem of appendElemArray) {
            element.appendChild (elem);
          }
        }
        return element;
      };
      element.text = function (str) {
        if (element.innerText !== undefined) {
          element.innerText = str;
        } else if (element.textContent !== undefined) {
          element.textContent = str;
        }
        return element;
      };
      return element;
    }
    const apayAssistStyles = {
      buyerImgClass: {
        maxWidth: '100%',
        borderRadius: '20px 20px 0 0',
      },
      overlayClass: {
        visibility: 'hidden',
        opacity: '0',
      },
      wrapperClass: {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex: '100000',
      },
      windowClass: {
        position: 'fixed',
        zIndex: '100001',
      },
      closeButtonClass: {
        position: 'absolute',
        top: '-20px',
        right: '-15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#a8a8a8',
        borderRadius: '30px',
        width: '40px',
        height: '40px',
      },
      closeButtonSvgClass: {
        display: 'flex',
        alignItems: 'center',
        fill: '#fff',
        width: '16px',
        height: '16px',
      },
      contentClass: {
        width: '80vw',
        landscapeWidth: '80vh',
        maxWidth: '400px',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
      },
      contentTitleClass: {
        top: '25px',
        left: '20px',
        position: 'absolute',
        lineHeight: '2',
        textShadow: '1px 1px 0 #FFF, -1px -1px 0 #FFF,-1px 1px 0 #FFF, 1px -1px 0 #FFF,0px 1px 0 #FFF,  0-1px 0 #FFF,-1px 0 0 #FFF, 1px 0 0 #FFF',
        maxFontSize: '21',
        fontSizeRatio: '25',
      },
      contentBodyClass: {
        padding: '0 0 1px 0',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      },
      contentBodyTextClass: {
        margin: '20px',
        color: '#a9a6a6',
        maxFontSize: '16',
        fontSizeRatio: '30',
      },
      contentBoldClass: {
        color: 'orange',
      },
      subTextClass: {
        maxFontSize: '13',
        fontSizeRatio: '35',
      },
      amznpayButtonClass: {
        margin: '0 15px 15px 15px',
      },
    };

	const closeButtonNode = createNode ('div')
      .styles (apayAssistStyles.closeButtonClass)
      .attrs ({
        onClick: function () {
          this.style.background = '#00a4b4';
          overlay.hide ();
        },
        onMouseover: function () {
          this.style.background = '#00a4b4';
        },
        onMouseout: function () {
          this.style.background = '#a8a8a8';
        },
      })
      .parts (
        createNode ('svg').styles (apayAssistStyles.closeButtonSvgClass).parts (
          createNode ('polygon').attrs ({
            points: '14.4,3.1 12.9,1.6 8,6.6 3.1,1.6 1.6,3.1 6.6,8 1.6,12.9 3.1,14.4 8,9.4 12.9,14.4 14.4,12.9 9.4,8',
          })
        )
      );

    const buyerImgNode = createNode ('img')
      .styles (apayAssistStyles.buyerImgClass)
      .attrs ({
        src: 'https://d3e3b7ii96fk5l.cloudfront.net/image/buyer.png',
        alt: 'amazon pay buyer image',
      });

    const contentTitleNode = createNode ('div')
      .styles (apayAssistStyles.contentTitleClass)
      .parts (
        createNode ('div').text ('Amazonアカウントを利用すると'),
        createNode ('div')
          .styles (apayAssistStyles.contentBoldClass)
          .text ('最短2クリックで'),
        createNode ('div').text ('注文できます')
      );

    const contentBodyNode = createNode ('div')
      .styles (apayAssistStyles.contentBodyClass)
      .parts (
        createNode ('div')
          .styles (apayAssistStyles.contentBodyTextClass)
          .parts (
            createNode ('div').text ('面倒な入力は不要！Amazonに登録の'),
            createNode ('div').text ('住所・カードで注文できます')
          ),
        createNode ('div').parts (
          createNode ('div')
            .styles (apayAssistStyles.subTextClass)
            .text ('コチラのボタンをクリック'),
          createNode ('div')
            .attrs ({id: amazonPayButton})
            .styles (apayAssistStyles.amznpayButtonClass)
        )
      );

	/* popup用html生成 */
    document.body.appendChild (
      createNode ('div')
        .attrs ({id: 'amazonpayAssist'})
        .styles (apayAssistStyles.overlayClass)
        .parts (
          createNode ('div')
            .styles (apayAssistStyles.wrapperClass)
            .parts (
              createNode ('div')
                .styles (apayAssistStyles.windowClass)
                .parts (
                  closeButtonNode,
                  createNode ('div')
                    .styles (apayAssistStyles.contentClass)
                    .parts (
                      createNode ('div').parts (
                        buyerImgNode,
                        contentTitleNode,
                        contentBodyNode
                      )
                    )
                )
            )
        )
    );

    /* popup表示ロジック */
    const overlay = (function () {
      let elem = document.getElementById ('amazonpayAssist');
      let displayed = false;
      let isRequiredFilled = function (requiredClazz) {
        let fields = document.getElementsByClassName (requiredClazz);
        for (let i = 0; i < fields.length; i++) {
          if (!fields[i].value) return false;
        }
        return true;
      };
      return {
        show: function (requiredClazz) {
          if (displayed) return;
          if (requiredClazz && isRequiredFilled (requiredClazz)) return;
          document.activeElement.blur ();
          elem.setAttribute (
            'style',
            'visibility:visible; opacity:1; transition: opacity 1000ms;'
          );
          displayed = true;
        },
        hide: function () {
          elem.setAttribute ('style', 'visibility:hidden; opacity:0;');
        },
      };
    }) ();
    const inputfields = (function () {
      let changedTime = Date.now ();
      return {
        monitor: function (fields) {
          for (let i = 0; i < fields.length; i++) {
            ['keydown', 'change', 'focus'].forEach (function (event) {
              fields[i].addEventListener (
                event,
                function () {
                  changedTime = Date.now ();
                },
                false
              );
            });
          }
        },
        fillInAll: function (fields) {
          for (let i = 0; i < fields.length; i++) {
            if (!fields[i].value) return false;
          }
          return true;
        },
        changed: function (time) {
          return Date.now () - changedTime < time * 1000;
        },
      };
    }) ();
    let requiredClazz = null;
    return {
      // ページ表示した指定秒後に表示
      fadeIn: function (durationSec) {
        setTimeout (function () {
          overlay.show (requiredClazz);
        }, durationSec * 1000);
        return this;
      },
      // マウスカーソルがページから外れたときに表示
      mouseLeave: function () {
        document.body.addEventListener (
          'mouseleave',
          function () {
            overlay.show (requiredClazz);
          },
          false
        );
        return this;
      },
      // 指定秒以内に、classが指定されたinput fieldに入力がない場合、表示
      onInactive: function (durationSec, className) {
        let fields = document.getElementsByClassName (className);
        inputfields.monitor (fields);
        const interval = setInterval (function () {
          if (inputfields.fillInAll (fields)) {
            clearInterval (interval);
            return;
          }
          if (!inputfields.changed (durationSec)) {
            overlay.show (requiredClazz);
            clearInterval (interval);
          }
        }, 1000);
        return this;
      },
      notShow: function (localRequiredClazz) {
        requiredClazz = localRequiredClazz;
        return this;
      },
    };
  };
}) ();
