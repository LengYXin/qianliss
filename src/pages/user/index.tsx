import { Button, Image, Navigator, View } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtList, AtListItem } from "taro-ui";
import add from '../../img/address.png';
import order from '../../img/dd.png';
import info from '../../img/info.png';
import phone from '../../img/ipone.png';
import { UserStore } from '../../store';
import './index.less';

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
    navigationBarTitleText: '我的',
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
  onLogin() {
    UserStore.onGetUserInfo()
  }
  makePhoneCall() {
    Taro.makePhoneCall({
      phoneNumber: "15077277658"
    })
  }
  render() {
    const { isLogin, userInfoWX } = UserStore
    return (
      <View className='user'>
        {isLogin ? <View>
          <View className="user-head">
            <View className="head-box">
              <Image className="box-img" src={userInfoWX.avatarUrl} />
              <View className="box-name">{userInfoWX.nickName}</View>
            </View>
          </View>
          <View className="user-line"></View>
          <View className="user-box">
            <View className="box-list">
              <AtList hasBorder={false}>
                <Navigator url="/pages/user_order/index">
                  <AtListItem
                    className="list"
                    title='我的订单'
                    arrow='right'
                    thumb={order}
                  />
                </Navigator>
                <Navigator url="/pages/user_address/index">
                  <AtListItem
                    className="list"
                    title='收货地址'
                    arrow='right'
                    thumb={add}
                    hasBorder={false}
                  />
                </Navigator>
              </AtList>
            </View>
          </View>
        </View>
          : <View className="user-head">
            <Button openType="getUserInfo" onClick={this.onLogin.bind(this)}>微信登陆</Button>
          </View>}
        <View className="user-line"></View>
        <View className="user-shop">
          <View className="shop-list">
            <View className="list-head">
              <Image className="head-icon" src={info} />
              <View className="head-name">店铺信息</View>
            </View>
            <View className="list-content" onClick={this.makePhoneCall.bind(this)}>
              <View className="list-add">柳州－城中区－兆安店</View>
              <View className="list-phone">客服电话：<View className="phoneNum">150 7727 7658</View></View>
              <Image className="phone" src={phone} />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Index
