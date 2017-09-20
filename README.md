sample-jest-html
====

# やりたいこと

jestSnapshotの差分を見やすくする

# プロジェクト作成

環境を作るのはめんどくさいので `create-react-app` を利用してサンプルプロジェクトを作る。

```sh
$ create-react-app sample-jest-html
$ yarn eject
```

# react-test-rendererを追加する

`React-test-renderer` を利用することで描画せず素早くテストが可能になります。


```sh
$ yarn add react-test-renderer -D
```

# 既存のテストにスナップショットテストを追加する

```diff:src/App.test.js
import React from 'react';
+ import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

+ it('App Snapshot', () => {
+  const component = renderer.create(
+    <App />
+  );
+  expect(component).toMatchSnapshot('App is displayed?');
+});
```

# テストを実行してスナップショットを生成する

```sh
$ yarn test -- --coverage
```

```diff:src/__snapshots__/App.test.js.snap
+// Jest Snapshot v1, https://goo.gl/fbAQLP
+
+exports[`App is displayed? 1`] = `
+<div
+  className="App"
+>
+  <div
+    className="App-header"
+  >
+    <img
+      alt="logo"
+      className="App-logo"
+      src="logo.svg"
+    />
+    <h2>
+      Welcome to React
+    </h2>
+  </div>
+  <p
+    className="App-intro"
+  >
+    To get started, edit
+    <code>
+      src/App.js
+    </code>
+     and save to reload.
+  </p>
+</div>
+`;
 ```

# スナップショットファイルだと見た目の変更がわかりにくい

そこで画面に表示して確認できるように `jest-html` を追加します。

```sh
$ yarn add -D jest-html
```

スナップショットをサニタイズします。

```diff:package.json
    "moduleFileExtensions": [
      "web.js",
      "js",
      "json",
      "web.jsx",
      "jsx",
      "node"
-    ]
+    ],
+    "snapshotSerializers": ["./node_modules/jest-html"]
  },
```

サニタイズが追加されたのでスナップショットファイルに更新が入るためアップデートします。

```sh
$ yarn test -- --coverage -u
```

```diff:src/__snapshots__/App.test.js.snap
     and save to reload.
   </p>
</div>
+------------HTML PREVIEW---------------
+<div class="App">
+  <div class="App-header">
+    <img
+      alt="logo"
+      class="App-logo"
+      src="logo.svg"
+    >
+    <h2>
+      Welcome to React
+    </h2>
+  </div>
+  <p class="App-intro">
+    To get started, edit 
+    <code>
+      src/App.js
+    </code>
+     and save to reload.
+  </p>
+</div>
`;
```

## ビューワーを動かしてみる

下記コマンド実行したらブラウザが起動します。

```sh
$ yarn jest-html
yarn jest-html v0.27.5
$ "****/sample-jest-html/node_modules/.bin/jest-html"
2017-09-20T08:43:27.315Z           storyboard INFO  ┌── ROOT STORY: Node.js 8.2.1 on Darwin 64-bit, SB 3.1.3 [CREATED]
2017-09-20T08:43:27.316Z           storyboard INFO  Log filter: *:DEBUG
2017-09-20T08:43:31.249Z           storyboard INFO  Log filter is now: *:INFO
2017-09-20T08:43:31.278Z              startup INFO  CLI options:
                                      startup INFO    version: '1.3.5'
                                      startup INFO    snapshotPatterns: ['**/*.snap', '!node_modules/**/*']
                                      startup INFO    cssPatterns: ['snapshot.css']
                                      startup INFO    port: 8080
                                      startup INFO    watch: true
2017-09-20T08:43:31.369Z                 http INFO  Listening on port 8080
2017-09-20T08:43:31.370Z            extractor INFO  Extracting common CSS...
2017-09-20T08:43:31.375Z            extractor INFO  ┌── Refresh snapshots [CREATED]
2017-09-20T08:43:32.621Z            extractor INFO  Reading snapshot files...
2017-09-20T08:43:32.622Z            extractor INFO  Processing src/__snapshots__/App.test.js.snap...
2017-09-20T08:43:32.623Z            extractor INFO  Building folder tree...
2017-09-20T08:43:32.623Z            extractor INFO  └── Refresh snapshots [CLOSED]
2017-09-20T08:43:32.644Z            extractor INFO  Started watching over snapshot and CSS files
```

TODO: sample1画像さす

見ての通りclassで渡したstyleは見ることができません。。。

しかし、インナースタイルを利用した場合は別です。

```diff:src/App.js
         </div>
-        <p className="App-intro">
+        <p className="App-intro" style={{ color: 'red' }}>
           To get started, edit <code>src/App.js</code> and save to reload.
```

```sh
$ yarn test -- --coverage -u
```

```diff:src/__snapshots__/App.test.js.snap
     className="App-intro"
+    style={
+      Object {
+        "color": "red",
+      }
+    }
    >
      To get started, edit 
      <code>
@@ -38,7+43,10 @@ exports[`App is displayed? 1`] = `
        Welcome to React
      </h2>
    </div>
-  <p class="App-intro">
+  <p
+    class="App-intro"
+    style="color:red;"
+  >
      To get started, edit 
      <code>
```

TODO: sample2画像指す

# まとめ

スナップショットテストで出力したファイルをそのままhtml表示して確認できるの良くないですか？
CSS in JSで書かれているものはだいたいうまく表示できると思います。
Viewのテスト壊れやすくて辛いですが頑張って行きましょう！
