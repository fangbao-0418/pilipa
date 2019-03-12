# version
 旧版请使用1.x，旧版最后版本为1.1.6

 新版使用3.x 

# usage
```
yarn add pilipa --registry https://nexus.i-counting.cn/repository/accounting/
```

# Development
```
yarn install
yarn add ali-oss@5.3.1 font-awesome@4.7.0 jquery@3.3.1 react@16.3.1 react-dom@16.3.1 viewerjs@1.0.0 -P
yarn dev
...
yarn lib
yarn dist
```

# dependency 
### commonjs
- `yarn add @types/ali-oss --registry https://npmregistry.i-counting.cn`
- `yarn add viewerjs@^1.0.0`
- `yarn add react@^16.2.0 react-dom@^16.2.0`
- `yarn add font-awesome@^4.7.0`
- `yarn add jquery@^3.2.1`

### amd
```
define(['jquery', 'react', 'react-dom', 'viewerjs', 'ali-oss'], ($, React, ReactDom, Viewer, OSS) => {})
```

# Change Log 

### 3.0.7
  &nbsp;&nbsp; `2019-03-12` 
  - auto-complete 组件优化
  - dropdown 组件优化