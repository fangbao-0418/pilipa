# usage
```
npm config set registry http://npmregistry.i-counting.cn
yarn add pilipa || npm install pilipa
or
yarn add pilipa --registry http://npmregistry.i-counting.cn
```

# Development
```
yarn install
yarn add ali-oss@5.0.0 font-awesome@4.7.0 jquery@3.3.1 react@16.3.1 react-dom@16.3.1 viewerjs@1.0.0 -P
npm run dev
...
npm run lib
npm run dist
```

# dependency 
### commonjs
- `yarn add @types/ali-oss --registry http://npmregistry.i-counting.cn`
- `yarn add viewerjs@^1.0.0`
- `yarn add react@^16.2.0 react-dom@^16.2.0`
- `yarn add font-awesome@^4.7.0`
- `yarn add jquery@^3.2.1`

### amd
```
define(['jquery', 'react', 'react-dom', 'viewerjs', 'ali-oss'], ($, React, ReactDom, Viewer, OSS) => {})
```

# Change Log 
### 1.1.1  
  &nbsp;&nbsp; `2018-4-8`
  - dropdown 支持键盘上下按键选择，回车确认选择 #20
### 1.1.2  
  &nbsp;&nbsp; `2018-4-9`
  - webuploader 添加callback #15
### 1.1.3
  &nbsp;&nbsp; `2018-4-11`
  - 优化notification，鼠标划过暂停消失
### 1.1.4
  &nbsp;&nbsp; `2018-4-12`
  - notification持续时间调整4500ms
### 1.1.4-alpha.1
  &nbsp;&nbsp; `2018-4-12`
  - dropdown 修复没有数据报错

