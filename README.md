# 本サンプルアプリについて
[こちら](https://github.com/amazonpay-labs/amazonpay-sample-app-v2)のサンプルアプリをベースとして、より便利にAmazon Payをお使いいただける拡張機能をこちらのサンプルに実装します。  
基本的な動作やInstall方法は上記ベースとなったサンプルアプリと全く同じですので、そちらをご参照ください。  

# 実装されている拡張機能

## Web接客型Amazon Pay (WebViewアプリ向け)

<img src="android/images/amazonAssist.gif" width="300">  

情報入力の煩雑な手続により、ECサイト離脱寸前のお客様を救うソリューションである、[Web接客型Amazon Pay](http://amazonpay-integration.amazon.co.jp/amazonpay-faq-v2/detail.html?id=QA-91)のモバイルアプリでの実装です。  
上記リンク先FAQのサンプルをほぼそのままWebView上で実装しています。  

※ Nativeアプリの場合にはこのサンプル通りにご実装いただくことはできませんが、同様の動作をするPopUpをご自身でご実装頂くことは可能です。  

上記FAQの「amazonpayAssist.js」をダウンロードし、PopUpを表示させたいページで読み込んで下記のようなScriptを追加するだけでご実装いただけます。  

```html
<!-- nodejs/views/sample/cart.ejsより抜粋 (見やすくするため、一部加工しています。) -->
            :
<script src="https://static-fe.payments-amazon.com/checkout.js"></script>
<script type="text/javascript" src="/static/js/amazonpayAssist.js"></script>
<script type="text/javascript">
            :
    //------------------------------------------------------------------------------------------
    // Web接客型Amazon Pay
    // 参照: http://amazonpay-integration.amazon.co.jp/amazonpay-faq-v2/detail.html?id=QA-91
    //------------------------------------------------------------------------------------------

    // 5秒後にポップアップを表示
    amazonpayAssist('AmazonPayAssistButton').fadeIn(5);

    // ポップアップ上のAmazon Payボタン表示処理
    if(client === 'browser') {
        amazon.Pay.renderButton('#AmazonPayAssistButton', {
            merchantId: '<%= merchantId %>',
            ledgerCurrency: 'JPY', // Amazon Pay account ledger currency
            sandbox: true, // dev environment
            checkoutLanguage: 'ja_JP', // render language
            productType: 'PayAndShip', // checkout type
            placement: 'Cart', // button placement
            buttonColor: 'Gold',
            createCheckoutSessionConfig: {
                payloadJSON: '<%- JSON.stringify(payload) %>', // string generated in step 2
                signature: '<%= signature %>', // signature generated in step 3
                publicKeyId: '<%= publicKeyId %>' 
            }
        });
    } else {
        let node = document.createElement("input");
        node.type = "image";
        node.src = "/static/img/button_images/Gold/Sandbox-live-ja_jp-amazonpay-gold-medium-button_T2.png";
        node.addEventListener('click', (e) => {
            coverScreen();
            if(client === 'androidApp') {
                androidApp.login();
            } else {
                webkit.messageHandlers.iosApp.postMessage({op: 'login'});            
            }
        });
        document.getElementById('AmazonPayAssistButton').appendChild(node);
    }
            :
</script>
            :
```

## その他の拡張機能
Coming soon...

