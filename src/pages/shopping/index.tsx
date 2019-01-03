import { Image, Navigator, Text, View, Button } from '@tarojs/components';
import { observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtInputNumber, AtList, AtListItem, AtTag, AtSwipeAction, AtFloatLayout, AtRadio } from 'taro-ui';
import img from '../../img/select.png';
import { CommodityStore, ShoppingStore, UserStore } from '../../store';
import 'taro-ui/dist/weapp/css/index.css';
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
    navigationBarTitleText: '购物车',
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
  onUpdateSelect(index) {
    ShoppingStore.onUpdateSelect(index)
  }
  onUpdateConut(index, count) {
    ShoppingStore.onUpdateCount(index, count)
  }
  onSelectAll(selectAll) {
    ShoppingStore.onUpdateSelectAll(!selectAll)
  }
  onDelete(index) {
    ShoppingStore.onDelete(index)
  }
  onSettlement(coupon = true) {
    if (!UserStore.isLogin) {
      return Taro.showToast({ title: "请先登陆", icon: "none" })
    }
    if (ShoppingStore.total <= 0) {
      return Taro.showToast({ title: "购物车没有商品", icon: "none" })
    }
    if (ShoppingStore.dataList.filter(x => x.select).length <= 0) {
      return Taro.showToast({ title: "未选择结算商品", icon: "none" })
    }
    if (!UserStore.defaultAddress.contactMan) {
      return Taro.showToast({ title: "请设置收货地址", icon: "none" })
    }
    ShoppingStore.onSettlement(coupon)
  }
  onCouponsChange(e) {
    ShoppingStore.onCouponSelect(e);
  }

  onCouponShow() {
    ShoppingStore.onCouponShow(false)
  }
  stopPropagation = (e) => {
    e.stopPropagation()
  }
  render() {
    const { isLogin } = UserStore;
    const dataList = [...ShoppingStore.dataList];
    const selectAll = ShoppingStore.selectAll;
    const totalPrice = ShoppingStore.totalPrice;
    const couponShow = ShoppingStore.couponShow;
    const couponList = [...ShoppingStore.couponList];
    const couponSelect = ShoppingStore.couponSelect;
    const address = UserStore.defaultAddress;
    return (
      <View className='index'>
        <AtList>
          {isLogin ? <Navigator url="/pages/user_address/index">
            <AtListItem className="address-item" title={'收件人：' + (address.contactMan||'未设置')} arrow='right' />
          </Navigator> : <Navigator className="address-item" openType="switchTab" url="/pages/user/index">
              <AtListItem title='请登录' arrow='right' />
            </Navigator>}
        </AtList>
        {dataList.map((data, index) => {
          const price = parseFloat(data.price).toFixed(2)
          const origPrice = parseFloat(data.origPrice).toFixed(2)
          const tag = CommodityStore.onGetTabText(data.categoryId);
          return <AtSwipeAction onClick={this.onDelete.bind(this, index)} key={data.id} options={[
            {
              text: '删除',
              style: {
                backgroundColor: '#FF4545'
              }
            }
          ]}
          >
            <View className="item" onClick={this.onUpdateSelect.bind(this, index)}>
              <View className="select">
                <Image src={data.select ? img : ''} mode="aspectFill" />
              </View>
              <View className="thumbUrl">
                <Image src={data.thumbUrl} mode="aspectFill" />
              </View>
              <View className="data-info">
                <View className='data-name'>
                  {data.text}
                </View>
                <View className='data-price'>
                  <Text>￥{price} </Text> <Text className='origPrice'>￥{origPrice}</Text>
                </View>
                <View className="data-tag">
                  <AtTag size='small'>{tag}</AtTag>
                </View>
              </View>
              <View className="update-count" onClick={this.stopPropagation}>
                <AtInputNumber
                  className="input-number"
                  type="number"
                  min={1}
                  max={9999}
                  step={1}
                  value={data.count}
                  onChange={this.onUpdateConut.bind(this, index)}
                />
              </View>
            </View>
          </AtSwipeAction>
        })}
        <View className="btns" onClick={this.onSelectAll.bind(this, selectAll)}>
          <View className="select" >
            <Image src={selectAll ? img : ''} mode="aspectFill" /><Text>全选</Text>
          </View>
          <View className="price">
            <Text>合计</Text> <Text className="price">￥{totalPrice} </Text>
          </View>
          <View className="btn" onClick={this.stopPropagation}>
            {isLogin ? <Button onClick={this.onSettlement.bind(this)}>去结算</Button> :
              <Navigator openType="switchTab" url="/pages/user/index">
                <Button >登录结算</Button>
              </Navigator>}

          </View>
        </View>
        <AtFloatLayout
          isOpened={couponShow}
          onClose={this.onCouponShow.bind(this)}
          className="select-yhj"
          title='选择优惠券'
        >
          <View className='at-row yhj-price'>
            <View className='at-col left'>小计：</View>
            <View className='at-col right'>￥{totalPrice} </View>
          </View>
          {couponList.map((x, i) => {
            return <View className='at-row yhj-item' key={i} onClick={this.onCouponsChange.bind(this, x)}>
              <View className='at-col left'>{x.text}</View>
              <View className='at-col right'>- <Text>￥{x.amountStr}</Text>
                <Image className="select" src={x.no == couponSelect.no ? img : ''} mode="aspectFill" />
              </View>
            </View>
          })}

          <View className="btns floatlayout">
            <View className="price">
              <Text className="price">￥{totalPrice} </Text>
            </View>
            <View className="btn" onClick={this.stopPropagation}>
              <Button onClick={this.onSettlement.bind(this, false)}>结算</Button>
            </View>
          </View>
        </AtFloatLayout>
      </View>

    )
  }
}

export default Index
