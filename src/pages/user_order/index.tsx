import { View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';
import { AtTabs, AtTabsPane } from 'taro-ui';
import Item from './item'
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '千里首铺',
    // 下拉刷新
    // enablePullDownRefresh: true,
    // backgroundTextStyle: "dark"
  }
  componentWillMount() {
  }
  componentWillReact() {
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  onSearchBar() { }
  state = {
    current: 0,
  }
  handleClick(value) {
    console.log(value)
    this.setState({
      current: value
    })
  }
  render() {
    const tabList = [{ title: "全部" }, { title: "待支付" }, { title: "待发货" }, { title: "待收货" }, { title: "已完成" }]
    return (
      <View className='user_order'>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            <Item /><Item /><Item />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <Item />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <Item />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <Item />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <Item />
          </AtTabsPane>
        </AtTabs>
      </View >
    )
  }
}

export default Index
