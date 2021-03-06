import '@tarojs/async-await';
import Taro, { Component, Config } from '@tarojs/taro';
import './app.less';
import Index from './pages/index';
import { UserStore, CommodityStore } from './store';
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  constructor(props) {
    super(props)
    // UserStore.onLogin();
    UserStore.onGetUserInfo();
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [

      //首页
      'pages/index/index',
      //购物车
      'pages/shopping/index',
      //详情
      'pages/details/index',
      //我的
      'pages/user/index',
      //新增地址
      'pages/user_address/index',
      //收货地址
      'pages/user_address_edit/index',
      //我的订单
      'pages/user_order/index',

    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#666666",
      selectedColor: "#43210D",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "img/home.png",
          selectedIconPath: "img/homeup.png"
        },
        {
          pagePath: "pages/shopping/index",
          text: "购物车",
          iconPath: "img/che.png",
          selectedIconPath: "img/cheup.png"
        },
        {
          pagePath: "pages/user/index",
          text: "我的",
          iconPath: "img/user.png",
          selectedIconPath: "img/userup.png"
        }
      ]
    }
  }

  componentDidMount() {
    CommodityStore.onGetSkuCategoryRoot();
    CommodityStore.Paging.getPagingData(true)
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
